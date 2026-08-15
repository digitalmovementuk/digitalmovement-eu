import { business } from "../content";
import { CONSENT_TEXT } from "./consentText";

/**
 * The one place a lead leaves this site.
 *
 * Both forms previously called preventDefault() and flipped straight to a
 * success state. Nothing was ever sent: every enquiry the site received was
 * shown "thanks, we'll be in touch" and silently discarded. This module
 * exists so that can't happen again — a form may only show success when a
 * submission actually succeeded.
 *
 * Destinations are configured at build time and are deliberately NOT secret:
 * this is a static site on GitHub Pages, so anything referenced here ships to
 * the browser in plain text. Never put a GoHighLevel private token, an SMTP
 * password, or any other credential in this file.
 *
 * Two destination kinds are supported, and every one configured gets a copy:
 *
 *   VITE_WEB3FORMS_KEYS  Comma-separated Web3Forms access keys. Each key
 *                        delivers to the one inbox it was registered to —
 *                        Web3Forms' cc field is a paid feature, so reaching
 *                        two people means two keys, not one key with two
 *                        addresses, hence the fan-out. Unconfigured on the
 *                        German site: the DM handler below is the live route.
 *   VITE_LEAD_ENDPOINT   Optional generic JSON webhook (e.g. a GoHighLevel
 *                        inbound webhook) kept so the CRM can be added later
 *                        without touching the forms.
 */

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

const WEB3FORMS_KEYS = ((import.meta.env.VITE_WEB3FORMS_KEYS as string | undefined) ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);

const WEBHOOK = ((import.meta.env.VITE_LEAD_ENDPOINT as string | undefined) ?? "").trim();

/**
 * Digital Movement's own PHP lead handler, shared with digitalmovement.uk and
 * digitalezahnärzte.de. This is the primary destination — it needs no signup
 * and no third-party account, which is why the site sat unconfigured for so
 * long waiting on a Web3Forms key that never arrived.
 *
 * Its contract is specific and unforgiving, so it gets its own sender rather
 * than reusing the generic webhook path:
 *
 *  - The URL is the subdomain ROOT. There is no /send.php — that path 404s and
 *    cost a sister site every lead it received until it was found.
 *  - Content-Type MUST be text/plain;charset=utf-8. That keeps the request a
 *    CORS *simple* request and avoids a preflight entirely.
 *  - `consent` is REQUIRED. Omit it and the handler rejects the submission.
 *  - `company_website` is the honeypot the handler expects — send it empty.
 *  - The Origin must be on the handler's allowlist or it answers 403.
 *    digitalmovement.eu und www. stehen seit 2026-08-15 auf der Liste.
 *
 * Never use mode:"no-cors" here: the opaque response would report success
 * while the server silently rejected the lead.
 */
const DM_ENDPOINT =
  ((import.meta.env.VITE_DM_LEAD_ENDPOINT as string | undefined) ?? "").trim() ||
  // Deliberately defaulted in code, not left to .env alone. Nothing here is a
  // secret — every value in a static build ships to the browser anyway — and an
  // env var that can go missing is precisely how this site spent months
  // showing a thank-you while delivering nothing. A fresh clone builds working.
  "https://leads.digitalmovement.uk/";

export type LeadPayload = {
  name: string;
  /**
   * The required contact field on every form. These are enquiries we ring
   * back, and an address that is well-formed but wrong is a dead lead we
   * cannot tell from a live one. Typed as required, like consent, so a new
   * form cannot quietly omit it.
   */
  phone: string;
  email?: string;
  service?: string;
  message?: string;
  /**
   * Whether the visitor ticked the consent box. Required — a lead without
   * recorded consent must not be transmitted, and the DM handler rejects it
   * anyway. Typed as required rather than optional so a new form cannot forget
   * it and fail silently at runtime.
   */
  consent: boolean;
  /** Which form on the site it came from — useful for attribution. */
  source: string;
};

export type LeadResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "network" | "rejected"; detail?: string };

/** Where to tell the user to go when we genuinely cannot take the lead. */
export const FALLBACK_EMAIL = business.email;

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  // Consent is a precondition, not a field. Refuse before any network call —
  // an untransmitted lead is recoverable, a lead sent without recorded consent
  // is not.
  if (!payload.consent) {
    console.error("[lead] Refusing to send: consent was not given.");
    return { ok: false, reason: "rejected", detail: "consent missing" };
  }

  const destinations = WEB3FORMS_KEYS.length + (WEBHOOK ? 1 : 0) + (DM_ENDPOINT ? 1 : 0);

  if (destinations === 0) {
    // No destination configured. Say so loudly rather than pretending the
    // lead was received — a false success is worse than a visible failure,
    // because the visitor walks away believing they've made contact.
    console.error(
      "[lead] No delivery destination configured (VITE_WEB3FORMS_KEYS / VITE_LEAD_ENDPOINT) — this submission was not delivered.",
    );
    return { ok: false, reason: "unconfigured" };
  }

  const submittedAt = new Date().toISOString();
  const pageUrl = typeof window !== "undefined" ? window.location.href : undefined;

  const sends: Promise<LeadResult>[] = [
    ...WEB3FORMS_KEYS.map((key) =>
      post(WEB3FORMS_ENDPOINT, {
        access_key: key,
        // What lands in the inbox. Naming the source makes triage possible
        // when two forms feed the same address.
        subject: `Neue Anfrage über digitalmovement.eu (${payload.source})`,
        from_name: "digitalmovement.eu",
        // Replying to the notification replies to the enquirer, not to us.
        // Email is optional, so when it is absent these envelope fields fall
        // back to our own address: Web3Forms requires them, and the reply
        // route for such an enquiry is the phone number in the body anyway.
        replyto: payload.email || FALLBACK_EMAIL,
        name: payload.name,
        email: payload.email || FALLBACK_EMAIL,
        phone: payload.phone,
        service: payload.service || "—",
        message: payload.message || "—",
        page_url: pageUrl,
        submitted_at: submittedAt,
        // Web3Forms' own honeypot. The forms carry a separate one that stops
        // the send before it reaches here; this is the server-side backstop.
        botcheck: false,
      }),
    ),
    ...(WEBHOOK ? [post(WEBHOOK, { ...payload, submittedAt, pageUrl })] : []),
    ...(DM_ENDPOINT
      ? [
          postDm(DM_ENDPOINT, {
            name: payload.name,
            email: payload.email || "",
            phone: payload.phone,
            service: payload.service || "",
            message: payload.message || "",
            // The handler's honeypot. Real submissions always send it empty;
            // our own honeypot has already dropped the bot before this point.
            company_website: "",
            consent: "yes",
            // Wortgleich der Satz, den die Besucherin gesehen hat. Nicht hier
            // ausformulieren — sonst weicht der Beleg vom Gelesenen ab.
            consent_text: CONSENT_TEXT,
            consent_timestamp: submittedAt,
            page_url: pageUrl ?? "",
            form_id: payload.source,
          }),
        ]
      : []),
  ];

  const results = await Promise.all(sends);
  const delivered = results.filter((r) => r.ok).length;

  if (delivered === 0) {
    // Every destination failed — surface it. Return the first failure so the
    // reason is specific rather than a generic "something went wrong".
    return results[0] as Exclude<LeadResult, { ok: true }>;
  }

  if (delivered < destinations) {
    // Partial delivery. The lead is captured, so the visitor gets their
    // success — but this must not pass silently, because it means one of the
    // people who should see this enquiry did not.
    console.error(
      `[lead] Delivered to ${delivered}/${destinations} destinations. Failures:`,
      results.filter((r) => !r.ok),
    );
  }

  return { ok: true };
}

/**
 * Sender for the Digital Movement PHP handler. Differs from post() in two ways
 * that matter and are easy to "tidy" into breakage:
 *
 *  1. Content-Type is text/plain — NOT application/json. The body is still
 *     JSON; the header is what keeps this a CORS simple request with no
 *     preflight. Changing it to application/json would work only as long as
 *     the handler keeps answering OPTIONS correctly.
 *  2. The handler answers HTTP 200 with {ok:false,error:"…"} for its own
 *     rejections — a bad origin, a missing consent field. Checking res.ok
 *     alone would read those as successes, so the body is parsed too.
 */
async function postDm(url: string, body: Record<string, unknown>): Promise<LeadResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { ok: false, reason: "rejected", detail: `HTTP ${res.status}` };
    }

    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!data || data.ok !== true) {
      return { ok: false, reason: "rejected", detail: data?.error ?? "handler returned ok:false" };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "network",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

async function post(url: string, body: Record<string, unknown>): Promise<LeadResult> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { ok: false, reason: "rejected", detail: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "network",
      detail: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * GA4 key event, fired only on a genuine success. Wiring it to the submit
 * handler instead would have counted every discarded lead as a conversion.
 *
 * This must go through `gtag("event", …)`. Pushing `{ event: "generate_lead" }`
 * straight onto dataLayer is Tag Manager's convention; the site loads gtag.js
 * directly, which ignores that shape — so the event would never reach GA4 and
 * the property would sit at zero key events looking perfectly healthy.
 */
export function trackLead(source: string) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  w.gtag("event", "generate_lead", { form_source: source });
}

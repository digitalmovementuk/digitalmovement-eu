/**
 * GA4 — geladen erst nach Einwilligung, nie davor.
 *
 * Warum nicht der übliche Weg mit Consent Mode auf "denied"? Weil § 25 TDDDG
 * die Einwilligung an das *Speichern und Auslesen* auf dem Endgerät knüpft,
 * und weil selbst ein cookieloser Treffer die IP-Adresse an Google überträgt —
 * eine Verarbeitung, die ohne Einwilligung eine eigene Rechtsgrundlage
 * bräuchte. Die deutschen Aufsichtsbehörden halten Google Analytics ohne
 * Einwilligung für unzulässig. Also: gar kein Skript, bis jemand zustimmt.
 *
 * Der Preis ist bekannt und gewollt: wer ablehnt, wird nicht gezählt. Lieber
 * eine Zahl, die kleiner und rechtmäßig ist, als eine, die vollständig ist
 * und abgemahnt wird.
 *
 * Die Einwilligung liegt im localStorage, nicht in einem Cookie — sie wird
 * nie an einen Server geschickt, also braucht sie auch keinen Cookie. Das
 * Ablegen der eigenen Entscheidung ist nach § 25 Abs. 2 Nr. 2 TDDDG
 * "unbedingt erforderlich" und deshalb selbst nicht einwilligungspflichtig.
 */

export const CONSENT_KEY = "dm-eu-consent-v1";

/** Version des Banner-Textes. Ändert sich der Text, ist die alte
 *  Einwilligung nicht mehr die, der zugestimmt wurde — dann fragt das
 *  Banner erneut. Genau dafür steht die Zahl im Schlüsselnamen. */
export type ConsentValue = {
  analytics: boolean;
  /** Zeitpunkt der Entscheidung, ISO-8601. Nachweis nach Art. 7 Abs. 1 DSGVO. */
  ts: string;
};

export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as ConsentValue;
    return typeof v?.analytics === "boolean" ? v : null;
  } catch {
    /* Privater Modus oder gesperrter Speicher: dann gilt "keine Entscheidung",
       das Banner erscheint erneut und es wird nichts geladen. Kein Absturz. */
    return null;
  }
}

/** Wird ausgelöst, sobald jemand zugestimmt ODER abgelehnt hat. Andere
 *  Bauteile dürfen erst danach eigene Fenster öffnen — siehe
 *  LeadCaptureModal. */
export const CONSENT_DECIDED_EVENT = "dm:consent-decided";

export function writeConsent(analytics: boolean): ConsentValue {
  const v: ConsentValue = { analytics, ts: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(v));
  } catch {
    /* absichtlich still — siehe oben */
  }
  try {
    window.dispatchEvent(new CustomEvent(CONSENT_DECIDED_EVENT));
  } catch {
    /* absichtlich still */
  }
  return v;
}

export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* absichtlich still */
  }
}

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;

let geladen = false;

/**
 * Lädt gtag.js und schaltet die Messung ein. Mehrfach aufrufbar — der zweite
 * Aufruf tut nichts, sonst stünde das Skript zweimal im Kopf und jeder
 * Seitenaufruf würde doppelt gezählt.
 */
export function enableAnalytics() {
  if (typeof window === "undefined" || !GA4_ID || geladen) return;
  geladen = true;

  const w = window as unknown as {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.gtag = function gtag() {
    w.dataLayer.push(arguments);
  };

  /* Consent Mode v2. Analyse ist erlaubt — hier steht der Aufruf ja nur,
     weil zugestimmt wurde. Werbung bleibt aus: die Seite schaltet keine
     Anzeigen und misst keine, also gibt es dafür auch keine Einwilligung
     einzuholen. Wer das später ändert, muss das Banner erweitern, nicht
     diese Zeilen. */
  w.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  w.gtag("js", new Date());
  w.gtag("config", GA4_ID, { anonymize_ip: true });

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
}

/** Beim Laden der Seite: nur einschalten, wenn schon zugestimmt wurde. */
export function initAnalyticsFromStoredConsent() {
  if (readConsent()?.analytics) enableAnalytics();
}

/** Widerruf. Das Skript lässt sich nicht zurücknehmen, deshalb wird die
 *  Seite neu geladen — sonst liefe gtag.js bis zum nächsten Aufruf weiter
 *  und der Widerruf wäre nur behauptet. Zusätzlich werden die _ga-Cookies
 *  gelöscht, die es bis dahin gesetzt hat. */
export function disableAnalyticsAndReload() {
  try {
    document.cookie.split(";").forEach((c) => {
      const name = c.split("=")[0]?.trim();
      if (!name || !/^_ga/.test(name)) return;
      const host = window.location.hostname;
      for (const d of [host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`]) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${d}`;
      }
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    });
  } catch {
    /* absichtlich still */
  }
  window.location.reload();
}

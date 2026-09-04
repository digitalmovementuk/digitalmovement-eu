import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { business, hero } from "../content";
import { ConsentCheckbox, ConsentNotice } from "./Consent";
import { LEAD_FIELD_ORDER, validateLead, websiteMessage, type LeadFieldErrors } from "../lib/leadForm";
import { submitLead, trackLead } from "../lib/submitLead";

/* DAS Anfrageformular — einmal gebaut, zweimal eingesetzt (Startbereich und
   Kontaktabschnitt). Seit dem Design-Audit vom 04.09.2026 gibt es keinen
   zweiten Formularstil mehr: gleiche Felder, gleiche Reihenfolge, gleiche
   Prüfung, gleiche Farben. `idPrefix` hält die Feld-IDs auseinander,
   `formId` und `source` bleiben, wie die Messung sie kennt. */
export function LeadForm({
  idPrefix,
  formId,
  source,
  title,
  intro,
}: {
  idPrefix: "h" | "c";
  formId: "hero-form" | "contact-form";
  source: "home-hero" | "contact-section";
  title?: string;
  intro?: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [service, setService] = useState(hero.serviceOptions[0]);
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const fid = (k: string) => `${idPrefix}-${k}`;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honey) return;
    const next = validateLead({ name, phone, website, consent });
    setErrors(next);
    const first = LEAD_FIELD_ORDER.find((k) => next[k]);
    if (first) {
      const el =
        first === "consent"
          ? (e.currentTarget.querySelector('input[name="consent"]') as HTMLElement | null)
          : (document.getElementById(fid(first)) as HTMLElement | null);
      el?.focus();
      return;
    }
    setSending(true);
    setFailed(false);
    const res = await submitLead({
      name,
      phone,
      email: email || undefined,
      service,
      message: websiteMessage(website),
      consent,
      source,
    });
    setSending(false);
    if (res.ok) {
      setSent(true);
      trackLead(source);
    } else {
      setFailed(true);
    }
  }

  if (sent) {
    return (
      <div className="card" role="status" aria-live="polite">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
            <Check size={22} strokeWidth={3} aria-hidden />
          </span>
          <p className="h3">{hero.formSuccessTitle}</p>
        </div>
        <p className="copy mt-4">{hero.formSuccess}</p>
        <p className="small mt-3">
          Oder direkt:{" "}
          <a href={business.phoneHref} className="underline underline-offset-2">
            {business.phone}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form id={formId} className="card" onSubmit={onSubmit} noValidate>
      {title ? <p className="h3">{title}</p> : null}
      {intro ? <p className="copy mt-2 text-[16px]">{intro}</p> : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor={fid("name")}>{hero.fields.name.label}</label>
          <input
            id={fid("name")}
            name="name"
            type="text"
            autoComplete="name"
            required
            className="input"
            placeholder={hero.fields.name.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? fid("name-err") : undefined}
          />
          {errors.name ? (
            <p id={fid("name-err")} className="form-error">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={fid("phone")}>{hero.fields.phone.label}</label>
          <input
            id={fid("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            className="input"
            placeholder={hero.fields.phone.placeholder}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? fid("phone-err") : undefined}
          />
          {errors.phone ? (
            <p id={fid("phone-err")} className="form-error">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor={fid("email")}>{hero.fields.email.label}</label>
          <input
            id={fid("email")}
            name="email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder={hero.fields.email.placeholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor={fid("website")}>{hero.fields.website.label}</label>
          <input
            id={fid("website")}
            name="site"
            type="url"
            inputMode="url"
            autoComplete="url"
            required
            className="input"
            placeholder={hero.fields.website.placeholder}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            aria-invalid={errors.website ? true : undefined}
            aria-describedby={errors.website ? fid("website-err") : undefined}
          />
          {errors.website ? (
            <p id={fid("website-err")} className="form-error">
              {errors.website}
            </p>
          ) : null}
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor={fid("service")}>{hero.fields.service.label}</label>
          <select
            id={fid("service")}
            name="service"
            required
            className="input"
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            {hero.serviceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Honigtopf: Menschen sehen das Feld nicht, Bots füllen es. */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={fid("hp")}>Bitte leer lassen</label>
        <input
          id={fid("hp")}
          name="_honey"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honey}
          onChange={(e) => setHoney(e.target.value)}
        />
      </div>

      <div className="mt-5">
        <ConsentCheckbox
          id={fid("consent")}
          checked={consent}
          onChange={setConsent}
          invalid={!!errors.consent}
          describedBy={errors.consent ? fid("consent-err") : undefined}
        />
        {errors.consent ? (
          <p id={fid("consent-err")} className="form-error mt-2">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
          {sending ? hero.formSending : hero.formCta}
        </button>
      </div>

      <p className="form-status small mt-3" role="status" aria-live="polite">
        {failed ? <span className="form-error">{hero.formError}</span> : hero.formNote}
      </p>

      <div className="mt-4">
        <ConsentNotice />
      </div>

      <noscript>
        <p className="small mt-3">
          Ohne JavaScript: rufen Sie {business.phone} an oder schreiben Sie an {business.email}.
        </p>
      </noscript>
    </form>
  );
}

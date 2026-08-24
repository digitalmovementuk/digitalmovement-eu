import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { hero } from "../content";
import { submitLead, trackLead } from "../lib/submitLead";
import { CONSENT_TEXT } from "../lib/consentText";
import "../styles/hero-uk.css";

/**
 * Startbereich — die Übernahme des Hero von digitalmovement.uk.
 * Version 1.0 · Stand 24.08.2026
 *
 * Änderungen 1.0 (24.08.2026): ersetzt das Video-Karussell mit drei
 * Textblöcken. Auf Weisung RMU: „Fully copy the hero of digitalmovement.uk
 * and place in digitalmovement.eu, but all translated in German. Must all
 * be identical, especially design and style."
 *
 * Aufbau, wie auf der englischen Seite und in dieser Reihenfolge:
 *   Etikett → Überschrift (mit unterlegtem Farbverlauf auf dem letzten
 *   Wort) → Fließtext → „Gefunden werden bei" mit vier Marken →
 *   Belegzeile (Bewertung + zwei Kennzahlen)   |   Anfrageformular
 *
 * Was hier absichtlich anders ist als in der Vorlage
 * --------------------------------------------------
 *  - Kein Preissatz. Die englische Fassung nennt „from £495 a month";
 *    für Deutschland ist kein Preis freigegeben, und ein umgerechneter
 *    wäre erfunden. Begründung steht bei `hero` in content.ts.
 *  - Das Formular sendet über submitLead, nicht als natives POST an den
 *    Endpunkt. Grund: die deutsche Seite braucht die Einwilligung als
 *    harte Vorbedingung im Code und den freigegebenen Einwilligungstext
 *    im Nutzdatensatz — beides kann ein natives Formular nicht liefern.
 *  - `LeadPayload` kennt kein Feld `website`. Die Adresse wandert deshalb
 *    in `message`. Ein neues Feld zu erfinden hieße, es an einem
 *    Endpunkt vorbeizuschicken, der es nicht liest.
 *
 * Zwei Dinge, die bleiben müssen, sonst bricht die Kopfzeile
 * ----------------------------------------------------------
 *  1. `id="top"` — Nav.tsx misst daran, wann es in den kompakten Zustand
 *     wechselt.
 *  2. `data-surface="dark"` — Nav.tsx liest daran ab, ob es hell oder
 *     dunkel gezeichnet wird. Ohne das Attribut steht helle Schrift auf
 *     hellem Grund, sobald man oben steht.
 *
 * Und zwei, die für die Anfragen zählen:
 *  3. Telefon ist Pflicht, E-Mail optional — auf jedem Formular jeder
 *     Digital-Movement-Seite.
 *  4. Ohne gesetztes Häkchen geht nichts raus: submitLead verweigert die
 *     Übertragung, bevor irgendein Netzwerkaufruf passiert.
 */

const BASE = import.meta.env.BASE_URL;
const LOGO_DIR = `${BASE}brand/hero-uk/logos/`;

type FieldErrors = {
  name?: string;
  phone?: string;
  website?: string;
  consent?: string;
};

/* Der Endpunkt bekommt die Adresse als Text. Ohne Schema ist "ihrefirma.de"
   für jedes spätere Werkzeug ein relativer Pfad, nicht eine Website —
   deshalb hier einmal sauber ergänzen statt später raten. */
function normaliseUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export function Hero() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [service, setService] = useState(hero.serviceOptions[0]);
  const [consent, setConsent] = useState(false);
  const [honey, setHoney] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (honey) return; // Honigtopf getroffen — kommentarlos verwerfen
      if (sending || sent) return;

      const next: FieldErrors = {};
      if (!name.trim()) next.name = hero.errRequiredName;
      if (!phone.trim()) next.phone = hero.errRequiredPhone;
      if (!website.trim()) next.website = hero.errRequiredWebsite;
      if (!consent) next.consent = hero.errConsent;

      setErrors(next);
      if (Object.keys(next).length > 0) {
        /* Zum ersten fehlenden Feld springen. Auf dem Telefon steht der
           Fehler sonst außerhalb des Bildschirms und das Formular wirkt,
           als sei der Knopf kaputt. */
        const order = ["name", "phone", "website", "consent"] as const;
        const first = order.find((k) => next[k]);
        if (first) {
          const el = document.querySelector<HTMLElement>(
            first === "consent" ? '.uk-hero .consent input' : `#h-${first}`,
          );
          el?.focus();
        }
        return;
      }

      setSending(true);
      setFailed(false);

      const result = await submitLead({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        service,
        message: `Website: ${normaliseUrl(website)}`,
        consent,
        source: "home-hero",
      });

      setSending(false);

      if (result.ok) {
        trackLead("home-hero");
        setSent(true);
      } else {
        setFailed(true);
      }
    },
    [consent, email, honey, name, phone, sending, sent, service, website],
  );

  /* Der Status steht in einem Bereich, der immer gerendert wird — ein
     Element, das erst beim Erfolg entsteht, wird von Screenreadern nicht
     zuverlässig vorgelesen. Leer bekommt er über :empty seine Ränder
     genommen. */
  const status = useMemo(() => {
    if (sent) return hero.formSuccess;
    if (failed) return hero.formError;
    return "";
  }, [failed, sent]);

  return (
    <header id="top" className="uk-hero" data-surface="dark">
      {/* ---------- Hintergrundbild + Schleier ---------- */}
      <div className="hero-bg">
        <img
          src={`${BASE}brand/hero-uk/hero-agency.jpg`}
          alt=""
          width={1600}
          height={900}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="hero-veil" aria-hidden />

      <div className="wrap hero-grid">
        {/* ---------- Linke Säule: Text ---------- */}
        <div>
          <span className="ilabel">{hero.label}</span>

          <h1>
            <span className="nb">{hero.headlineNoBreak}</span>
            {hero.headlineRest}
            <span className="underline-accent">{hero.headlineAccent}</span>
          </h1>

          <p className="lede">{hero.lede}</p>

          <div className="findrow">
            <span className="lab">{hero.findLabel}</span>
            <div className="applogos">
              {hero.apps.map((app) => (
                <span className="app" key={app.key}>
                  <img src={`${LOGO_DIR}${app.icon}`} width={19} height={19} alt="" />
                  {app.label}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-proof">
            <a className="gwidget" href={hero.reviewsHref} target="_blank" rel="noopener noreferrer">
              <span className="gstars" aria-hidden>
                ★★★★★
              </span>
              <span className="gtxt">
                <b>{hero.reviewsRating}</b> {hero.reviewsText}
              </span>
            </a>
            {hero.stats.map((s) => (
              <div className="hstat" key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Rechte Säule: Anfrageformular ----------
            noValidate: die Meldungen des Browsers kommen in der Sprache
            des Browsers, nicht in der der Seite, und verdecken unsere
            eigenen. Die required-Attribute bleiben trotzdem stehen — sie
            sind das, was ein Screenreader vorliest. */}
        <form className="lead-form" id="hero-form" onSubmit={onSubmit} noValidate>
          <h2>{hero.formTitle}</h2>
          <p className="form-intro">{hero.formIntro}</p>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="h-name">{hero.fields.name.label}</label>
              <input
                id="h-name"
                name="name"
                autoComplete="name"
                placeholder={hero.fields.name.placeholder}
                required
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "h-name-err" : undefined}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name ? (
                <p className="form-error" id="h-name-err">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="form-field">
              <label htmlFor="h-phone">{hero.fields.phone.label}</label>
              <input
                id="h-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={hero.fields.phone.placeholder}
                required
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? "h-phone-err" : undefined}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone ? (
                <p className="form-error" id="h-phone-err">
                  {errors.phone}
                </p>
              ) : null}
            </div>

            <div className="form-field form-wide">
              <label htmlFor="h-email">{hero.fields.email.label}</label>
              <input
                id="h-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={hero.fields.email.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-field form-wide">
              <label htmlFor="h-website">{hero.fields.website.label}</label>
              <input
                id="h-website"
                name="site"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder={hero.fields.website.placeholder}
                required
                aria-invalid={errors.website ? true : undefined}
                aria-describedby={errors.website ? "h-website-err" : undefined}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
              {errors.website ? (
                <p className="form-error" id="h-website-err">
                  {errors.website}
                </p>
              ) : null}
            </div>

            <div className="form-field form-wide">
              <label htmlFor="h-service">{hero.fields.service.label}</label>
              <select
                id="h-service"
                name="service"
                required
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {hero.serviceOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              required
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? "h-consent-err" : undefined}
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>
              {CONSENT_TEXT} Siehe unsere <Link to="/datenschutz">Datenschutzerklärung</Link>.
            </span>
          </label>
          {errors.consent ? (
            <p className="form-error" id="h-consent-err">
              {errors.consent}
            </p>
          ) : null}

          {/* Honigtopf. Nicht „website" nennen — der gemeinsame Endpunkt
              liest ein so benanntes Feld als echte Adresse des
              Anfragenden. Aus demselben Grund heißt das echte Feld oben
              `site`. */}
          <div className="sr-only" aria-hidden data-hp>
            <label htmlFor="hp-0-home">Dieses Feld bitte leer lassen</label>
            <input
              id="hp-0-home"
              name="_honey"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={sending || sent}>
            {sending ? hero.formSending : hero.formCta}
            {!sending && !sent ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            ) : null}
          </button>

          <p className="form-status" role="status" aria-live="polite">
            {status}
          </p>

          <p className="form-note">{hero.formNote}</p>
        </form>
      </div>
    </header>
  );
}

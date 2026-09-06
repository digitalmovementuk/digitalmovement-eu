import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { business, contact, hero } from "../content";
import { Reveal } from "../lib/Reveal";
import { submitLead, trackLead } from "../lib/submitLead";
import { LEAD_FIELD_ORDER, websiteMessage, validateLead } from "../lib/leadForm";
import type { LeadFieldErrors } from "../lib/leadForm";
import { ConsentCheckbox, ConsentNotice } from "./Consent";

/**
 * Kontaktabschnitt.
 * Version 1.1 · Stand 24.08.2026
 *
 * Änderungen 1.1 (24.08.2026): Das Formular ist Feld für Feld und Wort für
 * Wort dasselbe wie im Startbereich. Auf Weisung RMU: „Make sure the data
 * fields and content of contact form at bottom of page is synced with
 * contact form in hero."
 *
 * Was das konkret geändert hat:
 *   - Felder: vorher Name · Telefon · E-Mail · Unternehmen · Leistung ·
 *     Freitext. Jetzt Name · Telefon · E-Mail · Website · „Was soll am
 *     meisten wachsen?" — dieselben fünf, in derselben Reihenfolge.
 *   - Beschriftungen, Platzhalter, Auswahlliste, Überschrift, Einleitung,
 *     Knopfbeschriftung, Hinweiszeile und Fehlertexte kommen jetzt aus
 *     `hero` in content.ts. Sie stehen nur noch einmal auf der Platte.
 *   - Prüfung: Name, Telefon, Website und Häkchen sind Pflicht, E-Mail
 *     bleibt optional. Vorher prüfte dieses Formular nichts selbst und
 *     überließ alles dem Browser.
 *   - Der Knopf heißt „Kostenlose Analyse anfordern" statt „Nachricht
 *     senden". Zwei verschiedene Beschriftungen für denselben Schritt
 *     waren zwei Angebote auf einer Seite.
 *
 * Bewusst NICHT übernommen ist die Optik: der Startbereich steht auf
 * Dunkel und trägt deshalb Flüssigglas, dieser Abschnitt steht auf Weiß.
 * Ein transparentes Formular auf hellem Grund hätte hier keine Kanten.
 * Angeglichen sind Inhalt und Felder, nicht die Oberfläche.
 *
 * Der Erfolgszustand wird ausschließlich gezeigt, wenn die Übertragung
 * wirklich geklappt hat. In der Vorlage stand hier einmal ein blankes
 * setSubmitted(true) — das Formular bedankte sich und warf die Anfrage
 * weg. Nicht wieder einbauen.
 */
export function Contact() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [service, setService] = useState(hero.serviceOptions[0]);
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // Honigtopf

  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (hp) return; // Honigtopf getroffen — kommentarlos verwerfen, so erwarten es Bots
      if (sending || submitted) return;

      const next = validateLead({ name, phone, website, consent });
      setErrors(next);
      if (Object.keys(next).length > 0) {
        const first = LEAD_FIELD_ORDER.find((k) => next[k]);
        if (first) {
          document.getElementById(first === "consent" ? "c-consent" : `c-${first}`)?.focus();
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
        message: websiteMessage(website),
        consent,
        source: "contact-section",
      });

      setSending(false);

      if (result.ok) {
        trackLead("contact-section");
        setSubmitted(true);
      } else {
        setFailed(true);
      }
    },
    [name, phone, email, website, service, consent, hp, sending, submitted],
  );

  return (
    <section
      id="contact"
      data-surface="light"
      className="surface-light relative pt-28 sm:pt-32 md:pt-36 pb-28 sm:pb-32 md:pb-36"
    >
      <div className="container-v3 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] gap-12 lg:gap-16 xl:gap-20 items-start">
        {/* Links — Text und Kontaktwege */}
        <div className="text-center lg:text-left">
          <Reveal>
            <p className="eyebrow text-ink-muted">{contact.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-5 max-w-[34ch] mx-auto lg:mx-0 balance text-ink"
              style={{
                fontSize: "clamp(28px, 2.5vw, 36px)",
                lineHeight: "1.04",
                letterSpacing: "-0.034em",
                fontWeight: 700,
              }}
            >
              {contact.headlinePre}
              <span className="block text-ink/55">{contact.headlineSoft}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[480px] mx-auto lg:mx-0 text-[15.5px] sm:text-[17px] text-ink-soft leading-relaxed">
              {contact.intro}
            </p>
          </Reveal>

          <ul className="mt-10 space-y-3">
            {contact.tiles.map((t) => (
              <ContactTile
                key={t.kicker}
                icon={ICONS[t.kicker] ?? <Mail size={18} />}
                label={t.kicker}
                value={t.value}
                caption={CAPTIONS[t.kicker] ?? ""}
                href={t.href}
                external={t.external}
                tone={t.kicker === "WhatsApp" ? "whatsapp" : undefined}
              />
            ))}
          </ul>
        </div>

        {/* Rechts — Formular. Felder und Text identisch mit dem Startbereich. */}
        <div className="rounded-[28px] sm:rounded-[36px] border border-ink/10 bg-white p-6 sm:p-8 md:p-10 shadow-card">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                id="contact-form"
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                {/* Wortgleich mit dem Startbereich, aber eine Ebene tiefer:
                    die Überschrift dieses Abschnitts ist die H2 links, und
                    zwei H2 nebeneinander würden die Gliederung der Seite
                    zerlegen. */}
                <div>
                  <h3
                    className="text-ink"
                    style={{
                      fontSize: "clamp(19px, 1.5vw, 22px)",
                      lineHeight: "1.15",
                      letterSpacing: "-0.02em",
                      fontWeight: 700,
                    }}
                  >
                    {hero.formTitle}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                    {hero.formIntro}
                  </p>
                </div>

                {/* Reihenfolge wie oben: Name · Telefon, dann E-Mail ·
                    Website, dann die Auswahl über die volle Breite.
                    Telefon ist Pflicht, E-Mail optional — das sind
                    Anfragen, die wir zurückrufen, und eine gültige, aber
                    falsche E-Mail-Adresse ist ein toter Kontakt, den man
                    von einem lebenden nicht unterscheiden kann. */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <Field
                    id="c-name"
                    label={hero.fields.name.label}
                    error={errors.name}
                  >
                    <input
                      id="c-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={hero.fields.name.placeholder}
                      required
                      aria-invalid={errors.name ? true : undefined}
                      aria-describedby={errors.name ? "c-name-err" : undefined}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  <Field
                    id="c-phone"
                    label={hero.fields.phone.label}
                    error={errors.phone}
                  >
                    <input
                      id="c-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={hero.fields.phone.placeholder}
                      required
                      aria-invalid={errors.phone ? true : undefined}
                      aria-describedby={errors.phone ? "c-phone-err" : undefined}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <Field id="c-email" label={hero.fields.email.label}>
                    <input
                      id="c-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={hero.fields.email.placeholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                  {/* Das Feld heißt `site`, nicht `website` — wie oben.
                      Der gemeinsame Endpunkt liest ein Feld namens
                      „website" als Honigtopf und verwirft die Anfrage
                      still. */}
                  <Field
                    id="c-website"
                    label={hero.fields.website.label}
                    error={errors.website}
                  >
                    <input
                      id="c-website"
                      name="site"
                      type="url"
                      inputMode="url"
                      autoComplete="url"
                      placeholder={hero.fields.website.placeholder}
                      required
                      aria-invalid={errors.website ? true : undefined}
                      aria-describedby={errors.website ? "c-website-err" : undefined}
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <Field id="c-service" label={hero.fields.service.label}>
                  <select
                    id="c-service"
                    name="service"
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={selectCls}
                  >
                    {hero.serviceOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Honigtopf — das Feld, das Bots gern ausfüllen. Heißt
                    `_honey`, damit es auch ohne React greift. Niemals
                    „website" nennen: der gemeinsame Endpunkt liest dieses
                    Feld als echte URL der anfragenden Person, eine echte
                    Anfrage würde also still verworfen. */}
                <label className="absolute -left-[9999px] opacity-0" aria-hidden>
                  Dieses Feld bitte leer lassen
                  <input
                    type="text"
                    name="_honey"
                    tabIndex={-1}
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    autoComplete="off"
                  />
                </label>

                <ConsentCheckbox
                  id="c-consent"
                  checked={consent}
                  onChange={setConsent}
                  invalid={Boolean(errors.consent)}
                  describedBy={errors.consent ? "c-consent-err" : undefined}
                />
                {errors.consent ? (
                  <p id="c-consent-err" role="alert" className="text-[12.5px] text-[#B3261E]">
                    {errors.consent}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#EC178D] hover:bg-[#d4147f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-[15px] py-3 transition-colors"
                >
                  {sending ? (
                    hero.formSending
                  ) : (
                    <>
                      {hero.formCta} <ArrowRight size={15} />
                    </>
                  )}
                </button>

                {failed ? (
                  <p role="alert" className="text-[13px] leading-relaxed text-[#B3261E]">
                    {hero.formError}
                  </p>
                ) : null}

                <p className="text-[12px] text-ink-muted">{hero.formNote}</p>

                <ConsentNotice />

                {/* Ohne JavaScript kommt aus diesem Formular nichts an — der Versand
              läuft über fetch(). Eine Schaltfläche, die dann ins Leere führt,
              ist schlimmer als gar keine: sie sieht aus wie eine abgeschickte
              Anfrage. Also nennen wir in diesem Fall den Weg, der ohne
              JavaScript funktioniert. */}
                <noscript>
                  <p className="text-[12px] text-ink-muted">
                    Ohne JavaScript kann dieses Formular nichts absenden. Rufen Sie uns an unter{" "}
                    <a className="underline" href={business.phoneHref}>
                      {business.phone}
                    </a>{" "}
                    oder schreiben Sie an{" "}
                    <a className="underline" href={`mailto:${business.email}`}>
                      {business.email}
                    </a>
                    .
                  </p>
                </noscript>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-4"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white">
                  <Check size={26} strokeWidth={3} />
                </div>
                <h3 className="mt-5 text-[24px] font-extrabold text-ink">Angekommen.</h3>
                <p className="mt-2 text-ink-soft leading-relaxed">{hero.formSuccess}</p>

                <div className="mt-7 rounded-2xl border border-ink/10 bg-surface-2 p-5 text-left space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/8 text-ink">
                      <Clock size={15} strokeWidth={2.4} />
                    </span>
                    <div className="text-[13px] text-ink-soft leading-relaxed">
                      <p className="font-bold text-ink">Antwort innerhalb 2 Stunden</p>
                      <p>Werktags. Danach 30 Minuten Screen-Share, wenn es passt.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/8 text-ink">
                      <Mail size={14} strokeWidth={2.4} />
                    </span>
                    <div className="text-[13px] text-ink-soft leading-relaxed">
                      <p className="font-bold text-ink">Antwort per E-Mail</p>
                      <p>
                        Wir melden uns von{" "}
                        <a
                          href={business.emailHref}
                          className="text-ink underline underline-offset-2 hover:opacity-80"
                        >
                          {business.email}
                        </a>
                        . Am besten gleich als sicher markieren.
                      </p>
                    </div>
                  </div>
                </div>

                <a href={business.phoneHref} className="btn btn-ghost mt-6 inline-flex">
                  <Phone size={14} /> Oder rufen Sie direkt an
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  Telefon: <Phone size={18} />,
  WhatsApp: <MessageCircle size={18} />,
  "E-Mail": <Mail size={18} />,
  Adresse: <MapPin size={18} />,
};

const CAPTIONS: Record<string, string> = {
  Telefon: "Werktags, direkt beim Gründer",
  WhatsApp: "Kurze Frage? Einfach schreiben",
  "E-Mail": "Antwort innerhalb 2 Stunden",
  Adresse: "Berlin-Schöneberg",
};

const inputCls =
  "w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink placeholder:text-ink-faint outline-none transition focus:border-ink/55 focus:bg-white focus:ring-2 focus:ring-ink/10";

const selectCls = `${inputCls} appearance-none pr-10`;

/**
 * Ein beschriftetes Feld. `id` ist Pflicht, nicht optional: vorher zeigte
 * das `htmlFor` auf den Feldnamen, den kein Element trug — die Beschriftung
 * gehörte zu nichts, und ein Klick darauf setzte den Schreibzeiger nicht.
 */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Das Feld steht NEBEN der Beschriftung, nicht darin. Umschlossen
          zählt der Vorlesetext des Auswahlfeldes alle fünf Optionen zur
          Beschriftung hinzu — gemessen am gerenderten Bild:
          „Was soll am meisten wachsen?SEO-AnalyseSichtbarkeit in der
          KI-Suche…". Kein Sternchen: der Startbereich markiert Pflicht
          nicht, sondern nennt umgekehrt das eine freiwillige Feld
          „E-Mail (optional)". Zwei Konventionen auf einer Seite sind eine
          zu viel. */}
      <label
        htmlFor={id}
        className="block text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-1.5"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-[12.5px] text-[#B3261E]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ContactTile({
  icon,
  label,
  value,
  caption,
  href,
  external,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  caption: string;
  href: string;
  external?: boolean;
  tone?: "whatsapp";
}) {
  const ring = tone === "whatsapp" ? "hover:border-dm-whatsapp/55" : "hover:border-ink/30";
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`group flex flex-col items-center text-center gap-3 sm:flex-row sm:text-left sm:gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:p-5 transition hover:bg-surface-2 hover:-translate-y-0.5 shadow-card ${ring}`}
      >
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${
            tone === "whatsapp" ? "bg-dm-whatsapp/15 text-dm-whatsapp" : "bg-ink/8 text-ink"
          }`}
        >
          {icon}
        </span>
        <div className="sm:flex-1 sm:min-w-0">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-muted">
            {label}
          </p>
          <p className="text-[16px] sm:text-[17px] font-bold text-ink mt-0.5 sm:truncate">{value}</p>
          <p className="text-[11.5px] text-ink-muted mt-0.5">{caption}</p>
        </div>
      </a>
    </li>
  );
}

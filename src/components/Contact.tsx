import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import { business, contact } from "../content";
import { Reveal } from "../lib/Reveal";
import { submitLead, trackLead } from "../lib/submitLead";
import { ConsentCheckbox, ConsentNotice } from "./Consent";

/**
 * Kontaktabschnitt.
 *
 * Der Erfolgszustand wird ausschließlich gezeigt, wenn die Übertragung
 * wirklich geklappt hat. In der Vorlage stand hier einmal ein blankes
 * setSubmitted(true) — das Formular bedankte sich und warf die Anfrage
 * weg. Nicht wieder einbauen.
 */
export function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hp, setHp] = useState(""); // Honeypot

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hp) return; // Honeypot getroffen — kommentarlos verwerfen, so erwarten es Bots

    const data = new FormData(e.currentTarget);
    setSending(true);
    setError(null);

    const company = String(data.get("company") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const result = await submitLead({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      service: String(data.get("service") ?? ""),
      // Das Unternehmensfeld hat im Endpunkt kein eigenes Feld. Es an den
      // Fließtext anzuhängen ist besser, als es zu verlieren.
      message: company ? `${message}\n\nUnternehmen: ${company}` : message,
      consent: data.get("consent") != null,
      source: "contact-section",
    });

    setSending(false);

    if (result.ok) {
      trackLead("contact-section");
      setSubmitted(true);
    } else {
      setError(contact.form.error);
    }
  };

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

        {/* Rechts — Formular */}
        <div className="rounded-[28px] sm:rounded-[36px] border border-ink/10 bg-white p-6 sm:p-8 md:p-10 shadow-card">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="space-y-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="eyebrow text-ink-muted">Kostenloses Erstgespräch</p>
                  <p className="text-[12px] text-ink-muted">Antwort innerhalb 2 Stunden</p>
                </div>

                <Field label={contact.form.name} name="name" required>
                  <input type="text" name="name" required autoComplete="name" className={inputCls} />
                </Field>

                {/* Telefon ist Pflicht, E-Mail optional. Das sind Anfragen,
                    die wir zurückrufen — eine gültige, aber falsche
                    E-Mail-Adresse ist ein toter Kontakt, den man von einem
                    lebenden nicht unterscheiden kann. */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <Field label={contact.form.phone} name="phone" required>
                    <input type="tel" name="phone" required autoComplete="tel" className={inputCls} />
                  </Field>
                  <Field label={contact.form.email} name="email">
                    <input type="email" name="email" autoComplete="email" className={inputCls} />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                  <Field label={contact.form.company} name="company">
                    <input
                      type="text"
                      name="company"
                      autoComplete="organization"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Leistung" name="service">
                    <select
                      name="service"
                      defaultValue={contact.serviceOptions[contact.serviceOptions.length - 1]}
                      className={selectCls}
                    >
                      {contact.serviceOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field label={contact.form.message} name="message">
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Wo Sie heute stehen, wo Sie hinwollen — und was gerade im Weg steht."
                    className={`${inputCls} resize-none min-h-[120px]`}
                  />
                </Field>

                {/* Honeypot — das Feld, das Bots gern ausfüllen. Heißt
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

                <ConsentCheckbox />

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#EC178D] hover:bg-[#d4147f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-[15px] py-3 transition-colors"
                >
                  {sending ? (
                    contact.form.sending
                  ) : (
                    <>
                      {contact.form.submit} <ArrowRight size={15} />
                    </>
                  )}
                </button>

                {error ? (
                  <p role="alert" className="text-[13px] leading-relaxed text-[#B3261E]">
                    {error}
                  </p>
                ) : null}

                <ConsentNotice />
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
                <p className="mt-2 text-ink-soft leading-relaxed">{contact.form.success}</p>

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

function Field({
  label,
  name,
  required,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="block text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-muted mb-1.5">
        {label}
        {required && <span className="text-ink-faint ml-1">*</span>}
      </span>
      {children}
    </label>
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

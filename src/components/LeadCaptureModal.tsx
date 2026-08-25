import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { hero, popup } from "../content";
import { submitLead, trackLead } from "../lib/submitLead";
import { LEAD_FIELDS, LEAD_FIELD_ORDER, websiteMessage, validateLead } from "../lib/leadForm";
import type { LeadFieldErrors } from "../lib/leadForm";
import { ConsentCheckbox, ConsentNotice } from "./Consent";
import { readConsent, CONSENT_DECIDED_EVENT } from "../lib/analytics";

/**
 * Das Pop-up „Potenzialanalyse" — Abschnitt 14 des freigegebenen Dokuments.
 * Version 1.1 · Stand 24.08.2026
 *
 * Änderungen 1.1 (24.08.2026): Das Formular ist Feld für Feld und Wort für
 * Wort dasselbe wie im Startbereich und im Kontaktabschnitt. Auf Weisung
 * RMU: „The pop up contact form has to be synced and aligned as well."
 *
 * Was das konkret geändert hat:
 *   - Felder: vorher Name · Telefon · E-Mail. Jetzt Name · Telefon ·
 *     E-Mail · Website · „Was soll am meisten wachsen?" — dieselben fünf,
 *     in derselben Reihenfolge, gezeichnet aus `LEAD_FIELDS`.
 *   - Beschriftungen sind sichtbar, nicht mehr nur Platzhalter. Ein
 *     Platzhalter verschwindet beim Tippen; wer im Formular zurückspringt,
 *     sieht dann drei gefüllte Kästen ohne Angabe, was darin steht.
 *   - Überschrift, Einleitung, Knopf, Hinweiszeile, Dank und Fehlertext
 *     kommen aus `hero`. Vorher bot das Pop-up ein „kostenloses Audit" an,
 *     während der Rest der Seite eine „kostenlose Analyse" anbietet — für
 *     den Leser zwei Angebote, nicht eines.
 *   - Prüfung: Name, Telefon, Website und Häkchen sind Pflicht, E-Mail
 *     bleibt freiwillig, und der Schreibzeiger springt in das erste
 *     fehlende Feld. Vorher prüfte hier nur der Browser, in der Sprache
 *     des Browsers.
 *
 * Angeglichen sind Inhalt, Felder und Regeln — nicht die Oberfläche. Das
 * Fenster bleibt Flüssigglas über Milchglas, weil es über der Seite
 * schwebt und nicht in ihr steht.
 *
 * Es erscheint EINMAL pro Seitenaufruf und erst kurz bevor die Bewertungen
 * in Sicht kommen, also weit nach dem ersten Satz. Ein Formular, das vor
 * dem ersten Satz aufspringt, erhöht die kognitive Last genau dort, wo die
 * Seite sie senken soll — und der Seitenkopf hat bereits ein eigenes
 * Formular. Der Auslöser ist deshalb bewusst ein Abschnitt weit unten und
 * kein Timer.
 *
 * Schließen geht über das Kreuz, „Später vielleicht", Esc und den
 * Hintergrund. Vier Wege hinaus, einer hinein.
 */
export function LeadCaptureModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasShownRef = useRef(false);
  /* Der Auslöser hat gefeuert, das Fenster durfte aber noch nicht auf, weil
     die Einwilligungsleiste noch offen stand. */
  const wartetRef = useRef(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [service, setService] = useState(hero.serviceOptions[0]);
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState(""); // Honigtopf

  const [errors, setErrors] = useState<LeadFieldErrors>({});

  const values: Record<string, string> = { name, phone, email, website, service };
  const setters: Record<string, (v: string) => void> = {
    name: setName,
    phone: setPhone,
    email: setEmail,
    website: setWebsite,
    service: setService,
  };

  // Auslöser: der Bewertungsabschnitt, mit positivem unteren rootMargin,
  // damit das Fenster kommt, BEVOR der Abschnitt tatsächlich im Bild ist.
  useEffect(() => {
    const reviews = document.getElementById("reviews");
    if (!reviews) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasShownRef.current) return;
        /* Solange die Einwilligungsleiste noch auf eine Antwort wartet,
           bleibt das Fenster zu. Sonst legt es sich über die Leiste und
           deckt „Zustimmen" zu — im Test war der Knopf nicht mehr
           anklickbar. Zwei Dialoge übereinander sind außerdem für
           Bildschirmleser ein Sackgassen-Zustand. */
        if (readConsent() === null) {
          wartetRef.current = true;
          return;
        }
        hasShownRef.current = true;
        setOpen(true);
      },
      { rootMargin: "0px 0px 240px 0px", threshold: 0 },
    );
    obs.observe(reviews);
    return () => obs.disconnect();
  }, []);

  /* Sobald die Entscheidung gefallen ist, darf das aufgeschobene Fenster
     nachkommen — einmal pro Seitenaufruf, wie vorher. */
  useEffect(() => {
    const onDecided = () => {
      if (!wartetRef.current || hasShownRef.current) return;
      hasShownRef.current = true;
      wartetRef.current = false;
      setOpen(true);
    };
    window.addEventListener(CONSENT_DECIDED_EVENT, onDecided);
    return () => window.removeEventListener(CONSENT_DECIDED_EVENT, onDecided);
  }, []);

  // Seite feststellen und Esc zum Schließen, solange offen.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (hp) return; // Honigtopf getroffen — kommentarlos verwerfen
      if (sending || submitted) return;

      /* Prüfung, Fehlertexte und Feldreihenfolge liegen in lib/leadForm.ts —
         dasselbe Modul, aus dem Startbereich und Kontaktabschnitt lesen. */
      const next = validateLead({ name, phone, website, consent });
      setErrors(next);
      if (Object.keys(next).length > 0) {
        const first = LEAD_FIELD_ORDER.find((k) => next[k]);
        if (first) {
          document.getElementById(first === "consent" ? "p-consent" : `p-${first}`)?.focus();
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
        source: "lead-capture-modal",
      });

      setSending(false);

      // Der Dank hängt an der tatsächlichen Zustellung, nicht am Absenden.
      // Andersherum wäre jede verlorene Anfrage als Erfolg gezählt worden.
      if (result.ok) {
        trackLead("lead-capture-modal");
        setSubmitted(true);
        window.setTimeout(() => setOpen(false), 2600);
      } else {
        setFailed(true);
      }
    },
    [consent, email, hp, name, phone, sending, service, submitted, website],
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Milchglas-Hintergrund — ein Klick darauf schließt. */}
          <motion.div
            key="lcm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-xl"
            aria-hidden
          />

          <motion.div
            key="lcm-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lcm-title"
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
          >
            {/* overscroll-contain: sonst scrollt am Ende der Liste die Seite
                hinter dem Fenster weiter, und das Fenster wirkt, als sei es
                weggesprungen. */}
            <div className="relative pointer-events-auto w-full max-w-[440px] max-h-[92svh] overflow-y-auto overscroll-contain rounded-[28px] border border-white/55 bg-white/85 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(15,8,32,0.55)] p-5 sm:p-8">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={popup.closeLabel}
                className="absolute top-3.5 right-3.5 grid h-9 w-9 place-items-center rounded-full bg-ink/[0.06] hover:bg-ink/[0.12] text-ink/75 hover:text-ink transition"
              >
                <X size={16} strokeWidth={2.4} />
              </button>

              {!submitted ? (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                    {popup.eyebrow}
                  </p>
                  {/* Wortgleich mit dem Startbereich, aber als h3: das
                      Fenster liegt über der Seite und darf ihre Gliederung
                      nicht mit einer zweiten H2 zerlegen. */}
                  <h3
                    id="lcm-title"
                    className="mt-2 pr-10 text-ink"
                    style={{
                      fontSize: "clamp(21px, 4.2vw, 26px)",
                      lineHeight: "1.12",
                      letterSpacing: "-0.028em",
                      fontWeight: 700,
                      hyphens: "auto",
                    }}
                  >
                    {hero.formTitle}
                  </h3>
                  <p className="mt-2 text-[13.5px] text-ink-soft leading-relaxed">
                    {hero.formIntro}
                  </p>

                  {/* noValidate: die Meldungen des Browsers kommen in der
                      Sprache des Browsers und verdecken unsere eigenen. Die
                      required-Attribute bleiben stehen — sie sind das, was
                      ein Screenreader vorliest. */}
                  <form onSubmit={onSubmit} noValidate className="mt-5 space-y-3 sm:space-y-3.5">
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-3.5">
                      {LEAD_FIELDS.filter((f) => f.half).map((f) => (
                        <Field
                          key={f.key}
                          id={`p-${f.key}`}
                          label={hero.fields[f.key].label}
                          error={errors[f.key as keyof LeadFieldErrors]}
                        >
                          <input
                            id={`p-${f.key}`}
                            name={f.name}
                            type={f.type}
                            inputMode={"inputMode" in f ? f.inputMode : undefined}
                            autoComplete={f.autoComplete}
                            placeholder={hero.fields[f.key].placeholder}
                            required={f.required || undefined}
                            aria-invalid={
                              errors[f.key as keyof LeadFieldErrors] ? true : undefined
                            }
                            aria-describedby={
                              errors[f.key as keyof LeadFieldErrors]
                                ? `p-${f.key}-err`
                                : undefined
                            }
                            value={values[f.key]}
                            onChange={(e) => setters[f.key](e.target.value)}
                            className={inputCls}
                          />
                        </Field>
                      ))}
                    </div>

                    <Field id="p-service" label={hero.fields.service.label}>
                      <select
                        id="p-service"
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

                    {/* Honigtopf — siehe Contact.tsx. Niemals „website"
                        nennen, das liest der gemeinsame Endpunkt als echte
                        URL der anfragenden Person. */}
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
                      id="p-consent"
                      checked={consent}
                      onChange={setConsent}
                      invalid={Boolean(errors.consent)}
                      describedBy={errors.consent ? "p-consent-err" : undefined}
                    />
                    {errors.consent ? (
                      <p id="p-consent-err" role="alert" className="text-[12.5px] text-[#B3261E]">
                        {errors.consent}
                      </p>
                    ) : null}

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#EC178D] hover:bg-[#d4147f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[15px] py-3 transition-colors"
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
                      <p role="alert" className="text-[12.5px] leading-relaxed text-[#B3261E]">
                        {hero.formError}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="w-full text-[13px] text-ink-muted hover:text-ink underline underline-offset-2 transition-colors"
                    >
                      {popup.dismiss}
                    </button>

                    <p className="text-[12px] text-ink-muted">{hero.formNote}</p>

                    <ConsentNotice />
                  </form>
                </>
              ) : (
                <div className="text-center py-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
                    <Check size={22} strokeWidth={3} />
                  </div>
                  <h3 className="mt-4 text-[20px] font-bold text-ink tracking-tight">
                    {hero.formSuccessTitle}
                  </h3>
                  <p className="mt-2 text-[14px] text-ink-soft leading-relaxed">
                    {hero.formSuccess}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const inputCls =
  "w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-[16px] text-ink placeholder:text-ink-faint outline-none transition focus:border-ink/55 focus:ring-2 focus:ring-ink/10";

const selectCls = `${inputCls} appearance-none pr-10`;

/**
 * Ein beschriftetes Feld — dieselbe Bauart wie im Kontaktabschnitt, nur
 * enger gesetzt, weil das Fenster auf dem Telefon sonst zweimal gescrollt
 * werden muss. Das Feld steht NEBEN der Beschriftung, nicht darin:
 * umschlossen zählt der Vorlesetext des Auswahlfeldes alle fünf Optionen
 * zur Beschriftung hinzu.
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
      <label
        htmlFor={id}
        className="block text-[10.5px] font-semibold uppercase tracking-[0.14em] text-ink-muted mb-1"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1 text-[12px] text-[#B3261E]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

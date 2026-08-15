import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Check } from "lucide-react";
import { popup } from "../content";
import { submitLead, trackLead } from "../lib/submitLead";
import { ConsentCheckbox, ConsentNotice } from "./Consent";

/**
 * Das Pop-up „Potenzialanalyse" — Abschnitt 14 des freigegebenen Dokuments.
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
  const [error, setError] = useState<string | null>(null);
  const [hp, setHp] = useState("");
  const hasShownRef = useRef(false);

  // Auslöser: der Bewertungsabschnitt, mit positivem unteren rootMargin,
  // damit das Fenster kommt, BEVOR der Abschnitt tatsächlich im Bild ist.
  useEffect(() => {
    const reviews = document.getElementById("reviews");
    if (!reviews) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasShownRef.current) {
          hasShownRef.current = true;
          setOpen(true);
        }
      },
      { rootMargin: "0px 0px 240px 0px", threshold: 0 },
    );
    obs.observe(reviews);
    return () => obs.disconnect();
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Honigtopf gefüllt → Bot. Still aussteigen, ohne Fehlermeldung.
    if (hp) return;

    const data = new FormData(e.currentTarget);
    setSending(true);
    setError(null);

    const result = await submitLead({
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      consent: data.get("consent") != null,
      service: "Kostenloses Audit",
      message: "Anfrage über das Pop-up (Kostenloses Audit Ihrer Website).",
      source: "lead-capture-modal",
    });

    setSending(false);

    // Der Dank hängt an der tatsächlichen Zustellung, nicht am Absenden.
    // Andersherum wäre jede verlorene Anfrage als Erfolg gezählt worden.
    if (result.ok) {
      trackLead("lead-capture-modal");
      setSubmitted(true);
      window.setTimeout(() => setOpen(false), 2200);
    } else {
      setError(popup.error);
    }
  };

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
            <div className="relative pointer-events-auto w-full max-w-[440px] max-h-[92vh] overflow-y-auto rounded-[28px] border border-white/55 bg-white/85 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(15,8,32,0.55)] p-6 sm:p-8">
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
                  <h3
                    id="lcm-title"
                    className="mt-2 text-ink"
                    style={{
                      fontSize: "clamp(22px, 4.4vw, 28px)",
                      lineHeight: "1.1",
                      letterSpacing: "-0.028em",
                      fontWeight: 700,
                      hyphens: "auto",
                    }}
                  >
                    {popup.headline}
                  </h3>
                  <p className="mt-2 text-[14.5px] text-ink-soft leading-relaxed">
                    {popup.intro}
                  </p>

                  <form onSubmit={onSubmit} className="mt-5 space-y-3">
                    <input
                      type="text"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder={popup.fields.name}
                      aria-label={popup.fields.name}
                      className={inputCls}
                    />
                    {/* Telefon ist auf jedem Formular das Pflichtfeld, die
                        E-Mail ist freiwillig. Wir rufen zurück. */}
                    <input
                      type="tel"
                      name="phone"
                      required
                      autoComplete="tel"
                      placeholder={popup.fields.phone}
                      aria-label={popup.fields.phone}
                      className={inputCls}
                    />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder={`${popup.fields.email} (optional)`}
                      aria-label={popup.fields.email}
                      className={inputCls}
                    />

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

                    <ConsentCheckbox />

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#EC178D] hover:bg-[#d4147f] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[15px] py-3 transition-colors"
                    >
                      {sending ? (
                        popup.sending
                      ) : (
                        <>
                          {popup.submit} <ArrowRight size={15} />
                        </>
                      )}
                    </button>

                    {error ? (
                      <p role="alert" className="text-[12.5px] leading-relaxed text-[#B3261E]">
                        {error}
                      </p>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="w-full text-[13px] text-ink-muted hover:text-ink underline underline-offset-2 transition-colors"
                    >
                      {popup.dismiss}
                    </button>

                    <ConsentNotice />
                  </form>
                </>
              ) : (
                <div className="text-center py-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white">
                    <Check size={22} strokeWidth={3} />
                  </div>
                  <h3 className="mt-4 text-[20px] font-bold text-ink tracking-tight">
                    {popup.successTitle}
                  </h3>
                  <p className="mt-2 text-[14px] text-ink-soft leading-relaxed">
                    {popup.successBody}
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
  "w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-[16px] text-ink placeholder:text-ink-faint outline-none transition focus:border-ink/55 focus:ring-2 focus:ring-ink/10";

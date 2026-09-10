import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  readConsent,
  writeConsent,
  CONSENT_DECIDED_EVENT,
} from "../lib/analytics";

/**
 * Einwilligungsbanner für die Messung.
 *
 * Vier Dinge müssen stimmen, damit das Banner nicht selbst zum Risiko wird:
 *
 * 1. **Nichts läuft vorher.** gtag.js wird erst geladen, wenn hier jemand
 *    zustimmt (public/analytics-consent.js). Das Banner schaltet also wirklich ein
 *    und dokumentiert nicht bloß.
 * 2. **Ablehnen ist genauso leicht wie Zustimmen.** Beide Schaltflächen sind
 *    gleich groß, gleich sichtbar, ein Klick. Kein „nur essenzielle Cookies"
 *    im Kleingedruckten, kein grauer Verzichtsknopf. Genau daran scheitern
 *    die meisten Banner vor Gericht.
 * 3. **Nichts ist vorangekreuzt** — es gibt gar keine Kästchen, nur die
 *    beiden Knöpfe.
 * 4. **Widerruf jederzeit**, über „Cookie-Einstellungen" in der Fußzeile.
 *    Der Widerruf muss so einfach sein wie die Einwilligung (Art. 7 Abs. 3
 *    DSGVO); deshalb öffnet der Fußzeilen-Link dasselbe Fenster.
 *
 * Warum kein Wegklick-Kreuz: Ein X wäre weder Zustimmung noch Ablehnung. Das
 * Banner bliebe bei jedem Aufruf stehen und die Besucherin käme nie zur Ruhe.
 * Zwei klare Antworten sind ehrlicher als drei unklare.
 *
 * Gerendert wird erst nach dem Mounten. Beim Vorrendern (vite-react-ssg) gibt
 * es kein `window` und damit keine gespeicherte Entscheidung — stünde das
 * Banner im vorgerenderten HTML, blitzte es bei jedem auf, der längst
 * geantwortet hat.
 */
export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const c = readConsent();
    if (!c) setOpen(true);

    const onOpen = () => {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    const onDecision = () => setOpen(readConsent() === null);
    window.addEventListener(CONSENT_DECIDED_EVENT, onDecision);
    return () => {
      window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
      window.removeEventListener(CONSENT_DECIDED_EVENT, onDecision);
    };
  }, []);

  useEffect(() => {
    if (open) titleRef.current?.focus({ preventScroll: true });
  }, [open]);

  const choose = useCallback((analytics: boolean) => {
    writeConsent(analytics);
    setOpen(false);
    returnFocus.current?.focus({ preventScroll: true });
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="consent"
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-title"
          aria-describedby="consent-text"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: reducedMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-5"
        >
          <div className="mx-auto max-h-[85svh] overflow-y-auto max-w-[720px] rounded-2xl bg-white border border-ink/10 shadow-[0_18px_48px_-12px_rgba(16,24,40,0.28)] p-5 sm:p-6">
            <p
              id="consent-title"
              ref={titleRef}
              tabIndex={-1}
              className="text-[16px] sm:text-[17.5px] font-bold text-ink leading-snug"
            >
              Dürfen wir mitzählen?
            </p>
            <p
              id="consent-text"
              className="mt-2 text-[13.5px] sm:text-[14.5px] text-ink-soft leading-relaxed"
            >
              Wir nutzen Google Analytics von Google Ireland Limited, um Besuche,
              Zugriffe über Anzeigen und abgesendete Anfragen auszuwerten. Erst mit
              Ihrer Zustimmung setzt Google Analyse-Cookies und erhält Nutzungsdaten.
              Dabei können Daten in die USA gelangen. Ohne Zustimmung bleibt die
              Messung aus. Die Website und ihre Formulare funktionieren trotzdem.
            </p>

            {/* Gleiches Gewicht: gleiche Breite, Höhe, Farbe und Schriftstärke. */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => choose(false)}
                className="w-full rounded-full border border-ink/25 bg-white px-4 py-3 text-[14px] font-semibold text-ink hover:bg-ink/[0.04] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                Ablehnen
              </button>
              <button
                type="button"
                onClick={() => choose(true)}
                className="w-full rounded-full border border-ink/25 bg-white px-4 py-3 text-[14px] font-semibold text-ink hover:bg-ink/[0.04] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071E3]"
              >
                Zustimmen
              </button>
            </div>

            <p className="mt-3 text-[12px] text-ink-soft">
              Ihre Wahl gilt 180 Tage. Über „Cookie-Einstellungen“ unten auf jeder
              Seite können Sie sie jederzeit ändern oder widerrufen.
            </p>
            <details className="mt-2 text-[12px] text-ink-soft">
              <summary className="cursor-pointer underline underline-offset-2">Welche Daten werden gespeichert?</summary>
              <p className="mt-2">Google erhält Seitenaufrufe, Anzeigenkennzeichnungen, Geräteinformationen
                und Ereignisse wie eine erfolgreich gesendete Anfrage. Namen, Telefonnummern
                und E-Mail-Adressen aus Formularen senden wir nicht an Google Analytics.
                Analyse-Cookies (_ga, _ga_…) bleiben höchstens 180 Tage gespeichert.
                Ihre Auswahl speichern wir ohne Besucherkennung im Browser. Google Signals
                und personalisierte Werbung bleiben ausgeschaltet.</p>
            </details>
            <p className="mt-3 text-[12px] text-ink-soft">
              Mehr dazu in der{" "}
              <Link to="/datenschutz" className="underline hover:text-ink">
                Datenschutzerklärung
              </Link>{" "}
              und im{" "}
              <Link to="/impressum" className="underline hover:text-ink">
                Impressum
              </Link>
              .
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Name des Ereignisses, mit dem die Fußzeile das Fenster wieder öffnet.
 *  Ein Ereignis statt eines React-Kontexts, weil Banner und Fußzeile in
 *  verschiedenen Zweigen des Baums hängen und sonst der ganze Rahmen einen
 *  Provider bräuchte. */
export const CONSENT_OPEN_EVENT = "dm:consent-open";

export function openConsentDialog() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

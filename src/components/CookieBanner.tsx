import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  readConsent,
  writeConsent,
  enableAnalytics,
  disableAnalyticsAndReload,
} from "../lib/analytics";

/**
 * Einwilligungsbanner für die Messung.
 *
 * Vier Dinge müssen stimmen, damit das Banner nicht selbst zum Risiko wird:
 *
 * 1. **Nichts läuft vorher.** gtag.js wird erst geladen, wenn hier jemand
 *    zustimmt (src/lib/analytics.ts). Das Banner schaltet also wirklich ein
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
  /* Merkt sich, ob beim Öffnen bereits eine Zustimmung galt. Nur dann ist
     ein „Ablehnen" ein Widerruf und die Seite muss neu laden. */
  const [warGranted, setWarGranted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const c = readConsent();
    if (!c) setOpen(true);

    const onOpen = () => {
      setWarGranted(readConsent()?.analytics === true);
      setOpen(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  const zustimmen = useCallback(() => {
    writeConsent(true);
    enableAnalytics();
    setOpen(false);
  }, []);

  const ablehnen = useCallback(() => {
    const widerruf = warGranted || readConsent()?.analytics === true;
    writeConsent(false);
    setOpen(false);
    /* Ein bereits geladenes gtag.js lässt sich nicht abschalten. Also neu
       laden — sonst wäre der Widerruf nur behauptet. */
    if (widerruf) disableAnalyticsAndReload();
  }, [warGranted]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="consent"
          role="dialog"
          aria-labelledby="consent-title"
          aria-describedby="consent-text"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-5 sm:pb-5"
        >
          <div className="mx-auto max-w-[720px] rounded-2xl bg-white border border-ink/10 shadow-[0_18px_48px_-12px_rgba(16,24,40,0.28)] p-5 sm:p-6">
            <p
              id="consent-title"
              className="text-[16px] sm:text-[17.5px] font-bold text-ink leading-snug"
            >
              Dürfen wir mitzählen?
            </p>
            <p
              id="consent-text"
              className="mt-2 text-[13.5px] sm:text-[14.5px] text-ink-soft leading-relaxed"
            >
              Wir möchten wissen, wie viele Menschen diese Seite besuchen und
              welche Abschnitte sie lesen. Dafür nutzen wir Google Analytics.
              Das legt eine Kennung auf Ihrem Gerät ab. Sagen Sie nein,
              messen wir nichts — die Seite funktioniert genauso. Ihre Wahl
              können Sie jederzeit unten über „Cookie-Einstellungen" ändern.
            </p>

            {/* Gleiches Gewicht: gleiche Breite, gleiche Höhe, gleiche
                Schriftstärke. Nur die Farbe unterscheidet sich. */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={ablehnen}
                className="w-full rounded-full border border-ink/25 bg-white px-4 py-3 text-[14px] font-semibold text-ink hover:bg-ink/[0.04] transition-colors"
              >
                Ablehnen
              </button>
              <button
                type="button"
                onClick={zustimmen}
                className="w-full rounded-full bg-[#0071E3] hover:bg-[#0077ED] px-4 py-3 text-[14px] font-semibold text-white transition-colors"
              >
                Zustimmen
              </button>
            </div>

            <p className="mt-3 text-[12px] text-ink-muted">
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

import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  readConsent,
  writeConsent,
  enableAnalytics,
  disableAnalyticsAndReload,
} from "../lib/analytics";

export const CONSENT_OPEN_EVENT = "dm:consent-open";

export function openConsentDialog() {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}

/* Die Cookie-Karte: unten rechts, höchstens 360 px breit, keine Bewegung.
   Vorher lag sie als 720-px-Band über der ganzen Breite und deckte auf
   dem Telefon zusammen mit Sticky-CTA und Badge ein Viertel des
   Bildschirms ab (Design-Audit 04.09.2026). Logik unverändert. */
export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
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
    if (widerruf) disableAnalyticsAndReload();
  }, [warGranted]);

  if (!mounted || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-[360px] rounded-card border border-line bg-white p-5 shadow-[0_12px_40px_-12px_rgba(27,14,46,0.35)] sm:left-auto sm:mx-0"
    >
      <p id="consent-title" className="text-[17px] font-bold">
        Dürfen wir mitzählen?
      </p>
      <p className="small mt-2">
        Wir möchten wissen, wie viele Menschen diese Seite besuchen und welche Abschnitte sie lesen.
        Dafür nutzen wir Google Analytics. Das legt eine Kennung auf Ihrem Gerät ab. Sagen Sie nein,
        messen wir nichts — die Seite funktioniert genauso. Ihre Wahl können Sie jederzeit unten über
        „Cookie-Einstellungen" ändern.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button type="button" onClick={ablehnen} className="btn btn-secondary btn-inline min-h-[46px] px-4 text-[16px]">
          Ablehnen
        </button>
        <button type="button" onClick={zustimmen} className="btn btn-primary btn-inline min-h-[46px] px-4 text-[16px]">
          Zustimmen
        </button>
      </div>
      <p className="mt-3 text-[14px] text-ink-muted">
        <Link to="/datenschutz" className="underline underline-offset-2">
          Datenschutzerklärung
        </Link>{" "}
        ·{" "}
        <Link to="/impressum" className="underline underline-offset-2">
          Impressum
        </Link>
      </p>
    </div>
  );
}

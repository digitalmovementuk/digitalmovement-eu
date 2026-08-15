import { Link } from "react-router-dom";
import { business } from "../content";
import { CONSENT_TEXT, RETENTION } from "../lib/consentText";

/**
 * Ein Einwilligungs-Element, benutzt von jedem Formular der Seite.
 *
 * Der Wortlaut selbst liegt in lib/consentText.ts — er wird auch an den
 * Lead-Endpunkt übertragen, siehe die Begründung dort.
 *
 * Der gemeinsame Endpunkt weist jede Übertragung ohne `consent`-Feld ab.
 * Ein Formular, das dieses Element vergisst, scheitert damit laut, statt
 * still Daten ohne Einwilligung zu sammeln.
 */

export { CONSENT_TEXT, RETENTION };

export function ConsentCheckbox({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <label className="flex items-start gap-3 pt-1 cursor-pointer">
      <input
        type="checkbox"
        name="consent"
        required
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/30 accent-[#EC178D]"
      />
      <span
        className={`text-[12px] leading-relaxed ${tone === "dark" ? "text-white/70" : "text-ink-muted"}`}
      >
        {CONSENT_TEXT}{" "}
        <Link
          to="/datenschutz"
          className="underline underline-offset-2 hover:opacity-80"
        >
          Datenschutzerklärung
        </Link>
      </span>
    </label>
  );
}

/**
 * Der Hinweis zu Speicherdauer und Rechten, direkt unter dem Absenden-
 * Knopf. Getrennt von der Checkbox, weil er eine Information ist und
 * nichts, dem man zustimmt — beides zusammenzufassen würde die
 * Einwilligung selbst entwerten.
 */
export function ConsentNotice({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <p
      className={`text-[11px] leading-relaxed ${tone === "dark" ? "text-white/50" : "text-ink-faint"}`}
    >
      {business.name} speichert Ihre Angaben ausschließlich zur Beantwortung Ihrer Anfrage, für{" "}
      {RETENTION}, und gibt sie an niemanden weiter. Sie können Ihre Einwilligung jederzeit
      widerrufen und Auskunft oder Löschung verlangen — formlos an{" "}
      <a href={business.emailHref} className="underline underline-offset-2 hover:text-ink-muted">
        {business.email}
      </a>
      . Beschwerderecht bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit.
    </p>
  );
}

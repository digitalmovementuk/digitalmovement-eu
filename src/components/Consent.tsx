import { Link } from "react-router-dom";
import { business } from "../content";
import { CONSENT_TEXT, RETENTION } from "../lib/consentText";

export { CONSENT_TEXT, RETENTION };

/* Das EINE Einwilligungskästchen für beide Formulare. Seit dem Design-Audit
   vom 04.09.2026 mit 15 px Text (vorher 12 px) — kein Text auf der Seite
   liegt mehr unter 14 px. */
export function ConsentCheckbox({
  id,
  checked,
  onChange,
  invalid,
  describedBy,
}: {
  tone?: "light" | "dark";
  id?: string;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  invalid?: boolean;
  describedBy?: string;
}) {
  const controlled = typeof checked === "boolean";
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        id={id}
        type="checkbox"
        name="consent"
        required
        aria-invalid={invalid ? true : undefined}
        aria-describedby={describedBy}
        {...(controlled
          ? { checked, onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.checked) }
          : {})}
        className="check"
      />
      <span className="text-[15px] leading-[1.5] text-ink-soft">
        {CONSENT_TEXT}{" "}
        <Link to="/datenschutz" className="underline underline-offset-2 hover:text-accent">
          Datenschutzerklärung
        </Link>
      </span>
    </label>
  );
}

export function ConsentNotice(_props: { tone?: "light" | "dark" }) {
  return (
    <p className="text-[14px] leading-[1.5] text-ink-muted">
      {business.name} speichert Ihre Angaben ausschließlich zur Beantwortung Ihrer Anfrage, für{" "}
      {RETENTION}, und gibt sie an niemanden weiter. Sie können Ihre Einwilligung jederzeit
      widerrufen und Auskunft oder Löschung verlangen — formlos an{" "}
      <a href={business.emailHref} className="underline underline-offset-2 hover:text-accent">
        {business.email}
      </a>
      . Beschwerderecht bei der Berliner Beauftragten für Datenschutz und Informationsfreiheit.
    </p>
  );
}

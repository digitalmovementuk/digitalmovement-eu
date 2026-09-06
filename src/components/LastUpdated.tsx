import { lastUpdated } from "../content";

/**
 * Blueprint 11 — das sichtbare Aktualisierungsdatum.
 *
 * Zweck laut Hausstandard: eine KI soll die Seite weiter als lebend
 * behandeln. Deshalb steht das Datum sichtbar **und** maschinenlesbar
 * (`<time dateTime>`), und beide kommen aus derselben Quelle
 * `lastUpdated.iso` in content.ts. Zwei getrennte Datumsangaben laufen
 * sonst früher oder später auseinander, und eine Seite, die behauptet,
 * gestern geprüft worden zu sein, während das Schema den Vormonat nennt,
 * ist schlechter dran als eine ganz ohne Datum.
 */
export function LastUpdated() {
  return (
    <section
      data-surface="light"
      aria-label="Stand dieser Seite"
      className="surface-light-2 border-t border-ink/[0.07] py-7 sm:py-8"
    >
      <div className="container-v3">
        <p className="text-[13.5px] leading-relaxed text-ink-muted">
          <time dateTime={lastUpdated.iso} className="font-semibold text-ink-soft">
            {lastUpdated.label}
          </time>
          <span className="block sm:inline sm:before:content-['_·_']">{lastUpdated.note}</span>
        </p>
      </div>
    </section>
  );
}

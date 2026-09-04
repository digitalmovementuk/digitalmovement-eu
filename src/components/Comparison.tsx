import { Check, X } from "lucide-react";
import { comparison } from "../content";

/* Eine echte Tabelle (Blueprint-Teil „Vergleich"). Auf dem Telefon wird
   jede Zeile zu einer Karte; die Spaltennamen stehen dann über dem Wert
   in 14 px — nicht mehr in 10,5 px wie vorher. */
export function Comparison() {
  return (
    <section id="comparison" data-surface="light" className="surface-light section">
      <div className="container-v3">
        <div className="section-head">
          <p className="eyebrow">{comparison.eyebrow}</p>
          <h2 className="h2">{comparison.headlineMain}</h2>
          <p className="lead">{comparison.intro}</p>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="cmp w-full border-collapse text-left">
            <thead>
              <tr>
                <th scope="col">{comparison.columns.topic}</th>
                <th scope="col">{comparison.columns.other}</th>
                <th scope="col" className="text-accent">
                  {comparison.columns.neo}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r.topic}>
                  <th scope="row" data-label={comparison.columns.topic}>
                    {r.topic}
                  </th>
                  <td data-label={comparison.columns.other}>
                    <span className="cmp-cell">
                      <X size={18} className="cmp-icon text-ink-muted" aria-hidden />
                      {r.other}
                    </span>
                  </td>
                  <td data-label={comparison.columns.neo} className="cmp-neo">
                    <span className="cmp-cell">
                      <Check size={18} className="cmp-icon text-accent" aria-hidden />
                      {r.neo}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

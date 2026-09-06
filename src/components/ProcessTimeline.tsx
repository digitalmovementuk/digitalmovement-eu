import { processIntro, processSteps } from "../content";

/* Fünf Meilensteine als Liste: Zeitpunkt, Titel, Erklärung — Zeile für
   Zeile. Fünf schmale Spalten hatten die Titel auf vier Zeilen gebrochen
   (check-render), eine Liste bleibt auf jeder Breite lesbar. */
export function ProcessTimeline() {
  return (
    <section id="process" data-surface="light" className="surface-light-2 section">
      <div className="container-v3">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{processIntro.eyebrow}</p>
          <h2 className="h2">{processIntro.headlineMain}</h2>
          <p className="lead">{processIntro.intro}</p>
        </div>

        <ol className="mt-8 card divide-y divide-[rgba(27,14,46,0.12)] p-0" data-reveal>
          {processSteps.map((step) => (
            <li key={step.n} className="grid items-start gap-2 px-6 py-6 md:grid-cols-[140px_minmax(0,1fr)_minmax(0,1.5fr)] md:gap-8 md:px-8">
              <p className="small font-bold tabular text-accent">
                {step.n} · {step.eta}
              </p>
              <h3 className="h3">{step.title}</h3>
              <p className="copy text-[16px]">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

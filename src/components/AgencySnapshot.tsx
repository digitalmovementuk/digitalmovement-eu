import { metrics, snapshot } from "../content";

/* Snapshot + Zahlen in einem Abschnitt (Design-Audit 04.09.2026, E-5):
   Die drei Karten sagen, was Sie bekommen; darunter stehen die drei
   Zahlen, die vorher einen eigenen Bildschirm mit Balken und 300 Punkten
   belegten. Alle Sätze des alten Zahlen-Abschnitts stehen hier weiter. */
const captions: Record<string, string> = {
  "mehr Anfragen pro Monat": "Nach 90 Tagen",
  "Tage bis Google Seite 1": "Sichtbarkeit: Unsichtbar → Google Seite 1",
  "Kundenprojekte abgeschlossen": "Erfahrung",
};

export function AgencySnapshot() {
  return (
    <section id="snapshot" data-surface="light" className="surface-light-2 section">
      <div className="container-v3">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{snapshot.eyebrow}</p>
          <h2 className="h2">{snapshot.title}</h2>
        </div>

        <ol className="mt-8 grid gap-5 md:grid-cols-3" data-reveal-group>
          {snapshot.items.map((item) => (
            <li key={item.index} className="card" data-reveal>
              <p className="small font-bold tabular">
                {item.index} · {item.label}
              </p>
              <p className="h3 mt-3">{item.headline}</p>
              {item.detail ? <p className="copy mt-2">{item.detail}</p> : null}
              {item.tags.length ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <li key={t} className="rounded-full border border-line px-3 py-1 text-[15px] font-semibold">
                      {t}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.points.length ? (
                <ul className="copy mt-4 list-disc space-y-1 pl-5">
                  {item.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ol>

        <div id="metrics" className="mt-10 border-t border-line pt-8">
          <div className="section-head" data-reveal>
            <p className="eyebrow">{metrics.eyebrow}</p>
            <h3 className="h2">{metrics.headlineMain}</h3>
            <p className="lead">{metrics.intro}</p>
          </div>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3" data-reveal-group>
            {metrics.items.map((m) => (
              <div key={m.label} className="text-center md:text-left" data-reveal>
                <dt className="small font-semibold">{captions[m.label] ?? ""}</dt>
                <dd className="num mt-2 text-accent">
                  {m.value}
                  {m.suffix}
                </dd>
                <dd className="copy mt-2 text-ink">{m.label}</dd>
              </div>
            ))}
          </dl>
          <p className="small mt-6 max-w-[62ch] text-center md:text-left">
            Gemessen an qualifizierten Anfragen, nicht an Klicks. Was sich bewegt hat und warum, steht
            jeden Monat auf einer Seite.
          </p>
        </div>
      </div>
    </section>
  );
}

import { Reveal } from "../lib/Reveal";
import { useT } from "../lib/i18n";

/**
 * Kurzprofil — drei Antworten nebeneinander, alle gleichzeitig sichtbar.
 *
 * Vorher war das ein Karussell: drei Karten, alle acht Sekunden schob sich
 * die nächste ins Bild, 680 px Höhe für jeweils einen Halbsatz. Wer die
 * dritte Antwort lesen wollte, musste sechzehn Sekunden warten oder raten,
 * dass man wischen kann. Das ist teuer erkaufte Bewegung: die Seite
 * verspricht "in 30 Sekunden" und braucht allein für den Abschnitt 24.
 *
 * Jetzt stehen die drei Antworten als Raster nebeneinander. Kein
 * Selbstlauf, keine Punkte-Leiste, keine Pfeiltasten, kein
 * IntersectionObserver — und vor allem keine drei Stockfotos mehr
 * (Hochhäuser, ein Mann am Schreibtisch, eine Teambesprechung), die mit
 * "Mehr Anfragen", "Inhaber & Mittelstand" und "Premium-Website" nichts zu
 * tun hatten und 620 kB gekostet haben. Bild ohne Aussage erhöht die Last,
 * es senkt sie nicht.
 *
 * Der Text ist wortgleich der freigegebene. Umgestellt ist nur die Form:
 * aus einem Satz aus sechs Einzelwörtern werden sechs Marken, aus einer
 * Überschrift aus drei Sätzen werden eine Überschrift und zwei Punkte.
 */
export function AgencySnapshot() {
  const t = useT();
  const { eyebrow, title, items } = t.snapshot;

  return (
    <section
      id="snapshot"
      data-surface="light"
      className="surface-light py-20 sm:py-24 md:py-28"
      aria-labelledby="snapshot-title"
    >
      <div className="container-v3">
        <div className="mx-auto max-w-[30ch] text-center lg:mx-0 lg:text-left">
          <Reveal>
            <p className="eyebrow text-ink-muted">{eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="snapshot-title"
              className="mt-3 balance text-ink"
              style={{
                fontSize: "clamp(24px, 2.6vw, 38px)",
                lineHeight: "1.04",
                letterSpacing: "-0.034em",
                fontWeight: 700,
              }}
            >
              {title}
            </h2>
          </Reveal>
        </div>

        <div className="mt-9 grid gap-4 sm:mt-11 sm:gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.index} delay={0.06 * i} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white p-7 pt-8 shadow-card ring-1 ring-ink/[0.06] transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-8 sm:pt-9">
                {/* Markenkante statt Stockfoto: trägt die Farbe des Hauses,
                    kostet keine Ladezeit und behauptet nichts. */}
                <span aria-hidden className="absolute inset-x-0 top-0 h-[5px] bg-dm-brand" />
                <p className="relative eyebrow text-ink-muted">{item.label}</p>
                <h3
                  className="relative mt-2.5 balance text-ink"
                  style={{
                    fontSize: "clamp(21px, 1.9vw, 27px)",
                    lineHeight: "1.08",
                    letterSpacing: "-0.03em",
                    fontWeight: 700,
                  }}
                >
                  {item.headline}
                </h3>

                {item.detail && (
                  <p
                    className="relative mt-3 text-ink-muted"
                    style={{ fontSize: "clamp(15px, 1.05vw, 16.5px)", lineHeight: 1.5 }}
                  >
                    {item.detail}
                  </p>
                )}

                {item.points.length > 0 && (
                  <ul className="relative mt-4 space-y-2.5">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex gap-2.5 text-ink-soft"
                        style={{ fontSize: "15px", lineHeight: 1.45 }}
                      >
                        <Check />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {item.tags.length > 0 && (
                  <ul className="relative mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-pill bg-surface-2 px-3 py-1.5 text-[13.5px] font-semibold text-ink-soft ring-1 ring-ink/[0.05]"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Fußzeile: die Ziffer sitzt bei jeder Karte auf gleicher
                    Höhe am unteren Rand. Dadurch ist der Weißraum unter der
                    kürzesten Antwort ("Mehr Anfragen.") gesetzt und nicht
                    übrig geblieben — und die drei Karten haben denselben
                    unteren Anker. */}
                <div className="relative mt-auto flex items-end justify-between pt-7">
                  <span aria-hidden className="h-px flex-1 bg-ink/[0.07]" />
                  <span
                    aria-hidden
                    className="ml-4 select-none font-semibold italic leading-none text-ink/[0.09]"
                    style={{ fontSize: "clamp(40px, 3.4vw, 52px)", marginBottom: "-0.12em" }}
                  >
                    {item.index}
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Häkchen für die Punkte-Liste. Rein dekorativ, deshalb aria-hidden. */
function Check() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[3px] shrink-0 text-dm-violet-deep"
      aria-hidden
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

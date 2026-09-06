import { Reveal } from "../lib/Reveal";
import { faqIntro, faqs } from "../content";

/**
 * Häufige Fragen.
 *
 * Die sechs Fragen standen seit dem 14.08.2026 im freigegebenen Dokument
 * und wurden nirgends ausgespielt — sie lagen als `faqs` in content.ts und
 * gingen nur ins Schema. Das ist die schlechtestmögliche Kombination:
 * eine Suchmaschine sieht eine Frage-Antwort-Auszeichnung, die auf der
 * Seite selbst nicht steht. Genau das prüft der Hausstandard („in der
 * Seite **und** im FAQPage-Schema, wortgleich“).
 *
 * Kein Aufklapper: die Antworten stehen offen. Ein Aufklapper spart Höhe
 * und kostet Lesbarkeit, und wer zitiert werden will, versteckt seine
 * Antworten nicht hinter einem Klick.
 */
export function Faq() {
  return (
    <section
      id="faq"
      data-surface="light"
      aria-labelledby="faq-titel"
      className="surface-light-2 pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-28 md:pb-32"
    >
      <div className="container-v3">
        <Reveal>
          <p className="eyebrow text-ink-muted">{faqIntro.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            id="faq-titel"
            className="mt-5 max-w-[24ch] balance text-ink"
            style={{
              fontSize: "clamp(28px, 2.5vw, 36px)",
              lineHeight: "1.04",
              letterSpacing: "-0.034em",
              fontWeight: 700,
            }}
          >
            {faqIntro.headline}
          </h2>
        </Reveal>

        <dl className="mt-12 sm:mt-14 grid gap-x-12 gap-y-9 md:grid-cols-2">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={0.05 + i * 0.04}>
              <div>
                <dt>
                  <h3 className="text-[17.5px] sm:text-[19px] font-bold leading-snug text-ink">
                    {f.q}
                  </h3>
                </dt>
                <dd className="mt-3 max-w-[58ch] text-[15px] sm:text-[16px] leading-relaxed text-ink-soft">
                  {f.a}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

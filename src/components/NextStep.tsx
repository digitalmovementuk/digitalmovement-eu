import { Reveal } from "../lib/Reveal";
import { solutionStep } from "../content";

/**
 * Blueprint 7, Schluss — der eine nächste Schritt.
 *
 * Der Hausstandard ist hier unmissverständlich: der Lösungsteil endet auf
 * **einer** Handlung. Die Leistungskacheln darüber tragen je einen eigenen
 * Knopf, das sind vier mögliche Wege; dieser Block sagt, welcher gemeint
 * ist, wenn man sich nicht entscheiden mag. Ein zweiter Knopf gehört hier
 * nicht hinein — auch kein „oder rufen Sie an“ als Knopf. Die Telefon-
 * nummer steht im Kontaktabschnitt und in der Fußzeile.
 */
export function NextStep() {
  return (
    <section
      data-surface="light"
      aria-labelledby="naechster-schritt"
      className="surface-light pt-16 sm:pt-20 pb-16 sm:pb-20"
    >
      <div className="container-v3">
        <Reveal>
          <div className="rounded-[24px] border border-ink/10 bg-white px-7 py-9 sm:px-10 sm:py-11 text-center lg:text-left lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div>
              <h2
                id="naechster-schritt"
                className="balance text-ink"
                style={{
                  fontSize: "clamp(24px, 2.2vw, 32px)",
                  lineHeight: "1.08",
                  letterSpacing: "-0.032em",
                  fontWeight: 700,
                }}
              >
                {solutionStep.question}
              </h2>
              <p className="mt-4 max-w-[58ch] mx-auto lg:mx-0 text-[15.5px] sm:text-[17px] leading-relaxed text-ink-soft">
                {solutionStep.body}
              </p>
            </div>
            <a
              href={solutionStep.href}
              className="mt-7 lg:mt-0 inline-flex shrink-0 items-center justify-center rounded-full px-8 py-4 text-[15.5px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
              style={{ background: "var(--grad-cta)" }}
            >
              {solutionStep.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

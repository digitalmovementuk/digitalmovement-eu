import { Reveal } from "../lib/Reveal";
import { problem } from "../content";

/**
 * Blueprint 6 — der Problemblock.
 *
 * Die Regel des Hausstandards ist eng: das Problem steht in den Worten
 * der Käuferin, nicht in unseren. Deshalb sind die vier Punkte als Zitate
 * gesetzt und nicht als Leistungsbeschreibung — „Wir zahlen jeden Monat,
 * und ich weiß nicht, wofür“ ist ein Satz, den Inhaber sagen; „mangelnde
 * Transparenz im Reporting“ ist einer, den Agenturen sagen. Wer die
 * Zitate in Kategoriesprache umschreibt, hat den Block abgeschafft.
 *
 * Darunter steht, was es kostet — ebenfalls Vorgabe des Blueprints.
 */
export function Problem() {
  return (
    <section
      id="problem"
      data-surface="dark"
      aria-labelledby="problem-frage"
      className="surface-dark relative overflow-hidden pt-24 sm:pt-28 md:pt-32 pb-24 sm:pb-28 md:pb-32"
    >
      {/* Leiser Farbschimmer, wie in den anderen dunklen Abschnitten. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[560px] w-[560px] rounded-full opacity-[0.13]"
        style={{ background: "radial-gradient(circle at center, #F05F22 0%, transparent 65%)" }}
      />

      <div className="container-v3 relative">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-12 text-center lg:text-left">
          <div>
            <Reveal>
              <p className="eyebrow text-white/55">{problem.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                id="problem-frage"
                className="mt-5 max-w-[34ch] mx-auto lg:mx-0 balance text-white"
                style={{
                  fontSize: "clamp(28px, 2.5vw, 36px)",
                  lineHeight: "1.04",
                  letterSpacing: "-0.034em",
                  fontWeight: 700,
                }}
              >
                {problem.question}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="text-[15px] sm:text-[17px] leading-relaxed text-white/65 max-w-[480px] mx-auto lg:mx-0 lg:justify-self-end">
              {problem.intro}
            </p>
          </Reveal>
        </div>

        <ul className="mt-12 sm:mt-14 grid gap-4 sm:gap-5 md:grid-cols-2">
          {problem.points.map((p, i) => (
            <Reveal key={p.quote} delay={0.06 + i * 0.05}>
              <li className="h-full rounded-[20px] border border-white/10 bg-white/[0.045] p-6 sm:p-7">
                <p className="text-[17px] sm:text-[18.5px] font-bold leading-snug text-white">
                  „{p.quote}“
                </p>
                <p className="mt-3 text-[14.5px] sm:text-[15.5px] leading-relaxed text-white/65">
                  {p.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.3}>
          <div className="mt-10 sm:mt-12 rounded-[20px] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="eyebrow text-white/55">{problem.costLabel}</p>
            <p className="mt-3 max-w-[68ch] text-[16px] sm:text-[18px] leading-relaxed text-white/85">
              {problem.cost}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

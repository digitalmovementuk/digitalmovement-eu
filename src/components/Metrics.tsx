import trust from "../trust-content.json";
import { Reveal } from "../lib/Reveal";

const links = ["https://www.ihk.de/berlin/", "/impressum", "/#founder"];
export function Metrics() {
  return <section id="metrics" data-surface="light" className="surface-light-2 py-20 sm:py-24">
    <div className="container-v3">
      <Reveal><div className="text-center lg:text-left">
        <p className="eyebrow text-ink-muted">{trust.proof.eyebrow}</p>
        <h2 className="mt-5 text-ink text-[28px] sm:text-[36px] font-bold tracking-tight">{trust.proof.heading}</h2>
        <p className="mt-5 text-ink-soft leading-relaxed">{trust.proof.intro}</p>
      </div></Reveal>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {trust.proof.cards.map((card, i) => <article key={card.title} className="rounded-[24px] border border-ink/10 bg-white p-7 sm:p-8 flex flex-col">
          <h3 className="text-[20px] font-semibold text-ink">{card.title}</h3>
          <p className="mt-4 mb-6 text-[15px] leading-relaxed text-ink-soft">{card.body}</p>
          <a href={links[i]} className="mt-auto text-[14px] font-semibold text-ink underline underline-offset-4" {...(i === 0 ? {target:"_blank", rel:"noopener noreferrer"} : {})}>{card.linkLabel}</a>
        </article>)}
      </div>
    </div>
  </section>;
}

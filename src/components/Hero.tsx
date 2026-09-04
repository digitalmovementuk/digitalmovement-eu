import { hero } from "../content";
import { LeadForm } from "./LeadForm";

const BASE = import.meta.env.BASE_URL;

/* Startbereich, Fassung 2 (Design-Audit 04.09.2026).
   Weißer Grund statt Foto und Verlauf, eine Schrift, ein Akzent. Links
   die Zusage in Raouls Wortlaut vom 24.08.2026, rechts DAS Formular.
   Jedes Wort wie vorher — nur die Fläche ist ruhiger. */
export function Hero() {
  return (
    <header id="top" data-surface="light" className="surface-light">
      <div className="container-v3 grid items-start gap-10 pt-10 pb-14 md:pt-14 md:pb-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="hero-copy">
          <p className="eyebrow">{hero.label}</p>
          <h1 className="h1 mt-4">
            <span className="whitespace-nowrap">{hero.headlineNoBreak}</span>
            {hero.headlineRest}
            <span className="text-accent">{hero.headlineAccent}</span>
          </h1>

          <div className="lead mt-6 max-w-[34ch]">
            {hero.ledeLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          {/* Mobil: Sprung zum Formular, das unter dem Text steht. */}
          <a href="#hero-form" className="btn btn-primary mt-6 lg:hidden">
            {hero.formCta}
          </a>

          <div className="mt-8">
            <p className="small font-semibold text-ink">{hero.findLabel}</p>
            <ul className="mt-3 flex flex-wrap gap-2.5" aria-label={hero.findLabel}>
              {hero.apps.map((app) => (
                <li
                  key={app.key}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-[15px] font-semibold"
                >
                  <img
                    src={`${BASE}brand/hero-uk/logos/${app.icon}`}
                    alt=""
                    width={18}
                    height={18}
                    loading="eager"
                    decoding="async"
                  />
                  {app.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6">
            <a
              href={hero.reviewsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[15px] text-ink-soft hover:text-ink"
            >
              <span className="stars" aria-hidden>
                ★★★★★
              </span>
              <span>
                <b className="text-ink">{hero.reviewsRating}</b> {hero.reviewsText}
              </span>
            </a>
            <ul className="flex gap-8">
              {hero.stats.map((s) => (
                <li key={s.label} className="leading-tight">
                  <span className="block text-[22px] font-extrabold tabular">{s.value}</span>
                  <span className="small">{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative">
          <LeadForm
            idPrefix="h"
            formId="hero-form"
            source="home-hero"
            title={hero.formTitle}
            intro={hero.formIntro}
          />
        </div>
      </div>
    </header>
  );
}

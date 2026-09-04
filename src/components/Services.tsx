import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { services, servicesIntro } from "../content";

export function Services() {
  return (
    <section id="services" data-surface="light" className="surface-light section">
      <div className="container-v3">
        <div className="section-head">
          <p className="eyebrow">{servicesIntro.eyebrow}</p>
          <h2 className="h2">{servicesIntro.headlineMain}</h2>
          <p className="lead">{servicesIntro.headlineSub}</p>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <li key={s.key} className="card flex flex-col">
              <h3 className="h3">{s.title}</h3>
              <p className="mt-2 text-[18px] font-bold leading-snug text-ink">{s.promise}</p>
              <p className="copy mt-3 text-[16px]">{s.detail}</p>
              <ul className="mt-4 grid gap-2">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[16px] leading-snug">
                    <span className="mt-[7px] h-2 w-2 flex-none rounded-full bg-accent" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-6">
                <Link to={s.to} className="link-arrow">
                  {s.ctaLabel} <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { testimonials } from "../content";

export function Reviews() {
  return (
    <section id="reviews" data-surface="light" className="surface-light-2 section">
      <div className="container-v3">
        <div className="section-head" data-reveal>
          <p className="eyebrow">Google-Bewertungen</p>
          <h2 className="h2">Was Kunden über uns sagen</h2>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2" data-reveal-group>
          {testimonials.map((t) => (
            <li key={t.name} className="card flex flex-col" data-reveal>
              <p className="stars" aria-label="5 von 5 Sternen">
                ★★★★★
              </p>
              <blockquote className="copy mt-4 text-[17px] text-ink">„{t.quote}“</blockquote>
              <footer className="mt-auto flex items-center gap-3 pt-6">
                <span
                  className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-ink text-[16px] font-bold text-white"
                  aria-hidden
                >
                  {t.initial ?? t.name.charAt(0)}
                </span>
                <p className="leading-snug">
                  <span className="block font-bold">{t.name}</span>
                  <span className="small">
                    {t.role}
                    {t.when ? ` · ${t.when}` : ""}
                  </span>
                </p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

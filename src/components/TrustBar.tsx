import { trustBar } from "../content";

const BASE = import.meta.env.BASE_URL;

/* Kundenlogos, einfarbig in Tinte, alle auf eine Höhe gebracht. Freigabe
   aller fünf Kunden am 04.09.2026 (Entscheidung E-6 im Design-Audit).
   ADDRESSBALI führt kein Bildlogo — die Marke ist auf der eigenen Website
   ein reines Schrift-Wortzeichen, deshalb steht sie hier auch so. */
const LOGOS: Record<string, { file: string; w: number; h: number }> = {
  "CEx": { file: "cex", w: 315, h: 128 },
  "Azura Living Bali": { file: "azura-living-bali", w: 581, h: 128 },
  "Cunos": { file: "cunos", w: 400, h: 128 },
  "Fantastic Finish": { file: "fantastic-finish", w: 323, h: 128 },
};

export function TrustBar() {
  return (
    <section aria-label={trustBar.label} data-surface="light" className="surface-light border-b border-line">
      <div className="container-v3 py-8">
        <p className="small text-center font-semibold uppercase tracking-[0.06em] md:text-left">{trustBar.label}</p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 md:justify-between">
          {trustBar.clients.map((c) => {
            const logo = LOGOS[c.name];
            return (
              <li key={c.name} className="flex h-8 items-center">
                {logo ? (
                  <picture>
                    <source type="image/webp" srcSet={`${BASE}brand/clients/${logo.file}.webp`} />
                    <img
                      src={`${BASE}brand/clients/${logo.file}.png`}
                      alt={c.name}
                      width={logo.w}
                      height={logo.h}
                      className={logo.file === "fantastic-finish" ? "h-8 w-auto md:h-9" : "h-7 w-auto md:h-8"}
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                ) : (
                  <span className="text-[22px] font-extrabold tracking-[0.08em]">
                    {c.name}
                    <span className="align-top text-[11px]">®</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
        <p className="small mt-5 text-center md:text-left">{trustBar.note}</p>
      </div>
    </section>
  );
}

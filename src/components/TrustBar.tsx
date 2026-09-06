import { Reveal } from "../lib/Reveal";
import { trustBar } from "../content";

/**
 * Blueprint 5 — die Vertrauensleiste, direkt unter dem Startbereich.
 *
 * Der Hausstandard verlangt Kundenlogos mit einem Etikett, das sagt, was
 * sie sind. Logodateien mit Freigabe haben wir nicht — deshalb stehen
 * hier die Namen. Das ist keine Notlösung, sondern die ehrlichere Fassung:
 * jeder dieser Namen taucht weiter unten mit Projekt, Zahlen und Website
 * wieder auf und ist damit nachprüfbar. Ein Logo, das wir nicht verwenden
 * dürfen, wäre ein Rechtsrisiko; ein Platzhalter-Logo wäre eine Lüge.
 */
export function TrustBar() {
  return (
    <section
      data-surface="light"
      aria-label={trustBar.label}
      className="surface-light-2 border-y border-ink/[0.07] py-8 sm:py-10"
    >
      <div className="container-v3">
        <Reveal>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
            <p className="eyebrow shrink-0 text-ink-muted">{trustBar.label}</p>
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-3 sm:gap-x-9">
              {trustBar.clients.map((c) => (
                <li key={c.name} className="leading-tight">
                  <span className="block text-[17px] sm:text-[19px] font-extrabold tracking-[-0.02em] text-ink">
                    {c.name}
                  </span>
                  <span className="block text-[12px] text-ink-muted">{c.place}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <p className="mt-5 text-[13px] text-ink-muted">{trustBar.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

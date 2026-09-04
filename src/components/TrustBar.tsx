import { trustBar } from "../content";

/* Kundennamen als Text. Logos liegen für zwei der fünf Kunden nicht in
   brauchbarer Form vor (Entscheidung E-6 im Design-Audit); Namen tragen
   den Beweis so lange ehrlich. */
export function TrustBar() {
  return (
    <section aria-label={trustBar.label} data-surface="light" className="surface-light border-b border-line">
      <div className="container-v3 py-8">
        <p className="small text-center font-semibold uppercase tracking-[0.06em] md:text-left">{trustBar.label}</p>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-10 gap-y-3 md:justify-start">
          {trustBar.clients.map((c) => (
            <li key={c.name} className="leading-tight">
              <span className="block text-[20px] font-extrabold tracking-[-0.01em]">{c.name}</span>
              <span className="small">{c.place}</span>
            </li>
          ))}
        </ul>
        <p className="small mt-4 text-center md:text-left">{trustBar.note}</p>
      </div>
    </section>
  );
}

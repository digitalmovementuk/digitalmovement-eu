import { lastUpdated } from "../content";

export function LastUpdated() {
  return (
    <section aria-label="Stand dieser Seite" data-surface="light" className="surface-light border-t border-line">
      <div className="container-v3 py-6 text-center md:text-left">
        <p className="small">
          <time dateTime={lastUpdated.iso} className="font-semibold text-ink">
            {lastUpdated.label}
          </time>{" "}
          · {lastUpdated.note}
        </p>
      </div>
    </section>
  );
}

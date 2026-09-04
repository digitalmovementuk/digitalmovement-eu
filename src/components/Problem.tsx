import { problem } from "../content";

export function Problem() {
  return (
    <section id="problem" data-surface="light" className="surface-light section">
      <div className="container-v3">
        <div className="section-head">
          <p className="eyebrow">{problem.eyebrow}</p>
          <h2 className="h2">{problem.question}</h2>
          <p className="lead">{problem.intro}</p>
        </div>

        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {problem.points.map((p) => (
            <li key={p.quote} className="card">
              <p className="h3">„{p.quote}“</p>
              <p className="copy mt-3 text-[16px]">{p.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-card border-l-4 border-accent bg-surface-2 px-6 py-5">
          <p className="eyebrow">{problem.costLabel}</p>
          <p className="copy mt-1 text-ink">{problem.cost}</p>
        </div>
      </div>
    </section>
  );
}

import { faqIntro, faqs } from "../content";

export function Faq() {
  return (
    <section id="faq" data-surface="light" className="surface-light section">
      <div className="container-v3">
        <div className="section-head">
          <p className="eyebrow">{faqIntro.eyebrow}</p>
          <h2 className="h2">{faqIntro.headline}</h2>
        </div>

        <dl className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
          {faqs.map((f) => (
            <div key={f.q} className="border-t border-line pt-5">
              <dt>
                <h3 className="h3">{f.q}</h3>
              </dt>
              <dd className="copy mt-3">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

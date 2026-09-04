import { founder } from "../content";

const BASE = import.meta.env.BASE_URL;

export function FounderNote() {
  return (
    <section id="founder" data-surface="light" className="surface-light-2 section">
      <div className="container-v3 grid items-start gap-10 md:grid-cols-[260px_1fr] lg:grid-cols-[300px_1fr] lg:gap-16">
        <picture className="mx-auto block w-[200px] md:mx-0 md:w-[260px] lg:w-[300px]">
          <source type="image/webp" srcSet={`${BASE}brand/raoul-founder-320.webp`} />
          <img
            src={`${BASE}brand/raoul-founder.png`}
            alt={founder.signatureBlock}
            width={320}
            height={320}
            className="aspect-square w-full rounded-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>

        <div>
          <p className="eyebrow">{founder.eyebrow}</p>
          <h2 className="h2 mt-3">
            {founder.headlinePre} <span className="text-accent">{founder.headlineSoft}</span>
          </h2>
          <div className="copy mt-6 space-y-4">
            {founder.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 leading-snug">
            <span className="block text-[22px] font-extrabold">{founder.signature}</span>
            <span className="small">{founder.signatureBlock}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

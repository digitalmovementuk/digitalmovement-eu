import { answerBlock, byline } from "../content";

const BASE = import.meta.env.BASE_URL;

/* Antwortblock: die Frage als Überschrift, die Antwort in einem Absatz,
   darüber der Verfasser. Grauer Grund, damit er sich vom Startbereich
   absetzt, ohne eine neue Farbwelt aufzumachen. */
export function AnswerBlock() {
  return (
    <section id="answer" data-surface="light" className="surface-light-2 section-tight">
      <div className="container-v3">
        <div className="mx-auto max-w-[820px]" data-reveal>
          <div className="flex items-center gap-4">
            <picture className="flex-none">
              <source type="image/webp" srcSet={`${BASE}${byline.photoWebp}`} />
              <img
                src={`${BASE}${byline.photoFallback}`}
                alt={`${byline.name}, ${byline.role}`}
                width={56}
                height={56}
                className="h-14 w-14 flex-none rounded-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <p className="leading-snug">
              <span className="block font-bold">{byline.name}</span>
              <span className="small">
                {byline.role} · {byline.meta}
              </span>
            </p>
            <a href={byline.bioHref} className="link-arrow ml-auto hidden text-[15px] sm:inline-flex">
              {byline.bioLabel}
            </a>
          </div>
          <h2 className="h2 mt-8">{answerBlock.question}</h2>
          <p className="lead mt-5">{answerBlock.answer}</p>
        </div>
      </div>
    </section>
  );
}

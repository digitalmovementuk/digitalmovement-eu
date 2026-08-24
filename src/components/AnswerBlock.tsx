import { Reveal } from "../lib/Reveal";
import { answerBlock, byline } from "../content";

const BASE = import.meta.env.BASE_URL;

/**
 * Blueprint 3 + 4 — Byline und Antwortblock, in einem Abschnitt.
 *
 * Der Hausstandard („The Million-Dollar Landing Page“, übernommen am
 * 23.08.2026) führt beide als eigene Bausteine. Auf dieser Seite stehen
 * sie zusammen, und zwar aus einem gemessenen Grund: der Startbereich
 * endet bei zwei Dritteln des Bildschirms, das letzte Drittel gehört dem
 * nächsten Abschnitt. Zwei dünne Streifen hintereinander würden dieses
 * Drittel unter sich aufteilen und keiner von beiden wäre lesbar. Als ein
 * Abschnitt ragt stattdessen die Byline vollständig und der Anfang der
 * Antwort in den ersten Bildschirm.
 *
 * Der Antwortblock ist bewusst 52 Wörter lang und steht ohne Kontext:
 * er ist der Absatz, den eine KI zitiert, wenn sie diese Seite als Quelle
 * nimmt. Wer ihn kürzt, kürzt die Zitierfähigkeit weg.
 */
export function AnswerBlock() {
  return (
    <section
      id="antwort"
      data-surface="light"
      aria-labelledby="antwort-frage"
      className="surface-light pt-12 sm:pt-14 md:pt-16 pb-14 sm:pb-16 md:pb-20"
    >
      <div className="container-v3">
        {/* ---------- Byline: ein Mensch mit Namen und Gesicht ---------- */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <img
              src={`${BASE}${byline.photo}`}
              width={52}
              height={52}
              alt={`${byline.name}, ${byline.role}`}
              loading="lazy"
              decoding="async"
              className="h-[52px] w-[52px] shrink-0 rounded-full object-cover ring-1 ring-ink/10"
            />
            <p className="text-[14.5px] leading-snug text-ink-soft">
              <span className="font-bold text-ink">{byline.name}</span>
              <span className="text-ink-muted"> · {byline.role}</span>
              <span className="block text-[13px] text-ink-muted">{byline.meta}</span>
            </p>
            <a
              href={byline.bioHref}
              className="ml-auto text-[13.5px] font-semibold text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
            >
              {byline.bioLabel}
            </a>
          </div>
        </Reveal>

        {/* ---------- Antwortblock ---------- */}
        <Reveal delay={0.06}>
          <div className="mt-8 sm:mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:items-start">
            <h2
              id="antwort-frage"
              className="balance text-ink"
              style={{
                fontSize: "clamp(24px, 2.2vw, 32px)",
                lineHeight: "1.1",
                letterSpacing: "-0.032em",
                fontWeight: 700,
              }}
            >
              {answerBlock.question}
            </h2>
            <p className="text-[16.5px] sm:text-[18px] leading-relaxed text-ink-soft max-w-[62ch]">
              {answerBlock.answer}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

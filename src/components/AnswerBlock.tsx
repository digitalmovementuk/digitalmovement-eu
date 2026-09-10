import { Reveal } from "../lib/Reveal";
import { answerBlock } from "../content";


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
        {/* ---------- Antwortblock ---------- */}
        <Reveal delay={0.06}>
          {/* Antwort vor Frage — im Quelltext, nicht im Bild.
              Der Blueprint verlangt den Antwortabsatz zwischen der
              Seitenüberschrift und der ersten Zwischenüberschrift: Das ist
              die Stelle, an der eine Suchmaschine oder eine KI die Antwort
              erwartet. Im Bild bleibt die Reihenfolge Frage → Antwort,
              dafür sorgen die order-Klassen.
              Für Screenreader geht dabei nichts verloren: Der Abschnitt
              trägt aria-labelledby="antwort-frage", wird also mit der Frage
              als Namen angekündigt, bevor die Antwort gelesen wird. */}
          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:items-start">
            <p className="order-2 text-[16.5px] sm:text-[18px] leading-relaxed text-ink-soft max-w-[62ch]">
              {answerBlock.answer}
            </p>
            <h2
              id="antwort-frage"
              className="order-1 balance text-ink"
              style={{
                fontSize: "clamp(24px, 2.2vw, 32px)",
                lineHeight: "1.1",
                letterSpacing: "-0.032em",
                fontWeight: 700,
              }}
            >
              {answerBlock.question}
            </h2>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

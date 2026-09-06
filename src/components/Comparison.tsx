import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, X } from "lucide-react";
import { Reveal } from "../lib/Reveal";
import { useT } from "../lib/i18n";

/**
 * Comparison — „Andere Agenturen vs. Digital Movement“, Blueprint Teil 12.
 *
 * Version 1.1 · Stand 24.08.2026
 *
 * Änderung 1.1: aus zwei Karten wird eine echte Tabelle. Der Blueprint
 * verlangt an dieser Stelle wörtlich „eine echte <table> mit Merkmalen und
 * Preisen gegen die Alternativen … niemals ein Bild einer Tabelle“. Zwei
 * Listen nebeneinander sehen aus wie ein Vergleich, sind aber keiner: Wer
 * sie liest — ein Mensch mit Vorleseprogramm ebenso wie eine
 * Suchmaschine — bekommt zwei getrennte Aufzählungen und muss die Zeilen
 * selbst zusammenlegen. In einer Tabelle gehören „Vertragslaufzeit“,
 * „12 oder 24 Monate“ und „90-Tage-Sprint“ nachweislich zusammen.
 *
 * Auf dem Telefon bleibt es dieselbe Tabelle, sie wird nur anders
 * dargestellt: Jede Zeile klappt zu einem Block auf, weil drei Spalten
 * deutscher Text in 375 Pixeln nicht lesbar sind. Deshalb trägt jede
 * Zelle ihre eigene Beschriftung („Andere Agenturen“ / „Digital
 * Movement“) — sichtbar nur dort, wo die Kopfzeile ausgeblendet ist. Am
 * Auszeichnungs-Baum ändert das nichts, `display` ist reine Darstellung.
 *
 * Der Rest ist unverändert: Text aus i18n (speist sich aus `comparison`
 * in content.ts), die beiden treibenden Farbkreise im Hintergrund.
 * Entfallen ist allein das Abzeichen „NEO“ — die Marke heißt seit dem
 * Rebrand Digital Movement, und die Spaltenüberschrift sagt es ohnehin.
 */

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** Tönung der Digital-Movement-Spalte. Dieselbe Akzentfarbe wie zuvor. */
const HIGHLIGHT = "rgba(255,122,69,0.06)";

export function Comparison() {
  const t = useT();
  const cols = t.comparison.columns;
  const rows = t.comparison.rows;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orbAY = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);
  const orbBY = useTransform(scrollYProgress, [0, 1], ["6%", "-8%"]);

  return (
    <section
      ref={sectionRef}
      id="comparison"
      data-surface="light"
      className="surface-light-2 relative overflow-hidden pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-20 md:pb-24"
      style={{ background: "var(--surface-light-2)" }}
    >
      {/* Ambient parallax orbs — soft brand-colour washes drifting on scroll */}
      <motion.div
        aria-hidden
        style={{ y: orbAY }}
        className="pointer-events-none absolute -left-32 top-32 h-[520px] w-[520px] rounded-full opacity-[0.07]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, #FF7A45 0%, transparent 65%)",
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ y: orbBY }}
        className="pointer-events-none absolute -right-24 bottom-24 h-[460px] w-[460px] rounded-full opacity-[0.06]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, #EC178D 0%, transparent 65%)",
          }}
        />
      </motion.div>

      <div className="container-v3 relative">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-12 items-end text-center lg:text-left">
          <div>
            <Reveal>
              <p className="eyebrow text-ink-muted">{t.comparison.eyebrow}</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="mt-5 max-w-[34ch] mx-auto lg:mx-0 balance text-ink"
                style={{
                  fontSize: "clamp(28px, 2.5vw, 36px)",
                  lineHeight: "1.04",
                  letterSpacing: "-0.034em",
                  fontWeight: 700,
                }}
              >
                {t.comparison.headlineMain}
                <span className="text-ink/55"> {t.comparison.headlineSub}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="text-[15px] sm:text-[17px] text-ink-soft leading-relaxed max-w-[480px] mx-auto lg:mx-0 lg:justify-self-end">
              {t.comparison.intro}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.06}>
          <div className="mt-12 sm:mt-16 overflow-hidden rounded-[28px] sm:rounded-[36px] border border-ink/10 bg-white shadow-card">
            <table className="block w-full border-collapse text-left md:table">
              <caption className="sr-only">
                {`${cols.other} und ${cols.neo} im Vergleich — ${rows.length} Punkte.`}
              </caption>

              {/* Auf dem Telefon ausgeblendet: dort trägt jede Zelle ihre
                  eigene Beschriftung, siehe unten. */}
              <thead className="hidden md:table-header-group">
                <tr>
                  <th
                    scope="col"
                    className="eyebrow w-[24%] px-6 py-5 text-ink-muted align-bottom"
                  >
                    {cols.topic}
                  </th>
                  <th
                    scope="col"
                    className="eyebrow w-[38%] px-6 py-5 text-ink-muted align-bottom"
                  >
                    {cols.other}
                  </th>
                  <th
                    scope="col"
                    className="eyebrow w-[38%] px-6 py-5 text-ink align-bottom"
                    style={{ background: HIGHLIGHT }}
                  >
                    {cols.neo}
                  </th>
                </tr>
              </thead>

              <tbody className="block md:table-row-group">
                {rows.map((r, i) => (
                  <motion.tr
                    key={r.topic}
                    /* Nur die Deckkraft wird bewegt. Ein `transform` auf einer
                       Tabellenzeile ist von Browser zu Browser verschieden
                       umgesetzt — der Effekt wäre denselben Aufwand nicht
                       wert, das Risiko einer verrutschten Zeile schon gar
                       nicht. */
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.45, delay: 0.06 * i, ease: EASE_OUT }}
                    className="block border-t border-ink/10 first:border-t-0 md:table-row md:border-ink/8 md:first:border-t"
                  >
                    <th
                      scope="row"
                      className="block px-6 pt-5 pb-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-muted md:table-cell md:py-5 md:align-top md:text-[13.5px] md:font-semibold md:normal-case md:tracking-normal md:text-ink"
                    >
                      {r.topic}
                    </th>

                    <td className="block px-6 pb-3 md:table-cell md:py-5 md:align-top">
                      <span className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-faint md:hidden">
                        {cols.other}
                      </span>
                      <span className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink/8 text-ink-faint"
                        >
                          <X size={11} strokeWidth={3} />
                        </span>
                        <span className="text-[14px] sm:text-[15px] leading-snug text-ink-soft">
                          {r.other}
                        </span>
                      </span>
                    </td>

                    <td
                      className="block px-6 pt-3 pb-5 md:table-cell md:py-5 md:align-top"
                      style={{ background: HIGHLIGHT }}
                    >
                      <span className="mb-1.5 block text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-muted md:hidden">
                        {cols.neo}
                      </span>
                      <span className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                          style={{ background: "#FF7A45" }}
                        >
                          <Check size={11} strokeWidth={3} />
                        </span>
                        <span className="text-[14px] sm:text-[15px] font-semibold leading-snug text-ink">
                          {r.neo}
                        </span>
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

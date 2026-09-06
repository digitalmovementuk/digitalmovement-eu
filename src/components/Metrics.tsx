import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp } from "../lib/useCountUp";
import { Reveal } from "../lib/Reveal";
import { metrics } from "../content";

/**
 * Zahlen — der Beleg-Abschnitt.
 *
 * Aufbau wie im Vorbild: eine breite Karte mit der Leitzahl, darunter zwei
 * Karten mit je einer eigenen kleinen Grafik. Die drei Zahlen sind die
 * drei aus dem freigegebenen Dokument — 8×, 90 Tage, 300 Kundenprojekte.
 *
 * Was hier nicht steht, steht mit Absicht nicht hier. Die englische
 * Vorlage trug „500+ businesses", „3.500+ pages" und eine Umsatzangabe.
 * Für keine dieser Zahlen gibt es einen deutschen Beleg, und § 5 UWG
 * fragt nicht, ob eine Angabe stimmt, sondern ob sie belegbar ist. Wer
 * eine Zahl zurückholen will, braucht erst den Beleg dafür.
 */
export function Metrics() {
  const [leitzahl, tage, projekte] = metrics.items;

  return (
    <section
      id="metrics"
      data-surface="light"
      className="surface-light relative pt-28 sm:pt-32 md:pt-36 pb-28 sm:pb-32 md:pb-36 overflow-hidden"
    >
      {/* Leiser Farbschimmer — verankert den Abschnitt, ohne mit den
          Karten zu konkurrieren. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-32 h-[520px] w-[520px] rounded-full opacity-[0.10]"
        style={{
          background: "radial-gradient(circle at center, #EC178D 0%, transparent 65%)",
        }}
      />

      <div className="container-v3 relative">
        {/* Abschnittskopf */}
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-12 items-end text-center lg:text-left">
          <div>
            <Reveal>
              <p className="eyebrow text-ink-muted">{metrics.eyebrow}</p>
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
                {metrics.headlineMain}
                <span className="block text-ink/55">{metrics.headlineSub}</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="text-[15px] sm:text-[17px] text-ink-soft leading-relaxed max-w-[480px] mx-auto lg:mx-0 lg:justify-self-end">
              {metrics.intro}
            </p>
          </Reveal>
        </div>

        {/* Leitzahl */}
        <FeaturedStat value={leitzahl.value} suffix={leitzahl.suffix} label={leitzahl.label} />

        {/* Zwei Belegkarten. grid-cols-2, nicht 3: eine Zweierreihe im
            Dreierraster lässt rechts ein Loch, das wie ein Fehler aussieht
            und nicht wie Gestaltung. */}
        <div className="mt-5 sm:mt-6 grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <DaysStat value={tage.value} label={tage.label} />
          <ProjectsStat value={projekte.value} label={projekte.label} />
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Leitzahl: 8× mehr Anfragen pro Monat                           */
/* ────────────────────────────────────────────────────────────── */

function FeaturedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { amount: 0.35, once: true });
  const { ref: numRef, value: counted } = useCountUp(value);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-10 sm:mt-12 md:mt-14 relative bg-white rounded-[24px] sm:rounded-[32px] border border-ink/8 overflow-hidden p-5 sm:p-8 md:p-10 lg:p-12"
    >
      <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 md:gap-10 items-center text-center">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-muted">
            <span>01</span>
            <span className="h-px w-6 bg-ink/15" />
            <span>Nach 90 Tagen</span>
          </div>

          <span
            ref={numRef as never}
            className="mt-3 block text-ink"
            style={{
              fontSize: "clamp(64px, 10vw, 140px)",
              lineHeight: "0.88",
              letterSpacing: "-0.05em",
              fontWeight: 700,
            }}
          >
            {inView ? counted : 0}
            <span className="text-ink/55">{suffix}</span>
          </span>

          <p className="mt-3 text-[14px] sm:text-[15px] font-bold uppercase tracking-[0.18em] text-ink">
            {label}
          </p>
          <p className="mt-3 max-w-[440px] text-[14px] sm:text-[15px] text-ink-soft leading-relaxed">
            Gemessen an qualifizierten Anfragen, nicht an Klicks. Was sich bewegt hat und warum,
            steht jeden Monat auf einer Seite.
          </p>
        </div>

        <BarChartVisual inView={inView} />
      </div>
    </motion.div>
  );
}

function BarChartVisual({ inView }: { inView: boolean }) {
  const bars = [
    { label: "Vorher", value: 1, display: "1×", mute: true },
    { label: "Digital Movement", value: 8, display: "8×", mute: false },
  ];
  const maxValue = 8;
  return (
    <div className="relative w-full max-w-[460px] justify-self-center md:justify-self-end">
      <div className="flex items-end gap-6 sm:gap-10 h-[160px] sm:h-[220px] md:h-[260px]">
        {bars.map((b) => {
          const heightPct = (b.value / maxValue) * 100;
          return (
            <div key={b.label} className="flex-1 flex flex-col items-center gap-3">
              <div className="relative w-full flex items-end" style={{ height: "100%" }}>
                <motion.div
                  initial={{ height: "0%" }}
                  animate={inView ? { height: `${heightPct}%` } : { height: "0%" }}
                  transition={{
                    duration: 1.2,
                    delay: b.mute ? 0.1 : 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`w-full rounded-t-[12px] ${b.mute ? "bg-ink/12" : ""}`}
                  style={
                    b.mute
                      ? undefined
                      : { background: "linear-gradient(180deg, #EC178D 0%, #9A2FC6 100%)" }
                  }
                />
              </div>
              <p
                className={`text-[10.5px] font-bold uppercase tracking-[0.16em] ${
                  b.mute ? "text-ink-faint" : "text-ink"
                }`}
              >
                {b.label}
              </p>
              <p
                className={`text-[18px] sm:text-[20px] font-bold ${
                  b.mute ? "text-ink-muted" : "text-ink"
                } -mt-1`}
                style={{ letterSpacing: "-0.025em" }}
              >
                {b.display}
              </p>
            </div>
          );
        })}
      </div>
      <div className="mt-2 h-px bg-ink/12" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Beleg: 90 Tage bis Google Seite 1                              */
/* ────────────────────────────────────────────────────────────── */

function DaysStat({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const { ref: numRef, value: counted } = useCountUp(value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-[28px] sm:rounded-[36px] border border-ink/8 overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-[300px] text-center"
    >
      <div className="inline-flex self-center items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-muted">
        <span>02</span>
        <span className="h-px w-6 bg-ink/15" />
        <span>Sichtbarkeit</span>
      </div>

      <div className="my-6">
        <span
          ref={numRef as never}
          className="block text-ink"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: "0.9",
            letterSpacing: "-0.045em",
            fontWeight: 700,
          }}
        >
          {(inView ? counted : 0).toLocaleString("de-DE")}
        </span>
      </div>

      {/* Weg von unsichtbar auf Seite 1 */}
      <div className="mb-6">
        <div className="relative h-1.5 rounded-full bg-ink/10 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={inView ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 1.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: "linear-gradient(90deg, #F05F22 0%, #EC178D 100%)" }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10.5px] font-bold uppercase tracking-[0.16em] text-ink-faint">
          <span>Unsichtbar</span>
          <span>Google Seite 1</span>
        </div>
      </div>

      <p className="text-[14.5px] sm:text-[15.5px] text-ink-soft leading-relaxed">
        {label}. Erste Platzierungen planen wir auf Tag 60, den gemessenen Anfragen-Zuwachs auf
        Tag 90.
      </p>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Beleg: 300 abgeschlossene Kundenprojekte                       */
/* ────────────────────────────────────────────────────────────── */

function ProjectsStat({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const { ref: numRef, value: counted } = useCountUp(value);
  /* 30 Punkte, einer je zehn Projekte. Eine Sternenreihe stand hier
     vorher — Sterne sind eine Bewertung, keine Projektzahl. */
  const dots = Array.from({ length: 30 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-[28px] sm:rounded-[36px] border border-ink/8 overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-[300px] text-center"
    >
      <div className="inline-flex self-center items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-muted">
        <span>03</span>
        <span className="h-px w-6 bg-ink/15" />
        <span>Erfahrung</span>
      </div>

      <div className="my-6">
        <span
          ref={numRef as never}
          className="block text-ink"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: "0.9",
            letterSpacing: "-0.045em",
            fontWeight: 700,
          }}
        >
          {(inView ? counted : 0).toLocaleString("de-DE")}
        </span>
      </div>

      <div className="mb-6 mx-auto grid grid-cols-10 gap-1.5 max-w-[240px]" aria-hidden>
        {dots.map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.02, ease: [0.22, 1, 0.36, 1] }}
            className="block h-2 w-2 rounded-full"
            style={{ background: "linear-gradient(135deg, #EC178D 0%, #9A2FC6 100%)" }}
          />
        ))}
      </div>

      <p className="text-[14.5px] sm:text-[15.5px] text-ink-soft leading-relaxed">
        {label} — Beratung, Handwerk, Praxen, Dienstleister, E-Commerce und B2B. Ein Punkt steht
        für zehn Projekte.
      </p>
    </motion.div>
  );
}

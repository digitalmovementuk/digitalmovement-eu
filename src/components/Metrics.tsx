import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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
  const reduceMotion = useReducedMotion();
  const counted = useCountUp(value, inView);

  return (
    <motion.div
      ref={cardRef}
      data-metric="enquiries"
      initial={{ opacity: 0, y: 24 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
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
            className="metric-value mt-3 block text-ink"
            style={{
              fontSize: "clamp(64px, 10vw, 140px)",
              lineHeight: "0.88",
              letterSpacing: "-0.05em",
              fontWeight: 700,
            }}
          >
            {counted}
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

        <BarChartVisual />
      </div>
    </motion.div>
  );
}

function BarChartVisual() {
  const ref = useRef<HTMLDivElement>(null);
  // On phones the chart sits below the number. Start when the plot itself
  // is visible, so its animation is not over before the visitor reaches it.
  const inView = useInView(ref, { amount: 0.25, once: true });
  const reduceMotion = useReducedMotion();
  const bars = [
    { label: "Vorher", value: 1, display: "1×", mute: true },
    { label: "Digital Movement", value: 8, display: "8×", mute: false },
  ];
  return (
    <div ref={ref} className="metric-chart relative w-full max-w-[460px] justify-self-center md:justify-self-end" role="img" aria-label="Anfragen im Vergleich: vorher 1-fach, mit Digital Movement 8-fach.">
      <div className="grid grid-cols-2 gap-6 sm:gap-10" aria-hidden="true">
        {bars.map((bar) => (
          <div key={bar.label} className="min-w-0 flex flex-col items-center gap-3">
            <div className="metric-bar-track relative w-full h-[160px] sm:h-[220px] md:h-[260px] flex items-end">
              <motion.div
                className="metric-bar w-full rounded-t-[12px]"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: inView || reduceMotion ? 1 : 0 }}
                transition={{ duration: reduceMotion ? 0 : 1.2, delay: reduceMotion ? 0 : bar.mute ? 0.1 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: `${bar.value / 8 * 100}%`,
                  transformOrigin: "center bottom",
                  background: bar.mute ? "#dcd6e4" : "linear-gradient(180deg, #EC178D 0%, #9A2FC6 100%)",
                }}
              />
            </div>
            <p className={`text-[10.5px] font-bold uppercase tracking-[0.16em] ${bar.mute ? "text-ink-faint" : "text-ink"}`}>
              {bar.label}
            </p>
            <p className={`text-[18px] sm:text-[20px] font-bold ${bar.mute ? "text-ink-muted" : "text-ink"} -mt-1`} style={{ letterSpacing: "-0.025em" }}>
              {bar.display}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-2 h-px bg-ink/10" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  Beleg: 90 Tage bis Google Seite 1                              */
/* ────────────────────────────────────────────────────────────── */

function DaysStat({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const reduceMotion = useReducedMotion();
  const counted = useCountUp(value, inView);
  return (
    <motion.div
      ref={ref}
      data-metric="days"
      initial={{ opacity: 0, y: 24 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-[28px] sm:rounded-[36px] border border-ink/8 overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-[300px] text-center"
    >
      <div className="inline-flex self-center items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-muted">
        <span>02</span>
        <span className="h-px w-6 bg-ink/15" />
        <span>Sichtbarkeit</span>
      </div>

      <div className="my-6">
        <span
          className="metric-value block text-ink"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: "0.9",
            letterSpacing: "-0.045em",
            fontWeight: 700,
          }}
        >
          {counted.toLocaleString("de-DE")}
        </span>
      </div>

      {/* Weg von unsichtbar auf Seite 1 */}
      <div className="mb-6">
        <div className="relative h-1.5 rounded-full bg-ink/10 overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: inView || reduceMotion ? 1 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.4, delay: reduceMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="metric-progress absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(90deg, #F05F22 0%, #EC178D 100%)", transformOrigin: "left center" }}
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
  const reduceMotion = useReducedMotion();
  const counted = useCountUp(value, inView);
  /* 30 Punkte, einer je zehn Projekte. Eine Sternenreihe stand hier
     vorher — Sterne sind eine Bewertung, keine Projektzahl. */
  const dots = Array.from({ length: 30 });

  return (
    <motion.div
      ref={ref}
      data-metric="projects"
      initial={{ opacity: 0, y: 24 }}
      animate={inView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-[28px] sm:rounded-[36px] border border-ink/8 overflow-hidden p-6 sm:p-8 flex flex-col justify-between min-h-[240px] sm:min-h-[300px] text-center"
    >
      <div className="inline-flex self-center items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink-muted">
        <span>03</span>
        <span className="h-px w-6 bg-ink/15" />
        <span>Erfahrung</span>
      </div>

      <div className="my-6">
        <span
          className="metric-value block text-ink"
          style={{
            fontSize: "clamp(48px, 8vw, 96px)",
            lineHeight: "0.9",
            letterSpacing: "-0.045em",
            fontWeight: 700,
          }}
        >
          {counted.toLocaleString("de-DE")}
        </span>
      </div>

      <div className="mb-6 mx-auto grid grid-cols-10 gap-1.5 max-w-[240px]" aria-hidden>
        {dots.map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView || reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.2 + i * 0.02, ease: [0.22, 1, 0.36, 1] }}
            className="metric-project-dot block h-2 w-2 rounded-full"
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

import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { services, servicesIntro } from "../content";
import { Reveal } from "../lib/Reveal";

const AUTOPLAY_MS = 8000;

/**
 * ServicesCarousel — Apple "Why Apple Watch" feature-story slider.
 * Each service = one full-screen rounded card, swipe horizontally to advance.
 * Bottom: pill of dots + circular pause/play. Auto-advances.
 */
export function ServicesCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);

  const goTo = useCallback((idx: number) => {
    const track = trackRef.current;
    const slide = slideRefs.current[idx];
    if (!track || !slide) return;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  const next = useCallback(() => {
    const idx = (activeIdx + 1) % services.length;
    goTo(idx);
  }, [activeIdx, goTo]);

  const prev = useCallback(() => {
    const idx = (activeIdx - 1 + services.length) % services.length;
    goTo(idx);
  }, [activeIdx, goTo]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const obs = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        }
        if (best) {
          const idx = slideRefs.current.findIndex((el) => el === best!.target);
          if (idx !== -1) setActiveIdx(idx);
        }
      },
      { root: track, threshold: [0.4, 0.6, 0.8] },
    );
    slideRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (paused || hovering) return;
    const track = trackRef.current;
    if (!track) return;
    let visible = false;
    const sectionObs = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );
    sectionObs.observe(track);
    const tick = () => {
      if (!visible || document.hidden) return;
      next();
    };
    const id = window.setInterval(tick, AUTOPLAY_MS);
    return () => {
      window.clearInterval(id);
      sectionObs.disconnect();
    };
  }, [paused, hovering, next]);

  return (
    <section
      id="services"
      data-surface="light"
      className="surface-light relative flex flex-col pt-28 sm:pt-32 md:pt-32 pb-16 sm:pb-12 md:h-[100svh] md:min-h-[760px]"
    >
      <div className="container-v3 shrink-0">
        {/* Die Vorlage hat hier rechts noch einen Fließtext. Das freigegebene
            Dokument gibt für diesen Abschnitt nur Kicker und Überschrift vor,
            deshalb steht rechts nichts — erfundener Text wäre die einzige
            Alternative, und der wäre schlechter als eine ruhige Zeile. */}
        <div className="text-center lg:text-left">
          <Reveal>
            <p className="eyebrow text-ink-muted">{servicesIntro.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              className="mt-3 max-w-[22ch] mx-auto lg:mx-0 balance text-ink"
              style={{
                fontSize: "clamp(28px, 3.6vw, 52px)",
                lineHeight: "1.02",
                letterSpacing: "-0.034em",
                fontWeight: 700,
              }}
            >
              {servicesIntro.headlineMain}
              <span className="block text-ink/55">{servicesIntro.headlineSub}</span>
            </h2>
          </Reveal>
        </div>
      </div>

      <div
        ref={trackRef}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className="snap-x mt-5 sm:mt-6 flex overflow-x-auto flex-1 min-h-0 gap-3 sm:gap-4"
        style={{
          scrollSnapType: "x mandatory",
          // Match container-v3's content edge on both sides so the first
          // slide's left edge lines up with the H2 above (and the last
          // slide's right edge mirrors). Without this, scroll-snap "center"
          // clamps the first slide flush to the viewport-left at scrollLeft=0.
          paddingLeft: "max(var(--gutter), calc((100vw - var(--container-max)) / 2 + var(--gutter)))",
          paddingRight: "max(var(--gutter), calc((100vw - var(--container-max)) / 2 + var(--gutter)))",
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
          } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
          }
        }}
      >
        {services.map((s, i) => (
          <ServiceSlide
            key={s.key}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            service={s}
            index={i}
          />
        ))}
      </div>

      {/* Apple-style controls — dots only */}
      <div className="container-v3 mt-5 sm:mt-7 shrink-0 flex items-center justify-center">
        <div className="flex items-center gap-1 sm:gap-2 rounded-full bg-ink/[0.10] backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2">
          {services.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Zu ${s.title}`}
              // The visible dot stays small but the button's hit area is
              // 28×28 — WCAG 2.5.5 recommends ≥24 px for touch targets.
              className="grid h-7 w-auto min-w-7 place-items-center px-1.5"
            >
              <span
                aria-hidden
                className={`block h-2.5 sm:h-3 rounded-full transition-all ${
                  activeIdx === i ? "w-9 sm:w-12 bg-ink/85" : "w-2.5 sm:w-3 bg-ink/35 hover:bg-ink/55"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const ServiceSlide = ({
  ref,
  service,
  index,
}: {
  ref: (el: HTMLElement | null) => void;
  service: (typeof services)[number];
  index: number;
}) => {
  return (
    <article
      ref={ref}
      className="snap-card flex-shrink-0"
      style={{
        scrollSnapAlign: "center",
        scrollSnapStop: "always",
        // Slide width = container-v3 content width so the active (centered)
        // slide's left edge lines up with the section H2 above. The remaining
        // viewport space on either side becomes the peek area for the previous
        // and next slides — true carousel behaviour.
        width: "calc(min(100vw, var(--container-max)) - 2 * var(--gutter))",
      }}
      aria-roledescription="slide"
      aria-label={`${index + 1} von ${services.length}: ${service.title}`}
    >
      <div className="relative h-full min-h-[460px] w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-ink shadow-card">
        {/* Full-bleed brand video covers the whole card */}
        <ServiceVideo file={service.video} />
        {/* Bottom darken — keeps the two-line overlay legible without
            heavy-handed full-card tinting */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,8,32,0) 35%, rgba(15,8,32,0.55) 80%, rgba(15,8,32,0.78) 100%)",
          }}
        />

        {/* Counter chip — top-right */}
        <span className="absolute top-5 right-5 rounded-full bg-white/15 backdrop-blur-md text-white text-[10.5px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 border border-white/15">
          {String(index + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
        </span>

        {/* Two-line overlay — eyebrow + headline, bottom-left */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10 lg:p-12">
          <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.18em] text-white/85">
            {service.title}
          </p>
          <h3
            className="mt-2 max-w-[16ch] balance text-white"
            style={{
              fontSize: "clamp(28px, 3.4vw, 48px)",
              lineHeight: "1.04",
              letterSpacing: "-0.034em",
              fontWeight: 600,
            }}
          >
            {service.promise}
          </h3>

          {/* The way into the service page. A card that looks clickable but
              isn't is worse than a plain card, and a card that IS the link
              still leaves nothing on screen saying so — hence a real button
              with a real label rather than a whole-card <Link>. The label
              names its destination ("View SEO"), so each one is distinct for
              a screen-reader user pulling up a list of links, and no
              aria-label is needed to disambiguate them. */}
          <Link
            to={service.to}
            className="mt-5 sm:mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 sm:px-6 sm:py-3.5 text-[14px] sm:text-[15px] font-semibold text-ink shadow-[0_14px_34px_-14px_rgba(0,0,0,0.65)] transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-white"
          >
            {service.ctaLabel}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
};

function ServiceVideo({ file }: { file: string }) {
  // Mount the <video> element only once the card is within 800 px of the
  // viewport — generous enough that on any normal scroll speed the buffer
  // is ready before the card is seen, but small enough that we never load
  // all four (~25 MB) on initial paint. Once mounted we stay mounted; the
  // inner IO only controls play / pause.
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldMount) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    const tryPlay = () => v.play().catch(() => {});
    const restartAndPlay = () => {
      try {
        v.currentTime = 0;
      } catch {
        // Safari occasionally throws if metadata isn't ready yet.
      }
      tryPlay();
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) restartAndPlay();
        else v.pause();
      },
      { threshold: 0.6 },
    );
    io.observe(v);
    tryPlay();
    return () => io.disconnect();
  }, [shouldMount, file]);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(154,47,198,0.40) 0%, rgba(27,14,46,1) 65%)",
        }}
      />
      {shouldMount && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover scale-[1.18] origin-center"
          src={`${import.meta.env.BASE_URL}${file}`}
          aria-hidden
          {...({ "webkit-playsinline": "true", "x5-playsinline": "true" } as Record<string, string>)}
        />
      )}
    </div>
  );
}

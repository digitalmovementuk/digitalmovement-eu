import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { casesIntro, caseStudies, type CaseStudy } from "../content";

/* Erfolgsgeschichten, Fassung 2 (Design-Audit 04.09.2026).
   Fünf Karten in einem 2+3-Raster, damit die letzte Reihe voll ist.
   Jede Karte zeigt den echten ersten Bildschirm der Kundenseite in einem
   verkleinerten iframe (unverändert aus Fassung 1 — check-render prüft
   „#cases iframe"), darunter Kunde, Branche, Ort, Kopfzeile, drei Zahlen
   und den Link. Keine Story-Ansicht, keine Bewegung mehr. */

const FRAME_SIZE = {
  desktop: { w: 1440, h: 900 },
  phone: { w: 390, h: 844 },
} as const;

/**
 * Zeigt den eingefrorenen Startbereich eines Kunden formatfüllend in der
 * Kachel. Der Rahmen wird in seiner echten Größe geladen und dann
 * heruntergerechnet — so sieht der Besucher genau das Layout, das der Kunde
 * ausliefert, und nicht die Telefonfassung in Kachelbreite.
 */
function CaseHeroFrame({
  slug,
  variant,
}: {
  slug: string;
  variant: "desktop" | "phone";
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(0.4);
  const size = FRAME_SIZE[variant];

  // Erst laden, wenn die Kachel in die Nähe des Sichtfelds kommt: jede Kopie
  // bringt ihre eigenen Bilder und ihr eigenes Video mit.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "700px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Vollständig sichtbar: der KLEINERE der beiden Faktoren. Formatfüllend
     (der größere) sähe satter aus, schneidet aber immer eine Seite des
     Startbereichs ab — und gezeigt werden soll der ganze erste Bildschirm,
     so wie der Besucher der Kundenseite ihn sieht. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      setScale(Math.min(r.width / size.w, r.height / size.h));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [size.w, size.h]);

  /* Das Video im Rahmen muss LAUFEN.
   *
   * Die eingefrorene Kopie trägt `autoplay muted loop playsinline` am
   * <video> — trotzdem stand jedes Video am 15.08.2026 bei 0,00 s still.
   * Grund: ein iframe mit `sandbox` startet von sich aus kein Video; die
   * Erlaubnis dafür kommt erst über `allow="autoplay"`. Und weil in der
   * Kopie bewusst kein JavaScript läuft (kein allow-scripts), kann sie sich
   * auch nicht selbst starten.
   *
   * Also startet die Elternseite sie: gleiches Origin, also ist
   * `contentDocument` erreichbar. Zusätzlich wird angehalten, sobald die
   * Kachel aus dem Bild ist — fünf gleichzeitig laufende Videos kosten sonst
   * dauerhaft Rechenzeit.
   */
  useEffect(() => {
    if (!mounted) return;
    const frame = frameRef.current;
    const el = wrapRef.current;
    if (!frame || !el) return;

    let visible = true;

    const videos = () => {
      try {
        return [...(frame.contentDocument?.querySelectorAll("video") ?? [])];
      } catch {
        return [] as HTMLVideoElement[];
      }
    };

    const run = () => {
      for (const v of videos()) {
        v.muted = true;
        v.loop = true;
        if (visible) void v.play().catch(() => {});
        else v.pause();
      }
    };

    frame.addEventListener("load", run);
    run();
    // Der load kann schon durch sein; ein zweiter Versuch fängt zusätzlich
    // Videos, die ihre Daten erst kurz danach haben.
    const retry = window.setTimeout(run, 900);

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          run();
        },
        { rootMargin: "120px" },
      );
      io.observe(el);
    }

    return () => {
      frame.removeEventListener("load", run);
      window.clearTimeout(retry);
      io?.disconnect();
    };
  }, [mounted]);

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden bg-surface-2">
      {mounted && (
        <iframe
          ref={frameRef}
          src={`${import.meta.env.BASE_URL}cases/${slug}/${variant}/index.html`}
          title=""
          aria-hidden
          tabIndex={-1}
          scrolling="no"
          loading="lazy"
          // Ohne diese Zeile darf im Rahmen kein Video von selbst starten.
          allow="autoplay"
          // Ohne allow-scripts: die Kopie enthält kein JavaScript, und so
          // kann auch keins nachwachsen.
          sandbox="allow-same-origin"
          /* Oben ausgerichtet: der freie Streifen, der beim vollständigen
             Anzeigen entsteht, sammelt sich unten — dort, wo die Zahlen der
             Fallstudie liegen. Zentriert läge er zur Hälfte über dem
             Startbereich. */
          className="pointer-events-none absolute left-1/2 top-0 border-0"
          style={{
            width: size.w,
            height: size.h,
            transform: `translateX(-50%) scale(${scale})`,
            transformOrigin: "top center",
          }}
        />
      )}
    </div>
  );
}

function CaseCard({ study, index }: { study: CaseStudy; index: number }) {
  return (
    <li className="card flex flex-col overflow-hidden p-0">
      <div className="relative aspect-[16/10] w-full border-b border-line">
        <CaseHeroFrame slug={study.slug} variant="desktop" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="small font-semibold">
          <span className="tabular">{String(index + 1).padStart(2, "0")}</span> · {study.industry}
          {study.location ? ` · ${study.location}` : ""}
        </p>
        <h3 className="h3 mt-2">
          {study.client}
          <span className="block text-[17px] font-semibold text-ink-soft">{study.headline}</span>
        </h3>
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-4">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <dd className="text-[18px] font-extrabold leading-tight tabular text-accent">{m.value}</dd>
              <dt className="small">{m.label}</dt>
            </div>
          ))}
        </dl>
        <div className="mt-auto pt-5">
          {study.url ? (
            <a href={study.url} target="_blank" rel="noopener noreferrer" className="link-arrow text-[16px]">
              {casesIntro.visitLabel} <ArrowUpRight size={16} aria-hidden />
            </a>
          ) : (
            <span className="small">{study.services.join(" · ")}</span>
          )}
        </div>
      </div>
    </li>
  );
}

export function ClientCases() {
  return (
    <section id="cases" data-surface="light" className="surface-light section">
      <div className="container-v3">
        <div className="section-head">
          <p className="eyebrow">{casesIntro.eyebrow}</p>
          <h2 className="h2">
            {casesIntro.headlineMain} <span className="text-accent">{casesIntro.headlineSub}</span>
          </h2>
          <p className="lead">{casesIntro.intro}</p>
        </div>

        <ul className="cases-grid mt-10 grid gap-5 md:grid-cols-6">
          {caseStudies.map((study, i) => (
            <CaseCard key={study.slug} study={study} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

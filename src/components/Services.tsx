import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { services, servicesIntro } from "../content";
import { Reveal } from "../lib/Reveal";

/**
 * Vier Services — ein Raster, alle vier gleichzeitig sichtbar.
 *
 * Vorher: ein bildschirmhohes Karussell (100svh), das alle acht Sekunden
 * weiterlief. Wer "Websites" lesen wollte, wartete 24 Sekunden oder wischte
 * dreimal. Auf jeder Karte standen zwei Zeilen — Titel und Versprechen —,
 * während `detail` und die vier `bullets` aus src/content.ts gar nicht
 * gerendert wurden: sechzehn konkrete Leistungspunkte, die es im Text gab
 * und die niemand je zu sehen bekam.
 *
 * Und jede Karte lag über einem Marken-Video. Die vier Dateien wiegen
 * zusammen **26,4 MB** und wurden alle vier geladen, weil sie in derselben
 * Scroll-Spur 800 px voneinander entfernt liegen. Vier gleichzeitig
 * laufende Endlosschleifen sind außerdem Unruhe, kein Premium-Gefühl.
 *
 * Jetzt: vier Karten (2 × 2 ab md, gestapelt auf dem Telefon), jede mit
 * Marken-Kachel, Versprechen, Beschreibung, den vier Leistungspunkten und
 * ihrem eigenen Knopf. Kein Selbstlauf, keine Punkte-Leiste, keine
 * Videodatei — die Symbole sind Vektoren im HTML und wiegen nichts.
 * Der Abschnitt hebt sich vom hellen Kurzprofil darüber durch die
 * halbstufig dunklere Fläche ab, nicht mehr durch Bewegung.
 */

const ICONS: Record<string, ReactNode> = {
  // Lupe mit steigenden Balken — Suche, die nach oben zeigt.
  seo: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.4 15.4L21 21" />
      <path d="M8 12v-1.5M10.5 12V9M13 12V7.5" />
    </>
  ),
  // Zeiger mit Klick-Funken — bezahlte Klicks.
  "google-ads": (
    <>
      <path d="M6 4.5l11.5 6.2-4.9 1.4-1.9 4.8L6 4.5z" />
      <path d="M15.5 15.5L20 20" />
      <path d="M18.5 5.5l1.8-1.8M20.5 10h2.2M14.5 2.2V4.4" />
    </>
  ),
  // Sprechblase mit Herz — Inhalte, die Zuspruch bekommen.
  social: (
    <>
      <path d="M20.5 12.2c0 4.1-3.8 7.4-8.5 7.4-1 0-2-.15-2.9-.42L4 21l1.5-3.6C4.1 16.06 3.5 14.2 3.5 12.2c0-4.1 3.8-7.4 8.5-7.4s8.5 3.3 8.5 7.4z" />
      <path d="M12 15.1l-2.4-2.3a1.6 1.6 0 012.4-2.1 1.6 1.6 0 012.4 2.1L12 15.1z" />
    </>
  ),
  // Browserfenster — die Website selbst.
  websites: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9.2h18" />
      <path d="M6.2 6.9h.01M8.9 6.9h.01M11.6 6.9h.01" />
    </>
  ),
};

export function Services() {
  return (
    <section
      id="services"
      data-surface="light"
      className="surface-light-2 py-20 sm:py-24 md:py-28"
      aria-labelledby="services-title"
    >
      <div className="container-v3">
        <div className="mx-auto max-w-[30ch] text-center lg:mx-0 lg:text-left">
          <Reveal>
            <p className="eyebrow text-ink-muted">{servicesIntro.eyebrow}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              id="services-title"
              className="mt-3 balance text-ink"
              style={{
                fontSize: "clamp(24px, 2.6vw, 38px)",
                lineHeight: "1.04",
                letterSpacing: "-0.034em",
                fontWeight: 700,
              }}
            >
              {servicesIntro.headlineMain}
            </h2>
          </Reveal>
          {/* Die Unterzeile stand bis 25.08.2026 INNERHALB der H2. Die
              Überschrift endete damit auf "…Unternehmenswachstum." statt auf
              "…für Sie tun?" — für jede Prüfung, die Überschriften auf ein
              Fragezeichen liest (Blueprint LB1.4), war die Frage keine.
              Wortlaut unverändert, nur der Knoten ist ein anderer. */}
          <Reveal delay={0.1}>
            <p
              className="mt-2 balance text-ink/55"
              style={{ fontSize: "clamp(15px, 1.6vw, 23.5px)", lineHeight: 1.25, fontWeight: 700, letterSpacing: "-0.02em" }}
            >
              {servicesIntro.headlineSub}
            </p>
          </Reveal>
        </div>

        <div className="mt-9 grid gap-4 sm:mt-11 sm:gap-5 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.key} delay={0.06 * i} className="h-full">
              <article className="group flex h-full flex-col rounded-[24px] bg-white p-7 shadow-card ring-1 ring-ink/[0.06] transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-[18px] text-white"
                    style={{
                      background: "linear-gradient(135deg, #D332FF 0%, #9A2FC6 100%)",
                      boxShadow: "0 14px 28px -14px rgba(154,47,198,0.85)",
                    }}
                  >
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      {ICONS[service.key]}
                    </svg>
                  </span>
                  <span className="pt-1 text-[12px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                    {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                  </span>
                </div>

                <p className="mt-5 eyebrow text-ink-muted">{service.title}</p>
                <h3
                  className="mt-2 balance text-ink"
                  style={{
                    fontSize: "clamp(20px, 1.8vw, 26px)",
                    lineHeight: "1.08",
                    letterSpacing: "-0.03em",
                    fontWeight: 700,
                  }}
                >
                  {service.promise}
                </h3>
                <p
                  className="mt-3 text-ink-muted"
                  style={{ fontSize: "clamp(15px, 1.05vw, 16.5px)", lineHeight: 1.5 }}
                >
                  {service.detail}
                </p>

                {/* Die vier Punkte standen schon immer im Text und wurden nie
                    gezeigt. Sie sind das, was die Karte überhaupt konkret
                    macht — ohne sie ist sie ein Versprechen ohne Inhalt. */}
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {service.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-2 text-ink-soft"
                      style={{ fontSize: "14.5px", lineHeight: 1.4 }}
                    >
                      <Check />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* mt-auto: die vier Knöpfe stehen auf einer Linie, auch wenn
                    die Texte darüber unterschiedlich lang sind. */}
                <div className="mt-auto pt-7">
                  <Link
                    to={service.to}
                    className="btn btn-primary inline-flex items-center gap-2 rounded-pill px-6 py-3 text-[15px] font-semibold"
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
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[3px] shrink-0 text-dm-violet-deep"
      aria-hidden
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

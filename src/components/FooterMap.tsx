import { useEffect, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import { business } from "../content";

/**
 * Die Karte in der Fußzeile.
 *
 * Zwei Zustände, ein Klick dazwischen:
 *
 *   1. Sichtbar von Anfang an ist eine echte Karte des Standorts — ein
 *      Standbild aus OpenStreetMap-Kacheln, das auf UNSEREM Server liegt.
 *      Es entsteht dabei keine Verbindung zu einem fremden Server.
 *   2. Nach einem Klick auf „Google Maps laden“ steht an derselben Stelle
 *      die echte, bedienbare Google-Karte.
 *
 * Warum nicht sofort Google: Eine eingebettete Google-Karte lädt Skripte
 * von Google, überträgt die IP-Adresse der Besucherin in die USA und legt
 * Informationen auf ihrem Gerät ab. Das ist nach § 25 Abs. 1 TDDDG
 * einwilligungspflichtig — ein berechtigtes Interesse reicht dafür nicht.
 * Ohne diesen Klick stünde außerdem in der Datenschutzerklärung eine
 * falsche Aussage („keine Cookies, kein Banner“), und genau das ist der
 * Punkt, an dem eine Abmahnung ansetzt. Der Klick IST die Einwilligung.
 *
 * Wer diese Abwägung anders trifft, setzt MAP_LOADS_WITHOUT_CLICK auf
 * true — dann steht die Google-Karte sofort da. Dann muss aber Abschnitt 7
 * der Datenschutzerklärung mitgeändert werden, sonst beschreibt sie eine
 * Seite, die es nicht mehr gibt.
 *
 * Die Namensnennung von OpenStreetMap unten rechts ist keine Höflichkeit,
 * sondern die Bedingung der ODbL-Lizenz. Sie darf nicht weg.
 */

/** Sofort laden, ohne Einwilligung? Siehe Begründung oben. */
const MAP_LOADS_WITHOUT_CLICK = false;

/** Merkt die Entscheidung für die Dauer des Besuchs — sonst müsste man sie auf jeder Seite neu treffen. */
const CONSENT_KEY = "dm-maps";

/* Von Google selbst ausgegebene Einbett-Adresse für diese Anschrift.
   Kein API-Schlüssel nötig, keine Abrechnung, kein Wasserzeichen. */
const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m3!2m1!1sKolonnenstra%C3%9Fe+8%2C+10827+Berlin!6i16";

/** Routenplanung — öffnet Google Maps in einem neuen Tab, also erst auf Wunsch. */
const ROUTE_HREF =
  "https://www.google.com/maps/dir/?api=1&destination=Kolonnenstra%C3%9Fe+8%2C+10827+Berlin";

export function FooterMap() {
  const [live, setLive] = useState(MAP_LOADS_WITHOUT_CLICK);

  useEffect(() => {
    if (MAP_LOADS_WITHOUT_CLICK) return;
    try {
      if (window.sessionStorage.getItem(CONSENT_KEY) === "1") setLive(true);
    } catch {
      /* Speicher gesperrt: dann eben bei jedem Seitenaufruf ein Klick. */
    }
  }, []);

  function loadMap() {
    setLive(true);
    try {
      window.sessionStorage.setItem(CONSENT_KEY, "1");
    } catch {
      /* siehe oben */
    }
  }

  return (
    <section aria-labelledby="footer-map-heading" className="mt-12">
      <div className="grid overflow-hidden rounded-card border border-white/15 bg-white text-ink lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex flex-col justify-center gap-3 p-6 text-center lg:text-left">
          <p id="footer-map-heading" className="small font-semibold">
            So finden Sie uns
          </p>
          <p className="text-[18px] font-bold leading-snug">
            {business.address.line1}
            <br />
            {business.address.line2}
          </p>
          <a
            href={ROUTE_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="link-arrow justify-center text-[16px] lg:justify-start"
          >
            Route planen <ArrowUpRight size={16} aria-hidden />
          </a>
        </div>

        <div className="relative min-h-[220px] bg-surface-2 sm:min-h-[260px]">
          {live ? (
            <iframe
              src={EMBED_SRC}
              title={`Karte: ${business.addressLine}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <>
              <picture className="contents">
                <source
                  type="image/webp"
                  sizes="(min-width: 1024px) 900px, 100vw"
                  srcSet={`${import.meta.env.BASE_URL}brand/karte-kolonnenstrasse-8-800.webp 800w, ${import.meta.env.BASE_URL}brand/karte-kolonnenstrasse-8-1600.webp 1600w`}
                />
                <img
                  src={`${import.meta.env.BASE_URL}brand/karte-kolonnenstrasse-8.jpg`}
                  srcSet={`${import.meta.env.BASE_URL}brand/karte-kolonnenstrasse-8-800.jpg 800w, ${import.meta.env.BASE_URL}brand/karte-kolonnenstrasse-8.jpg 1600w`}
                  sizes="(min-width: 1024px) 900px, 100vw"
                  alt={`Kartenausschnitt mit dem Standort ${business.addressLine}`}
                  width="1600"
                  height="600"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>

              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-full items-center justify-center rounded-full bg-accent text-white ring-4 ring-white"
              >
                <MapPin size={17} strokeWidth={2.4} />
              </span>

              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-white/90 p-4 text-center sm:flex-row sm:justify-between sm:text-left">
                <p className="small max-w-[46ch]">
                  Erst dann wird eine Verbindung zu Google hergestellt und Ihre IP-Adresse übertragen.
                  <span className="block text-[14px]">Kartenausschnitt © OpenStreetMap-Mitwirkende</span>
                </p>
                <button type="button" onClick={loadMap} className="btn btn-secondary btn-inline min-h-[44px] px-4 text-[15px]">
                  Google Maps laden
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

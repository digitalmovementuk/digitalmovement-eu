import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";

/* Schriften liegen im eigenen Bundle, nicht bei Google.
   Ein <link> auf fonts.googleapis.com überträgt die IP-Adresse jedes
   Besuchers in die USA — ohne Einwilligung ist das nach LG München I,
   3 O 17493/20 ein Verstoß gegen die DSGVO und abmahnfähig. Selbst
   gehostet stellt sich die Frage gar nicht erst.

   Manrope trägt die Seite, Jost und Inter den Hero (siehe
   src/styles/hero-success.css). Von Inter werden nur die tatsächlich
   benutzten Schnitte geladen, nicht die ganze Familie. */
import "@fontsource-variable/manrope";
import "@fontsource-variable/jost";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";

import "./index.css";

/**
 * GA4, loaded only when VITE_GA4_ID is set, and only in the browser — the
 * pre-render pass must not try to load a tag. Key events are sent from
 * src/lib/submitLead.ts on a genuine send, never on form submit, so a
 * failed delivery can't be counted as a conversion.
 *
 * `gtag` must go on `window`, and must push the `arguments` object rather
 * than an array. This is the shape gtag.js actually reads: pushing a plain
 * object like `{ event: "generate_lead" }` is Tag Manager's convention and
 * gtag.js ignores it silently — the event simply never arrives, and the
 * property reports zero key events while looking correctly installed.
 */
const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
if (typeof window !== "undefined" && GA4_ID) {
  const w = window as unknown as {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.gtag = function gtag() {
    w.dataLayer.push(arguments);
  };
  /* Consent Mode v2, gesetzt VOR dem config-Aufruf, damit die Vorgaben schon
     für den allerersten Treffer gelten.

     Diese Seite richtet sich an ein deutsches Publikum. § 25 TDDDG verlangt
     eine Einwilligung, bevor irgendetwas auf dem Endgerät gespeichert oder
     ausgelesen wird — für Analyse-Cookies genauso wie für Werbe-Cookies.
     Solange es auf dieser Seite kein Einwilligungsbanner gibt, steht hier
     deshalb alles auf "denied". GA4 sendet dann nur cookielose Pings, legt
     nichts auf dem Gerät ab und ordnet niemanden zu.

     Das ist bewusst so und kein Versehen: lieber weniger Messung als eine
     Messung, die ohne Einwilligung läuft.

     Kommt ein Banner dazu (Hausstandard: Real Cookie Banner, nichts extern
     Gehostetes), muss es diese Werte per gtag("consent","update",…) auf
     "granted" setzen — nicht diese Zeilen hier ändern. */
  w.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  w.gtag("js", new Date());
  w.gtag("config", GA4_ID, { anonymize_ip: true });
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);
}

// vite-react-ssg owns the router: at build time it walks `routes`, renders
// each static path to its own HTML file, and on the client it hydrates the
// same tree. There is deliberately no BrowserRouter here — creating one
// would give the client a second, conflicting router.
/**
 * `basename` must track Vite's base, not be hardcoded to "/".
 *
 * Die öffentliche Seite liegt auf der Domain-Wurzel, base ist also "/" und
 * die Zeile tut nichts. Eine Vorschau auf einem GitHub-Projektpfad
 * (/irgendwas/) ist der Fall, für den sie da ist: Das vorgerenderte HTML
 * stimmt dort, aber der React-Router kennt das Präfix nicht, findet keine
 * passende Route und landet auf "*" — die Seite sieht richtig aus und wird
 * beim Hydrieren zur 404. Aus BASE_URL abgeleitet stimmen beide Fälle.
 */
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export const createRoot = ViteReactSSG({ routes, basename: basename || undefined });

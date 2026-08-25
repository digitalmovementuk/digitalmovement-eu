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
 * GA4 — aber nicht hier.
 *
 * Das Tag wird NICHT beim Seitenaufruf geladen. § 25 TDDDG verlangt eine
 * Einwilligung, bevor etwas auf dem Endgerät gespeichert oder ausgelesen
 * wird; die deutschen Aufsichtsbehörden halten Google Analytics ohne
 * Einwilligung für unzulässig. Der Ladevorgang steckt deshalb in
 * src/lib/analytics.ts und wird vom Banner ausgelöst
 * (src/components/CookieBanner.tsx).
 *
 * Der Aufruf unten schaltet die Messung nur dann sofort ein, wenn eine
 * frühere Einwilligung im Speicher liegt — dann soll der erste Treffer nicht
 * erst warten, bis React fertig gerendert hat.
 *
 * Schlüsselereignisse gehen aus src/lib/submitLead.ts raus, erst bei
 * tatsächlichem Versand, nie beim Absenden des Formulars — eine
 * fehlgeschlagene Zustellung darf nicht als Anfrage gezählt werden. Dort
 * muss `gtag` das `arguments`-Objekt schieben, nicht ein Array oder ein
 * schlichtes `{ event: … }`: Letzteres ist die Schreibweise von Tag Manager,
 * gtag.js überliest sie stillschweigend, und die Property meldet null
 * Schlüsselereignisse, während alles richtig eingebaut aussieht.
 */
import { initAnalyticsFromStoredConsent } from "./lib/analytics";

initAnalyticsFromStoredConsent();

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

import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";

/* Schrift selbst ausgeliefert, nicht von Google:
   Ein <link> auf fonts.googleapis.com überträgt die IP-Adresse jedes
   Besuchers in die USA — ohne Einwilligung ist das nach LG München I,
   3 O 17493/20 ein Verstoß gegen die DSGVO und abmahnfähig. Selbst
   gehostet stellt sich die Frage gar nicht erst.
   Seit dem Design-Audit vom 04.09.2026 trägt EINE Schrift die ganze
   Seite: Manrope (variabel). Jost, Inter und die drei lokalen
   Hero-Schriften sind entfernt. */
import "@fontsource-variable/manrope";
import "./index.css";
import { initAnalyticsFromStoredConsent } from "./lib/analytics";

initAnalyticsFromStoredConsent();

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export const createRoot = ViteReactSSG({ routes, basename: basename || undefined });

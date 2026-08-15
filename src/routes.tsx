import type { RouteRecord } from "vite-react-ssg";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";

/**
 * Routentabelle für vite-react-ssg.
 *
 * Jeder Pfad ohne ":" oder "*" wird beim Build zu einer eigenen HTML-Datei
 * vorgerendert. Genau das lässt GitHub Pages eine echte 200 ausliefern,
 * statt auf 404.html durchzufallen. Ein Eintrag hier genügt, damit die
 * Seite im Build, in der Sitemap (scripts/postbuild.mjs liest die
 * erzeugten Dateien) und im Deploy auftaucht.
 *
 * "404" ist eine echte vorgerenderte Route, damit der Build eine richtige
 * Fehlerseite erzeugt; postbuild verschiebt sie nach dist/404.html — die
 * Datei, die GitHub Pages für unbekannte Pfade ausliefert. Die "*"-Route
 * hält denselben Fall im Browser-Routing am Leben.
 *
 * Die Startseite ist die einzige Inhaltsseite. Die beiden Rechtsseiten
 * sind Pflicht (§ 5 DDG, Art. 13 DSGVO) und deshalb indexierbar: eine
 * auffindbare Erklärung ist der Sinn der Sache.
 */
export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/components/Layout.tsx",
    children: [
      {
        index: true,
        element: <HomePage />,
        entry: "src/pages/HomePage.tsx",
      },
      {
        path: "impressum",
        lazy: () => import("./pages/Impressum").then((m) => ({ Component: m.Impressum })),
      },
      {
        path: "datenschutz",
        lazy: () => import("./pages/Datenschutz").then((m) => ({ Component: m.Datenschutz })),
      },
      {
        path: "404",
        lazy: () => import("./pages/NotFound").then((m) => ({ Component: m.NotFound })),
      },
      {
        path: "*",
        lazy: () => import("./pages/NotFound").then((m) => ({ Component: m.NotFound })),
      },
    ],
  },
];

import { lazy, Suspense, type ComponentType } from "react";
import { Hero } from "../components/Hero";
import { AgencySnapshot } from "../components/AgencySnapshot";
import { Seo } from "../seo";

/**
 * Reihenfolge der Startseite, wie im freigegebenen Dokument:
 *
 *   Hero → Snapshot → Leistungen → Prozess → Zahlen → Kundenprojekte
 *   → Vergleich → Stimmen → Gründer-Notiz → Kontakt
 *
 * Alles unterhalb des ersten Bildschirms wird nachgeladen. Der erste
 * Aufbau braucht nur Hero und Snapshot; der Rest kommt in einem zweiten
 * Paket, damit er auf dem Handy nicht den ersten sichtbaren Inhalt
 * blockiert.
 */
const ServicesCarousel = lazy(() =>
  import("../components/ServicesCarousel").then((m) => ({ default: m.ServicesCarousel })),
);
const ProcessTimeline = lazy(() =>
  import("../components/ProcessTimeline").then((m) => ({ default: m.ProcessTimeline })),
);
const Metrics = lazy(() => import("../components/Metrics").then((m) => ({ default: m.Metrics })));
const ClientCases = lazy(() =>
  import("../components/ClientCases").then((m) => ({ default: m.ClientCases })),
);
const Comparison = lazy(() =>
  import("../components/Comparison").then((m) => ({ default: m.Comparison })),
);
const Reviews = lazy(() => import("../components/Reviews").then((m) => ({ default: m.Reviews })));
const FounderNote = lazy(() =>
  import("../components/FounderNote").then((m) => ({ default: m.FounderNote })),
);
const Contact = lazy(() => import("../components/Contact").then((m) => ({ default: m.Contact })));

function SectionFallback() {
  return <div className="min-h-[40vh] surface-light" aria-hidden />;
}

function defer(Component: ComponentType) {
  return (
    <Suspense fallback={<SectionFallback />}>
      <Component />
    </Suspense>
  );
}

export function HomePage() {
  return (
    <>
      <Seo
        title="Digital Movement | SEO, GEO & High-End Websites"
        description="Mehr Neukunden über Google und KI-Suche. SEO, GEO und High-End Websites für Inhaber und Mittelstand. Kostenloses Erstgespräch, Antwort innerhalb 2 Stunden."
        path="/"
        /* ORGANIZATION, WEBSITE, LOCAL_BUSINESS und der WebPage-Knoten
           dieser Route kommen automatisch aus <Seo> — siehe src/seo.tsx.
           Hier noch einmal übergeben hieße, jede @id im @graph zu
           verdoppeln. */
      />
      <Hero />
      <AgencySnapshot />
      {defer(ServicesCarousel)}
      {defer(ProcessTimeline)}
      {defer(Metrics)}
      {defer(ClientCases)}
      {defer(Comparison)}
      {defer(Reviews)}
      {defer(FounderNote)}
      {defer(Contact)}
    </>
  );
}

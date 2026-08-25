import { lazy, Suspense, type ComponentType } from "react";
import { Hero } from "../components/Hero";
import { AnswerBlock } from "../components/AnswerBlock";
import { TrustBar } from "../components/TrustBar";
import { Seo, faqSchema } from "../seo";
import { faqs } from "../content";

/**
 * Reihenfolge der Startseite nach dem Landing-Page-Blueprint v1.1
 * (Operations/Web Project Operating Process/landing-page-blueprint.md).
 *
 * Die elf Bausteine des Blueprints in dieser Seite:
 *
 *   1+2+3  Überschrift, Unterzeile, Absender ...... Hero (unverändert)
 *   3+4    Absenderzeile + Antwortblock ........... AnswerBlock
 *   5      Vertrauensleiste ....................... TrustBar
 *   6      Problem ................................ Problem
 *   7      Lösung mit EINEM nächsten Schritt ...... Snapshot → Leistungen
 *                                                   → Prozess → NextStep
 *   8      Beleg .................................. Zahlen → Kundenprojekte
 *                                                   → Stimmen
 *   9      Vergleichstabelle ...................... Comparison
 *   10     Abschluss mit Handlungsaufruf .......... Gründer-Notiz → FAQ
 *                                                   → Kontakt
 *   11     Sichtbares Datum der letzten Prüfung ... LastUpdated
 *
 * Zwei Abweichungen, beide bewusst:
 *
 *  - Der Hero bleibt, wie er ist. Ausdrückliche Anweisung ("except hero"),
 *    und er folgt bereits der Hausregel 2/3-Viewport mit Zwei-Säulen-Formular.
 *  - Die acht freigegebenen Abschnittsüberschriften bleiben Aussagesätze
 *    statt Fragen. Der Blueprint verlangt Fragen, seine eigene
 *    Konflikttabelle stellt aber freigegebenen Kundentext darüber, und der
 *    Text dieser Seite ist auf das RMU-Dokument gesperrt. Nur die neu
 *    gebauten Blöcke tragen Frageüberschriften.
 *
 * Alles unterhalb des ersten Bildschirms wird nachgeladen. Der erste
 * Aufbau braucht nur Hero, Antwortblock und Vertrauensleiste; der Rest
 * kommt in einem zweiten Paket, damit er auf dem Handy nicht den ersten
 * sichtbaren Inhalt blockiert.
 */
const Problem = lazy(() =>
  import("../components/Problem").then((m) => ({ default: m.Problem })),
);
const AgencySnapshot = lazy(() =>
  import("../components/AgencySnapshot").then((m) => ({ default: m.AgencySnapshot })),
);
const Services = lazy(() =>
  import("../components/Services").then((m) => ({ default: m.Services })),
);
const ProcessTimeline = lazy(() =>
  import("../components/ProcessTimeline").then((m) => ({ default: m.ProcessTimeline })),
);
const NextStep = lazy(() =>
  import("../components/NextStep").then((m) => ({ default: m.NextStep })),
);
const Metrics = lazy(() => import("../components/Metrics").then((m) => ({ default: m.Metrics })));
const ClientCases = lazy(() =>
  import("../components/ClientCases").then((m) => ({ default: m.ClientCases })),
);
const Reviews = lazy(() => import("../components/Reviews").then((m) => ({ default: m.Reviews })));
const Comparison = lazy(() =>
  import("../components/Comparison").then((m) => ({ default: m.Comparison })),
);
const FounderNote = lazy(() =>
  import("../components/FounderNote").then((m) => ({ default: m.FounderNote })),
);
const Faq = lazy(() => import("../components/Faq").then((m) => ({ default: m.Faq })));
const Contact = lazy(() => import("../components/Contact").then((m) => ({ default: m.Contact })));
const LastUpdated = lazy(() =>
  import("../components/LastUpdated").then((m) => ({ default: m.LastUpdated })),
);

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
           verdoppeln.

           Der FAQPage-Knoten steht hier erst, seit <Faq /> die sechs
           Fragen aus content.faqs auch wirklich anzeigt. Beides speist
           sich aus derselben Konstante, damit Auszeichnung und sichtbarer
           Text nicht auseinanderlaufen können. */
        schema={[faqSchema(faqs)]}
        /* Die Startseite trägt eine sichtbare Verfasserzeile im
           Antwortblock — Name, Bild, Rolle, Link auf die Notiz des
           Gründers. `author` zeichnet genau diese Person aus. Impressum
           und Datenschutz tragen sie nicht und bekommen sie deshalb
           auch nicht. */
        author
      />
      <Hero />
      <AnswerBlock />
      <TrustBar />
      {defer(Problem)}
      {defer(AgencySnapshot)}
      {defer(Services)}
      {defer(ProcessTimeline)}
      {defer(NextStep)}
      {defer(Metrics)}
      {defer(ClientCases)}
      {defer(Reviews)}
      {defer(Comparison)}
      {defer(FounderNote)}
      {defer(Faq)}
      {defer(Contact)}
      {defer(LastUpdated)}
    </>
  );
}

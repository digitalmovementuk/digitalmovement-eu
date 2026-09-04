import { Seo, faqSchema } from "../seo";
import { faqs } from "../content";
import { Hero } from "../components/Hero";
import { AnswerBlock } from "../components/AnswerBlock";
import { TrustBar } from "../components/TrustBar";
import { Problem } from "../components/Problem";
import { AgencySnapshot } from "../components/AgencySnapshot";
import { Services } from "../components/Services";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { ClientCases } from "../components/ClientCases";
import { Reviews } from "../components/Reviews";
import { Comparison } from "../components/Comparison";
import { FounderNote } from "../components/FounderNote";
import { Faq } from "../components/Faq";
import { Contact } from "../components/Contact";
import { LastUpdated } from "../components/LastUpdated";

/* Alle Abschnitte werden fest eingebunden (kein lazy/Suspense mehr):
   die leeren 40-vh-Bänder auf dem Telefon kamen aus den Platzhaltern.
   Reihenfolge nach dem 14-teiligen Landing-Page-Blueprint; „Nächster
   Schritt" und „Zahlen" sind in Snapshot bzw. Formular aufgegangen
   (Design-Audit 04.09.2026, E-5). */
export function HomePage() {
  return (
    <>
      <Seo
        title="Digital Movement | SEO, GEO & High-End Websites"
        description="Mehr Neukunden über Google und KI-Suche. SEO, GEO und High-End Websites für Inhaber und Mittelstand. Kostenloses Erstgespräch, Antwort innerhalb 2 Stunden."
        path="/"
        schema={[faqSchema(faqs)]}
        author
      />
      <Hero />
      <AnswerBlock />
      <TrustBar />
      <Problem />
      <AgencySnapshot />
      <Services />
      <ProcessTimeline />
      <ClientCases />
      <Reviews />
      <Comparison />
      <FounderNote />
      <Faq />
      <Contact />
      <LastUpdated />
    </>
  );
}

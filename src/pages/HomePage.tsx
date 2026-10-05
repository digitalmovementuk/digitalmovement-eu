import { Hero } from "../components/Hero";
import { AnswerBlock } from "../components/AnswerBlock";
import { Seo, faqSchema } from "../seo";
import { faqs } from "../content";

/** Render all homepage content into the delivered HTML, including without JavaScript. */
import { Problem } from "../components/Problem";
import { AgencySnapshot } from "../components/AgencySnapshot";
import { Services } from "../components/Services";
import { ProcessTimeline } from "../components/ProcessTimeline";
import { NextStep } from "../components/NextStep";
import { Metrics } from "../components/Metrics";
import { ClientCases } from "../components/ClientCases";
import { Reviews } from "../components/Reviews";
import { Comparison } from "../components/Comparison";
import { FounderNote } from "../components/FounderNote";
import { Faq } from "../components/Faq";
import { Contact } from "../components/Contact";
import { LastUpdated } from "../components/LastUpdated";


export function HomePage() {
  return (
    <>
      <Seo
        title="SEO-Agentur Berlin für Google & KI-Suche | Digital Movement"
        description="SEO-Agentur in Berlin: Wir verbinden SEO, KI-Suche und verständliche Websites. Erfahren Sie, wo Ihre Website Potenzial hat. Jetzt kostenlose Analyse anfragen."
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
        author

      />
      <Hero />
      <AnswerBlock />
      <Problem />
      <AgencySnapshot />
      <Services />
      <ProcessTimeline />
      <NextStep />
      <Metrics />
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

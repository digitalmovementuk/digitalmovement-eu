import { ChevronDown } from "lucide-react";
import { faqIntro, faqs } from "../content";

/* Aufklappliste statt zweispaltiger Vollansicht (Polierlauf 04.09.2026):
   die Antworten stehen weiter im HTML, nur zusammengeklappt — 1.849 px auf
   dem Telefon wurden zu einer Liste, die man überblickt. Die erste Frage
   ist geöffnet, damit die Liste nicht wie ein Menü wirkt. `name` lässt in
   neuen Browsern nur eine Antwort zugleich offen. */
export function Faq() {
  return (
    <section id="faq" data-surface="light" className="surface-light section">
      <div className="container-v3">
        <div className="section-head" data-reveal>
          <p className="eyebrow">{faqIntro.eyebrow}</p>
          <h2 className="h2">{faqIntro.headline}</h2>
        </div>

        <div className="faq mx-auto mt-8 max-w-[860px]" data-reveal>
          {faqs.map((f, i) => (
            <details key={f.q} name="faq" open={i === 0}>
              <summary>
                <h3 className="h3">{f.q}</h3>
                <ChevronDown size={22} className="faq-chev" aria-hidden />
              </summary>
              <p className="copy faq-a">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

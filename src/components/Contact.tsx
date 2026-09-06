import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { contact, hero } from "../content";
import { LeadForm } from "./LeadForm";

const ICONS = {
  Telefon: Phone,
  WhatsApp: MessageCircle,
  "E-Mail": Mail,
  Adresse: MapPin,
} as const;

const CAPTIONS: Record<string, string> = {
  Telefon: "Werktags, direkt beim Gründer",
  WhatsApp: "Kurze Frage? Einfach schreiben",
  "E-Mail": "Antwort innerhalb 2 Stunden",
  Adresse: "Berlin-Schöneberg",
};

export function Contact() {
  return (
    <section id="contact" data-surface="light" className="surface-light-2 section">
      <div className="container-v3 grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <div className="section-head" data-reveal>
            <p className="eyebrow">{contact.eyebrow}</p>
            <h2 className="h2">
              {contact.headlinePre} <span className="text-accent">{contact.headlineSoft}</span>
            </h2>
            <p className="lead">{contact.intro}</p>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2" data-reveal-group>
            {contact.tiles.map((t) => {
              const Icon = ICONS[t.kicker as keyof typeof ICONS] ?? Mail;
              const inner = (
                <>
                  <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-surface-2 text-ink">
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="min-w-0 leading-snug">
                    <span className="small block font-semibold">{t.kicker}</span>
                    <span className="block break-words text-[17px] font-bold">{t.value}</span>
                    <span className="small block">{CAPTIONS[t.kicker]}</span>
                  </span>
                </>
              );
              const cls = "card card-lift flex items-start gap-4 p-5";
              return (
                <li key={t.kicker} data-reveal>
                  {t.href.startsWith("/") ? (
                    <Link to={t.href} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <a
                      href={t.href}
                      className={cls}
                      {...(t.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {inner}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative" data-reveal>
          <LeadForm
            idPrefix="c"
            formId="contact-form"
            source="contact-section"
            title={hero.formTitle}
            intro={hero.formIntro}
          />
        </div>
      </div>
    </section>
  );
}

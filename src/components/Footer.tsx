import { Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { openConsentDialog } from "./CookieBanner";
import { business, footer } from "../content";
import { FooterMap } from "./FooterMap";
import { ADDRESS_LINE, VAT_ID } from "../seo";

const BASE = import.meta.env.BASE_URL;

/* Die EINE dunkle Fläche der Seite (Design-Audit 04.09.2026). Vorher
   wechselte die Seite fünfmal zwischen Hell und Dunkel; jetzt ist der
   Fuß der einzige dunkle Block — mit dem Original-Logo in Weiß. */
export function Footer() {
  const [leistungen, agentur] = footer.sections;
  const linkCls = "text-[16px] text-white/75 hover:text-white";

  return (
    <footer data-surface="dark" className="surface-dark pt-14 pb-8 md:pt-20">
      <div className="container-v3">
        <div className="grid gap-10 border-b border-white/15 pb-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="text-center md:text-left">
            <img
              src={`${BASE}brand/logo-color-negative.svg`}
              alt={business.name}
              width={168}
              height={36}
              className="mx-auto h-9 w-auto md:mx-0"
              loading="lazy"
              decoding="async"
            />
            <p className="mt-5 max-w-[42ch] text-[16px] leading-relaxed text-white/75">{footer.blurb}</p>
            <Link to="/#contact" className="btn btn-on-dark btn-inline mt-6 min-h-[46px] px-5 text-[16px]">
              Kostenloses Erstgespräch
            </Link>
          </div>

          <Column heading={leistungen.title}>
            {leistungen.links.map((l) => (
              <li key={l.label}>
                <a href={l.href.startsWith("#") ? `/${l.href}` : l.href} className={linkCls}>
                  {l.label}
                </a>
              </li>
            ))}
          </Column>

          <Column heading={agentur.title}>
            {agentur.links.map((l) => (
              <li key={l.label}>
                <a href={l.href.startsWith("#") ? `/${l.href}` : l.href} className={linkCls}>
                  {l.label}
                </a>
              </li>
            ))}
          </Column>

          <Column heading="Kontakt">
            <li>
              <a href={business.phoneHref} className={`${linkCls} inline-flex items-center gap-2`}>
                <Phone size={16} aria-hidden />
                {business.phone}
              </a>
            </li>
            <li>
              <a
                href={business.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkCls} inline-flex items-center gap-2`}
              >
                <MessageCircle size={16} aria-hidden />
                {business.whatsapp}
              </a>
            </li>
            <li>
              <a href={business.emailHref} className={`${linkCls} inline-flex items-center gap-2 break-all`}>
                <Mail size={16} aria-hidden />
                {business.email}
              </a>
            </li>
          </Column>
        </div>

        <FooterMap />

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/15 pt-6 text-center text-[14px] text-white/65 sm:flex-row sm:items-start sm:justify-between sm:text-left">
          <div className="space-y-1">
            <p>{footer.rights}</p>
            {VAT_ID ? <p>USt-IdNr. {VAT_ID}</p> : null}
            <p>{ADDRESS_LINE}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:justify-end">
            {footer.legal.map((l) => (
              <Link key={l.href} to={l.href} className="hover:text-white">
                {l.label}
              </Link>
            ))}
            <button type="button" onClick={openConsentDialog} className="underline underline-offset-2 hover:text-white">
              Cookie-Einstellungen
            </button>
            <span>Berlin, Deutschland</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Column({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="text-center md:text-left">
      <p className="text-[14px] font-bold uppercase tracking-[0.06em] text-white/55">{heading}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

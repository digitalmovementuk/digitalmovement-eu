import { Mail, Phone, MessageCircle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { business, footer } from "../content";
import { ADDRESS_LINE, VAT_ID } from "../seo";

/**
 * Fußzeile.
 *
 * Die Struktur kommt aus dem freigegebenen Dokument: Leistungen, Agentur,
 * Kontakt — mehr Spalten gibt es nicht, weil es mehr Seiten nicht gibt.
 * Ein Link auf eine Seite, die es nicht gibt, ist schlimmer als eine
 * kurze Fußzeile.
 *
 * Firmierung und Anschrift stehen unten auf jeder Seite und nicht nur im
 * Impressum: Wer hinter der Seite steht, soll von jeder Seite aus
 * erkennbar sein. Dieselbe Anschrift markiert seo.tsx als `address` —
 * erlaubt ist das nur, weil die Seite sie auch zeigt. Ändert sich diese
 * Zeile, muss POSTAL_ADDRESS in src/seo.tsx mitgeändert werden.
 */
export function Footer() {
  const [leistungen, agentur] = footer.sections;

  return (
    <footer data-surface="light" className="bg-surface-2 text-ink pt-16 sm:pt-20 md:pt-24 pb-10">
      <div className="container-v3">
        {/* Kopfzeile: Marke + Absprung ins Formular */}
        <div className="flex flex-col items-center lg:items-end lg:flex-row lg:justify-between text-center lg:text-left gap-8 pb-12 sm:pb-16 border-b border-ink/10">
          <div className="max-w-[460px]">
            <img
              src={`${import.meta.env.BASE_URL}brand/logo-color-positive.svg`}
              alt="Digital Movement"
              width="160"
              height="40"
              className="h-8 w-auto mx-auto lg:mx-0"
            />
            <p className="mt-5 text-[14px] sm:text-[15px] text-ink-soft leading-relaxed">
              {footer.blurb}
            </p>
          </div>

          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-ink hover:text-ink-soft transition-colors"
          >
            Kostenloses Erstgespräch <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Spalten */}
        <div className="grid gap-10 sm:gap-12 sm:grid-cols-2 lg:grid-cols-3 pt-12 sm:pt-14 text-center sm:text-left">
          <Column heading={leistungen.title}>
            <ul className="space-y-2.5">
              {leistungen.links.map((l) => (
                <li key={l.label}>
                  <a href={`/${l.href}`} className={linkCls}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </Column>

          <Column heading={agentur.title}>
            <ul className="space-y-2.5">
              {agentur.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith("#") ? (
                    <a href={`/${l.href}`} className={linkCls}>
                      {l.label}
                    </a>
                  ) : (
                    <a href={l.href} className={linkCls}>
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Column>

          <Column heading="Kontakt">
            <ul className="space-y-3 flex flex-col items-center sm:items-start">
              <li>
                <a href={business.phoneHref} className={`${linkCls} inline-flex items-center gap-2`}>
                  <Phone size={13} strokeWidth={2.2} className="text-ink-faint" />
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
                  <MessageCircle size={13} strokeWidth={2.2} className="text-ink-faint" />
                  {business.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={business.emailHref}
                  className={`${linkCls} inline-flex items-center gap-2 break-all`}
                >
                  <Mail size={13} strokeWidth={2.2} className="text-ink-faint" />
                  {business.email}
                </a>
              </li>
            </ul>
          </Column>
        </div>

        {/* Rechtliches */}
        <div className="mt-14 sm:mt-16 pt-6 border-t border-ink/10 flex flex-col items-center sm:flex-row sm:items-start sm:justify-between gap-4 text-[12px] text-ink-muted text-center sm:text-left">
          <div className="space-y-1">
            {/* Wortlaut aus dem freigegebenen Dokument, unverändert — ohne
                Jahreszahl. Der volle Firmenwortlaut samt Inhaber steht im
                Impressum, wo er hingehört; hier stünde er doppelt. */}
            <p>{footer.rights}</p>
            {/* Die USt-IdNr. wird erst gezeigt, wenn sie vorliegt. Ein
                Platzhalter an dieser Stelle wäre eine falsche Angabe. */}
            {VAT_ID ? <p className="text-ink-faint">USt-IdNr. {VAT_ID}</p> : null}
            <p className="text-ink-faint">{ADDRESS_LINE}</p>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-6 gap-y-2">
            {footer.legal.map((l) => (
              <Link key={l.href} to={l.href} className="hover:text-ink">
                {l.label}
              </Link>
            ))}
            <span className="text-ink-faint">·</span>
            <span>Berlin, Deutschland</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const linkCls = "text-[13.5px] text-ink-soft hover:text-ink transition-colors";

function Column({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10.5px] font-bold uppercase tracking-[0.20em] text-ink-muted mb-4">
        {heading}
      </p>
      {children}
    </div>
  );
}

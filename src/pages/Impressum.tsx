import { business } from "../content";
import { Seo, breadcrumbs } from "../seo";

/**
 * Pflichtangaben nach § 5 DDG und § 18 Abs. 2 MStV.
 *
 * Offen: die Umsatzsteuer-Identifikationsnummer. Sie steht bewusst als
 * "wird nachgetragen" auf der Seite und nicht als erfundener Platzhalter —
 * sobald sie vorliegt, wird die Zeile hier ersetzt.
 */
export function Impressum() {
  return (
    <>
      <Seo
        title="Impressum | Digital Movement"
        description="Pflichtangaben nach § 5 DDG und § 18 Abs. 2 MStV für digitalmovement.eu."
        path="/impressum"
        schema={[breadcrumbs([{ name: "Impressum", path: "/impressum" }])]}
      />
    <section data-surface="light" className="surface-light pt-28 pb-20 sm:pt-36 sm:pb-24">
      <div className="container-v3 max-w-[760px]">
        <h1
          className="text-ink"
          style={{
            fontSize: "clamp(32px, 5.4vw, 56px)",
            lineHeight: "1.05",
            letterSpacing: "-0.032em",
            fontWeight: 700,
          }}
        >
          Impressum
        </h1>

        <div className="mt-10 space-y-9 text-[15.5px] leading-relaxed text-ink-soft">
          <Block title="Angaben gemäß § 5 DDG">
            <p className="font-semibold text-ink">{business.legalName}</p>
            <p>Inhaber: Raoul Müller</p>
            <p>{business.address.line1}</p>
            <p>{business.address.line2}</p>
            <p>{business.address.country}</p>
          </Block>

          <Block title="Kontakt">
            <p>
              Telefon:{" "}
              <a href={business.phoneHref} className={linkCls}>
                {business.phone}
              </a>
            </p>
            <p>
              WhatsApp:{" "}
              <a
                href={business.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                {business.whatsapp}
              </a>
            </p>
            <p>
              E-Mail:{" "}
              <a href={business.emailHref} className={linkCls}>
                {business.email}
              </a>
            </p>
          </Block>

          <Block title="Umsatzsteuer">
            <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: wird nachgetragen.</p>
          </Block>

          <Block title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
            <p>Raoul Müller</p>
            <p>{business.address.line1}</p>
            <p>{business.address.line2}</p>
          </Block>

          <Block title="Streitbeilegung">
            <p>
              Wir sind nicht bereit und nicht verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
              teilzunehmen.
            </p>
          </Block>

          <Block title="Haftung für Inhalte">
            <p>
              Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Wir sind jedoch
              nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die
              auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur
              Entfernung oder Sperrung der Nutzung von Informationen nach den
              allgemeinen Gesetzen bleiben davon unberührt. Eine diesbezügliche
              Haftung ist erst ab dem Zeitpunkt der Kenntnis einer konkreten
              Rechtsverletzung möglich. Bei Bekanntwerden entsprechender
              Rechtsverletzungen entfernen wir diese Inhalte umgehend.
            </p>
          </Block>

          <Block title="Haftung für Links">
            <p>
              Unser Angebot enthält Links zu externen Websites Dritter, auf
              deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
              diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
              oder Betreiber verantwortlich. Bei Bekanntwerden von
              Rechtsverletzungen entfernen wir derartige Links umgehend.
            </p>
          </Block>

          <Block title="Urheberrecht">
            <p>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
              Downloads und Kopien dieser Seite sind nur für den privaten,
              nicht kommerziellen Gebrauch gestattet. Auf dieser Website
              gezeigte Kundenprojekte sind Eigentum der jeweiligen Kunden und
              werden mit deren Einverständnis dargestellt.
            </p>
          </Block>
        </div>
      </div>
    </section>
    </>
  );
}

const linkCls = "text-ink underline underline-offset-2 hover:opacity-80";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[17px] font-bold text-ink tracking-tight">{title}</h2>
      <div className="mt-2.5 space-y-1.5">{children}</div>
    </div>
  );
}

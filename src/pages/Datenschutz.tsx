import { business } from "../content";
import { Seo, breadcrumbs } from "../seo";

/**
 * Datenschutzerklärung. Beschreibt genau das, was diese Seite tatsächlich
 * tut: Auslieferung über GitHub Pages, ein Kontaktformular an unseren
 * eigenen Endpunkt, eingebettete Kundenwebsites als iFrame, eine Karte,
 * die erst auf Klick zu Google verbindet — und sonst nichts. Kein
 * Tracking, keine Cookies, keine Analyse-Tools. Sobald sich daran etwas
 * ändert, muss dieser Text mitgeändert werden.
 */
export function Datenschutz() {
  return (
    <>
      <Seo
        title="Datenschutzerklärung | Digital Movement"
        description="Wie diese Website mit personenbezogenen Daten umgeht: Auslieferung, Kontaktformular, Aufbewahrung, Ihre Rechte."
        path="/datenschutz"
        schema={[breadcrumbs([{ name: "Datenschutzerklärung", path: "/datenschutz" }])]}
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
          Datenschutzerklärung
        </h1>

        <div className="mt-10 space-y-9 text-[15.5px] leading-relaxed text-ink-soft">
          <Block title="1. Verantwortlicher">
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="font-semibold text-ink">{business.legalName}</p>
            <p>Raoul Müller</p>
            <p>{business.address.line1}</p>
            <p>{business.address.line2}</p>
            <p>
              E-Mail:{" "}
              <a href={business.emailHref} className={linkCls}>
                {business.email}
              </a>
            </p>
            <p>
              Telefon:{" "}
              <a href={business.phoneHref} className={linkCls}>
                {business.phone}
              </a>
            </p>
            <p className="pt-2">
              Ein Datenschutzbeauftragter ist nicht bestellt, da die gesetzlichen
              Voraussetzungen dafür nicht vorliegen.
            </p>
          </Block>

          <Block title="2. Ihre Rechte">
            <p>Sie haben jederzeit das Recht auf</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO),</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
              <li>Löschung Ihrer Daten (Art. 17 DSGVO),</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO).</li>
            </ul>
            <p className="pt-2">
              Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für
              die Zukunft widerrufen. Eine formlose E-Mail an{" "}
              <a href={business.emailHref} className={linkCls}>
                {business.email}
              </a>{" "}
              genügt. Außerdem steht Ihnen ein Beschwerderecht bei einer
              Datenschutz-Aufsichtsbehörde zu, für uns ist das die Berliner
              Beauftragte für Datenschutz und Informationsfreiheit.
            </p>
          </Block>

          <Block title="3. Hosting und Server-Logfiles">
            <p>
              Diese Website wird bei GitHub Pages gehostet, einem Dienst der
              GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA
              94107, USA. Beim Aufruf der Seite verarbeitet GitHub technisch
              notwendige Zugriffsdaten wie Ihre IP-Adresse, Datum und Uhrzeit
              des Abrufs, die abgerufene Seite, den Browsertyp und das
              Betriebssystem. Ohne diese Verarbeitung lässt sich eine Website
              technisch nicht ausliefern.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
              Interesse liegt in einer sicheren und zuverlässigen Auslieferung
              dieser Website. Die Übermittlung in die USA erfolgt auf Grundlage
              der Standardvertragsklauseln der EU-Kommission; GitHub ist zudem
              unter dem EU-U.S. Data Privacy Framework zertifiziert.
            </p>
            <p>
              Die Datenschutzerklärung von GitHub finden Sie unter{" "}
              <a
                href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                docs.github.com
              </a>
              .
            </p>
          </Block>

          <Block title="4. Kontaktformular">
            <p>
              Wenn Sie uns über das Formular auf dieser Seite schreiben,
              verarbeiten wir die von Ihnen eingegebenen Daten: Name,
              Telefonnummer, optional E-Mail-Adresse und Unternehmen sowie Ihre
              Nachricht. Wir nutzen diese Daten ausschließlich, um Ihre Anfrage
              zu beantworten.
            </p>
            <p>
              Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a
              DSGVO, die Sie über die Checkbox unter dem Formular erteilen, und
              — soweit Ihre Anfrage auf einen Vertrag zielt — Art. 6 Abs. 1
              lit. b DSGVO.
            </p>
            <p>
              Die Formulardaten werden über einen von uns selbst betriebenen
              Endpunkt unter der Domain digitalmovement.uk verschlüsselt
              übertragen und anschließend per E-Mail an uns zugestellt. Ein
              Weiterverkauf oder eine Weitergabe an Dritte zu Werbezwecken
              findet nicht statt.
            </p>
            <p>
              Wir löschen Ihre Anfrage, sobald sie erledigt ist und keine
              gesetzlichen Aufbewahrungspflichten entgegenstehen — in der Regel
              spätestens nach zwei Jahren.
            </p>
          </Block>

          <Block title="5. Kontaktaufnahme per E-Mail, Telefon oder WhatsApp">
            <p>
              Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir
              Ihre Angaben zur Bearbeitung der Anfrage auf Grundlage von Art. 6
              Abs. 1 lit. b bzw. lit. f DSGVO.
            </p>
            <p>
              Auf dieser Website finden Sie außerdem einen Link zu WhatsApp.
              Erst wenn Sie diesen Link aktiv anklicken, stellt Ihr Gerät eine
              Verbindung zu WhatsApp Ireland Limited her. Wir haben keinen
              Einfluss darauf, welche Daten WhatsApp dabei verarbeitet.
              Informationen dazu finden Sie in der{" "}
              <a
                href="https://www.whatsapp.com/legal/privacy-policy-eea"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                Datenschutzrichtlinie von WhatsApp
              </a>
              .
            </p>
          </Block>

          <Block title="6. Eingebettete Kundenwebsites">
            <p>
              Im Abschnitt „Erfolgsgeschichten“ zeigen wir die Startseiten
              einiger Kundenprojekte als eingebettete Vorschau (iFrame). Beim
              Laden dieser Vorschau baut Ihr Browser eine direkte Verbindung zum
              jeweiligen Webserver des Kunden auf und übermittelt dabei Ihre
              IP-Adresse. Die Vorschau wird erst geladen, wenn Sie bis zu diesem
              Abschnitt scrollen.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes
              Interesse liegt in der Darstellung unserer Arbeitsergebnisse. Für
              die Datenverarbeitung auf den eingebetteten Websites ist der
              jeweilige Betreiber verantwortlich.
            </p>
          </Block>

          <Block title="7. Google Maps in der Fußzeile">
            <p>
              In der Fußzeile zeigen wir, wo unser Büro liegt. Zu sehen ist
              zunächst ein Kartenausschnitt als Bild, das von unserem eigenen
              Server kommt — dabei entsteht keine Verbindung zu Google.
            </p>
            <p>
              Erst wenn Sie auf „Google Maps laden“ klicken, wird die
              bedienbare Karte von Google Maps nachgeladen. Anbieter ist
              Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
              Irland. Dabei übermittelt Ihr Browser Ihre IP-Adresse an Google,
              Google kann Informationen auf Ihrem Gerät speichern und
              auslesen, und eine Übermittlung in die USA ist nicht
              ausgeschlossen. Ist Ihr Google-Konto im selben Browser
              angemeldet, kann Google den Aufruf diesem Konto zuordnen.
            </p>
            <p>
              Rechtsgrundlage ist Ihre Einwilligung nach § 25 Abs. 1 TDDDG und
              Art. 6 Abs. 1 lit. a DSGVO — der Klick ist die Einwilligung. Sie
              gilt für den laufenden Besuch und lässt sich jederzeit
              widerrufen, indem Sie den Tab schließen oder neu laden. Ihre
              Entscheidung merkt sich der Browser dafür im Sitzungsspeicher
              („dm-maps“); dieser Eintrag ist zur Umsetzung Ihrer Wahl
              erforderlich und wird beim Schließen des Tabs gelöscht. Klicken
              Sie nicht, wird nichts an Google übertragen.
            </p>
            <p>
              Mehr dazu in der{" "}
              <a
                href="https://policies.google.com/privacy?hl=de"
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                Datenschutzerklärung von Google
              </a>
              .
            </p>
          </Block>

          <Block title="8. Schriften">
            <p>
              Die auf dieser Website verwendeten Schriften werden von unserem
              eigenen Server ausgeliefert. Es besteht dabei keine Verbindung zu
              Servern Dritter, insbesondere nicht zu Google Fonts.
            </p>
          </Block>

          <Block title="9. Cookies, Tracking und Analyse">
            <p>
              Diese Website setzt keine Cookies zu Analyse-, Marketing- oder
              Tracking-Zwecken. Es sind keine Analyse-Dienste, keine
              Werbe-Pixel und keine Social-Media-Plugins eingebunden. Deshalb
              gibt es hier auch kein Cookie-Banner.
            </p>
          </Block>

          <Block title="10. SSL-/TLS-Verschlüsselung">
            <p>
              Diese Seite nutzt aus Sicherheitsgründen eine
              SSL-/TLS-Verschlüsselung. Sie erkennen das an der Adresszeile
              Ihres Browsers, die mit „https://“ beginnt. Daten, die Sie an uns
              übermitteln, können dadurch nicht von Dritten mitgelesen werden.
            </p>
          </Block>

          <Block title="11. Stand dieser Erklärung">
            <p>Stand: 24. August 2026.</p>
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
      <div className="mt-2.5 space-y-2">{children}</div>
    </div>
  );
}

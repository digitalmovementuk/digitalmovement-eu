import contentRevisions from "./content-revisions.json";
import { team } from "./team";

/**
 * Sämtliche echte, markenspezifische Copy der Startseite.
 *
 * Der Fließtext stammt aus dem freigegebenen Dokument
 * „DM-DE-Startseite-Copy-v1.0-20260814 RMU“ und ist wortgleich übernommen.
 * Geändert wurden nur Rechtschreibung, Grammatik und einzelne Formulierungen,
 * wo es ohne die Änderung falsch gewesen wäre. Wo das Dokument für ein
 * Bauteil keinen Text vorgibt, steht hier ein ergänzter Text — als solcher
 * im Kommentar markiert.
 *
 * Version 1.8 · Stand 24.08.2026
 *
 * Änderungen 1.8 (24.08.2026): das Pop-up „Potenzialanalyse“ holt seinen
 * Formulartext jetzt ebenfalls aus `hero`. Auf Weisung RMU: „The pop up
 * contact form has to be synced and aligned as well.“ Damit entfallen in
 * `popup` die Schlüssel `headline`, `intro`, `fields`, `submit`,
 * `sending`, `error`, `successTitle` und `successBody`; geblieben sind
 * nur die drei Angaben, die es außerhalb eines Formulars gibt
 * (`eyebrow`, `dismiss`, `closeLabel`).
 *
 * Der zurückgezogene Wortlaut, damit er nachlesbar bleibt: Überschrift
 * „Kostenloses Audit Ihrer Website.“, Einleitung „30 Minuten Walkthrough
 * plus Ein-Seiten-Audit per E-Mail. Egal, ob wir zusammenarbeiten oder
 * nicht.“, Knopf „Audit anfordern“, Dank „Danke — bis gleich.“ /
 * „Sie hören innerhalb 2 Stunden von mir. Persönlich.“
 *
 * Warum weg: die Seite bot damit zweierlei an — unten und oben eine
 * „kostenlose Analyse“, in der Mitte ein „kostenloses Audit“. Das ist
 * für den Leser nicht dasselbe Angebot, sondern ein zweites, und das
 * Pop-up fragte dafür auch andere Felder ab (kein Website-Feld, keine
 * Auswahl). Ein Angebot, ein Formular, ein Wortlaut.
 *
 * `hero.formSuccessTitle` ist neu — die Zeile „Angekommen.“ stand als
 * fester Text im Kontaktabschnitt und wird jetzt von beiden gelesen.
 *
 * Änderungen 1.7 (24.08.2026): `comparison.columns` bekommt eine dritte
 * Beschriftung, `topic: "Thema"`. Der Vergleich steht seit dieser Fassung
 * in einer echten Tabelle statt in zwei Karten (Blueprint Teil 12: „eine
 * echte <table> … niemals ein Bild einer Tabelle"), und eine Tabelle
 * braucht auch für die erste Spalte eine Überschrift. Kein Werbetext,
 * sondern die Beschriftung einer Spalte — der freigegebene Text des
 * RMU-Dokuments bleibt unberührt.
 *
 * Änderungen 1.6 (24.08.2026): `contact.form` und `contact.serviceOptions`
 * entfallen. Das Anfrageformular im Kontaktabschnitt ist auf Weisung RMU
 * („Make sure the data fields and content of contact form at bottom of
 * page is synced with contact form in hero.") Feld für Feld und Wort für
 * Wort dasselbe wie im Startbereich und holt seinen Text jetzt aus
 * `hero`. Der Formulartext steht damit nur noch einmal auf der Platte.
 * Die beiden Kopien hatten sich bereits auseinandergelebt — unten
 * „Nachricht senden“ und „Leistung“, oben „Kostenlose Analyse anfordern“
 * und „Was soll am meisten wachsen?“ — und unten wurden zwei Felder
 * abgefragt, die es oben nicht gibt (Unternehmen, Freitext), während das
 * Feld für die Website fehlte.
 *
 * Änderungen 1.5 (24.08.2026): Startbereich zurück auf den Text, den RMU
 * am selben Tag vorgegeben hat — Überzeile „SEO-Agentur“, Überschrift
 * „Wir garantieren echte Ergebnisse für weniger Kosten.“, drei Vorspann-
 * Zeilen, „Wir generieren Anfragen über“ über den Logos, Bewertungszeile
 * ohne „Australia“. 1.4 hatte diesen Text irrtümlich wieder auf die
 * Fassung des freigegebenen Dokuments zurückgesetzt; RMU hat das am
 * Abend richtiggestellt. `lede` entfällt erneut, `ledeLines` kommt
 * zurück. Zwei Eingriffe bleiben, beide reine Rechtschreibung:
 * „Deutschland's“ → „Deutschlands“ und „+ber“ → „über“.
 *
 * ⚠️ Kaufmännischer Hinweis, keine Textänderung: „Wir garantieren“,
 * „Deutschlands beste“ und „Bis zu 10x mehr“ sind in Deutschland
 * abmahnfähige Aussagen (§ 5 UWG, Alleinstellungs- und Garantiewerbung),
 * solange sie nicht belegt und die Garantie nicht als Bedingung
 * beschrieben ist. Der Text steht so auf Weisung; die Entscheidung ist
 * vermerkt, nicht getroffen.
 *
 * Änderungen 1.4 (24.08.2026): (a) Startbereich zurück auf die Fassung
 * des freigegebenen Dokuments — Überzeile „SEO-Agentur Deutschland“,
 * Überschrift „SEO-Agentur, gemessen in Anfragen.“, ein zusammen-
 * hängender Vorspann statt drei Zeilen, „Gefunden werden bei“ über den
 * Logos, Bewertungszeile wieder mit „Australia“. Damit sind die
 * Werbeaussagen aus 1.3 („Wir garantieren“, „Deutschlands beste“,
 * „10x mehr Marketing-Wert“) wieder vom Blatt; `ledeLines` entfällt,
 * `lede` kommt zurück. (b) Neue Bauteile für den Landing-Page-Blueprint:
 * `byline`, `answerBlock`, `trustBar`, `problem`, `solutionStep`,
 * `faqIntro`, `lastUpdated`. Deren Text gibt das freigegebene Dokument
 * nicht vor — er ist ergänzt und am Block als solcher gekennzeichnet.
 *
 * Änderungen 1.3 (24.08.2026): Zwischenfassung mit RMU-Text vom selben
 * Tag („Wir garantieren echte Ergebnisse für weniger Kosten.“), am
 * Abend durch 1.4 ersetzt. Nur noch für den Verlauf hier vermerkt.
 *
 * Änderungen 1.2 (24.08.2026): `hero` vollständig ersetzt. Auf Weisung RMU
 * ist der Startbereich jetzt die Übernahme von digitalmovement.uk, auf
 * Deutsch. Damit entfallen die drei Video-Textblöcke (`slides`), die
 * Schlagwortzeile (`services`), das Kurzformular mit nur einem Feld und
 * die Kontaktliste am unteren Rand; dazu kommen Überschrift mit
 * hervorgehobenem Teil, die Zeile „Gefunden werden bei“, die Belegzeile
 * und das fünffeldrige Anfrageformular. Die Gründe für die drei
 * Abweichungen von der englischen Vorlage stehen am Block selbst.
 *
 * Änderungen 1.1 (24.08.2026): Firmierung „Digital Movement Deutschland ·
 * Raoul Müller“ zu „Digital Movement Germany“ — auf Weisung RMU. Die
 * Zeile `rights` in der Fußzeile trägt dieselbe Firmierung, sonst nennt
 * die Seite zwei verschiedene Unternehmen.
 */

export const business = {
  name: "Digital Movement",
  legalName: "Digital Movement Germany",
  tagline: "Jede Woche neue Verkaufschancen.",
  email: team[0].email,
  emailHref: "mailto:office@digitalmovement.eu",
  phone: team[0].phone,
  phoneHref: team[0].phoneHref,
  whatsapp: "+49 176 82360647",
  whatsappHref: "https://wa.me/4917682360647",
  /* Als Objekt, weil Impressum und Datenschutzerklärung die Zeilen
     einzeln setzen müssen. `addressLine` ist dieselbe Anschrift für
     Fließtext und strukturierte Daten. */
  address: { line1: "Kolonnenstraße 8", line2: "10827 Berlin", country: "Deutschland" },
  addressLine: "Kolonnenstraße 8, 10827 Berlin",
  /* Noch keine deutschen Profile angelegt. Ein Link auf ein Profil, das es
     nicht gibt, ist schlechter als kein Link — deshalb leer statt geraten. */
  socials: [] as { label: string; href: string }[],
};

/**
 * Die Kontaktwege, die die Seite anbietet.
 *
 * Johannes ist der Hauptkontakt für Telefon und WhatsApp (11.09.2026).
 */
export const contactChannels = {
  phoneE164: "+4916096897003" as string | null,
  whatsappE164: "+4917682360647" as string | null,
  /** Wohin „Rückruf“ scrollt. */
  formTarget: "#contact",
};

export const navLinks = [
  { label: "Leistungen", href: "#services" },
  { label: "Über uns", href: "#founder" },
  { label: "Referenzen", href: "#cases" },
  { label: "Kontakt", href: "#contact" },
];

/**
 * Die Bewertung stammt vom Google-Profil des Mutterunternehmens in
 * Melbourne, nicht von einem deutschen Profil — so von RMU am 14.08.2026
 * entschieden („Genau wie geschrieben“). Der Link zeigt deshalb dorthin,
 * wo die Bewertungen tatsächlich stehen: ein Nachweis-Link, der nichts
 * nachweist, wäre schlimmer als gar keiner.
 */
export const googleRating = {
  rating: 5.0,
  count: 100,
  reviewsUrl: "https://www.google.com/search?q=Digital+Movement+Melbourne+Reviews",
};

/* ============================================================
   HERO
   ============================================================ */

export const hero = {
  /* ------------------------------------------------------------------
     Aufbau und Gestaltung des Startbereichs sind die 1:1-Übernahme von
     digitalmovement.uk (abgerufen 24.08.2026, Anweisung RMU: „Fully copy
     the hero … but all translated in German. Must all be identical.“).
     Der TEXT darin stammt dagegen nicht aus der Übersetzung, sondern aus
     der Vorgabe, die RMU am 24.08.2026 zweimal geschickt hat („Passe Hero
     an.“). Wo beides auseinanderging, gilt die Vorgabe.

     Was das gegenüber der englischen Vorlage bedeutet:

     1. Der Preissatz („It starts from £495 a month“) fehlt. Für
        Deutschland ist kein Preis freigegeben. £495 stehen zu lassen wäre
        falsch, umzurechnen hieße, einen Preis zu erfinden.
     2. Die Bewertungszahl ist „über 100“, nicht „102“. Freigegeben ist
        die Angabe aus googleRating. Die kleinere, belegte Zahl gewinnt.
     3. Die Bewertungszeile endet auf „Digital Movement“, ohne
        „Australia“ — so von RMU vorgegeben. ⚠️ Sachlicher Hinweis: die
        Bewertungen sind beim australischen Betrieb entstanden. Ohne den
        Zusatz liest die Zeile so, als gehörten sie dem deutschen
        Unternehmen, das es seit dem 21.08.2026 gibt. Der Text steht auf
        Weisung; der Einwand ist vermerkt, nicht ausgeführt.

     ⚠️ Kaufmännischer Hinweis zur Überschrift und zum Vorspann:
     „Wir garantieren“, „Deutschlands beste“ und „Bis zu 10x mehr“ sind
     in Deutschland abmahnfähig (§ 5 UWG — irreführende Werbung,
     Alleinstellungs- und Garantieaussagen), solange die Garantie nicht
     als Bedingung beschrieben und die Spitzenstellung nicht belegt ist.
     Ein Wettbewerber kann das ohne Gericht abmahnen; die Kosten liegen
     üblicherweise im vierstelligen Bereich. Ebenfalls auf Weisung.
     ------------------------------------------------------------------ */

  /* Überzeile mit dem Strich davor („ilabel“ im englischen System). */
  label: "SEO-Agentur in Berlin",

  /* Die Überschrift ist dreiteilig, weil der letzte Teil den
     Farbverlaufs-Strich untergelegt bekommt. Der hervorgehobene Teil trägt
     white-space:nowrap — er darf also nie so lang werden, dass er breiter
     ist als die Textspalte. Gemessen, nicht geschätzt.

     Am Schreibtisch steht die Zeile dreizeilig: „WIR GARANTIEREN“ /
     „ECHTE ERGEBNISSE FÜR“ / „WENIGER KOSTEN.“ Damit das aufgeht, ist der
     Schriftgrad in hero-uk.css bei 3.2rem gedeckelt und die Textsäule auf
     1.14fr verbreitert — die längste der drei Zeilen misst dann 598px in
     einer 629px breiten Spalte. Wer eines von beiden ändert, bekommt vier
     Zeilen und ein einzelnes Wort am Ende.

     `headlineNoBreak` bekommt white-space:nowrap, damit „Wir garantieren“
     als Einheit stehen bleibt. */
  headlineNoBreak: "SEO-Agentur",
  headlineRest: " Berlin. ",
  headlineAccent: "Anfragen gewinnen.",

  /* Der Vorspann sind drei kurze Sätze, jeder auf einer eigenen Zeile —
     so von RMU vorgegeben. Sie laufen deshalb nicht als Fließtext, sondern
     als drei Blöcke innerhalb desselben `.lede`-Absatzes; Schriftgrad,
     Farbe und Zeilenabstand bleiben die der Vorlage. */
  ledeLines: [
    "Wir sind Ihre SEO-Agentur in Berlin.",
    "Wir verbinden SEO und KI-Suche.",
    "Starten Sie mit einer kostenlosen Website-Analyse.",
  ],

  /* Zeile „Wir generieren Anfragen über“ mit den vier Marken. Die Dateinamen sind
     die Originaldateien der englischen Seite; sie liegen unter
     public/brand/hero-uk/logos/ und werden über import.meta.env.BASE_URL
     angesprochen, damit sie auch unter abweichendem Basispfad laden. */
  findLabel: "Wir generieren Anfragen über",
  apps: [
    { key: "google", label: "Google", icon: "google.svg" },
    { key: "gemini", label: "Gemini", icon: "googlegemini.svg" },
    { key: "chatgpt", label: "ChatGPT", icon: "openai.svg" },
    { key: "claude", label: "Claude", icon: "claude.svg" },
  ],

  /* Belegzeile: Bewertungs-Pille + zwei Kennzahlen. */
  reviewsHref: googleRating.reviewsUrl,
  reviewsRating: "Google",
  reviewsText: "· Bewertungen aus Australien",
  stats: [
    { value: "Berlin", label: "Standort" },
    { value: "Deutschland", label: "Betreuung" },
  ],

  /* ---------- Anfrageformular ---------- */
  formTitle: "Kostenlose Analyse Ihrer Website",
  formIntro:
    "Sagen Sie uns Ihre Website und welche Anfragen Sie brauchen — wir melden uns mit dem, was wir zuerst beheben würden. Kostenlos und unverbindlich.",

  /* Telefon ist Pflicht, E-Mail optional. Das gilt für jedes Formular auf
     jeder Digital-Movement-Seite und ist auch in der englischen Vorlage
     so. */
  fields: {
    name: { label: "Vor- und Nachname", placeholder: "Ihr Name" },
    phone: { label: "Telefon", placeholder: "0176 … oder +49 …" },
    email: { label: "E-Mail (optional)", placeholder: "sie@firma.de" },
    website: { label: "Ihre Website", placeholder: "https://ihrefirma.de" },
    service: { label: "Was soll am meisten wachsen?" },
  },

  /* Reihenfolge wie in der Vorlage. Der erste Eintrag ist die Vorauswahl —
     kein leerer Platzhalter, weil ein Auswahlfeld ohne Vorauswahl auf dem
     Telefon als ungefüllt gelesen wird und den Absenden-Versuch abbricht,
     ohne dass sichtbar wird, warum. */
  serviceOptions: [
    "SEO-Analyse",
    "Sichtbarkeit in der KI-Suche",
    "Local SEO / Google Maps",
    "Google Ads",
    "CRM & Nachfassen",
  ],

  formCta: "Kostenlose Analyse anfordern",
  formSending: "Wird gesendet …",
  formNote: "Kein Newsletter. Keine Verkaufsanrufe. Nur unsere Antwort.",
  /* Der Dank steht zweizeilig: eine kurze Bestätigung und darunter, was
     als Nächstes passiert. Beide Formulare, die einen Erfolgszustand
     zeigen (Kontaktabschnitt und Pop-up), lesen dieselben zwei Zeilen. */
  formSuccessTitle: "Angekommen.",
  formSuccess: "Danke. Sie hören innerhalb 2 Stunden von mir.",
  formError:
    "Das hat nicht geklappt. Bitte rufen Sie uns an oder schreiben Sie an office@digitalmovement.eu.",

  /* Feldbezogene Fehlermeldungen. Sie sagen, was zu tun ist, nicht was
     falsch war — „Bitte tragen Sie …“ statt „Ungültige Eingabe“. */
  errRequiredName: "Bitte tragen Sie Ihren Namen ein.",
  errRequiredPhone: "Bitte tragen Sie eine Telefonnummer ein, unter der wir Sie erreichen.",
  errRequiredWebsite: "Bitte tragen Sie die Adresse Ihrer Website ein.",
  errConsent: "Ohne Ihr Einverständnis dürfen wir Ihre Anfrage nicht bearbeiten.",

};

export const heroStats = [
  { value: 8, suffix: "×", label: "mehr Anfragen pro Monat" },
  { value: 2, suffix: " Std.", label: "bis zur Antwort" },
];

export const heroEyebrow = {
  ratingText: "5,0 · über 100 Bewertungen",
};

/* ============================================================
   LEISTUNGEN
   ============================================================ */

export const servicesIntro = {
  eyebrow: "Was wir tun",
  headlineMain: "Was können wir für Sie tun?",
  headlineSub: "Vier Services. Ein Ziel – Ihr Unternehmenswachstum.",
};

export const services = [
  {
    key: "seo",
    title: "SEO",
    promise: "Google Seite 1. In 90 Tagen.",
    detail:
      "Technische Optimierungen. Suchbegriffs-Analyse & Strategie. Neue Webseiten, die Sie sichtbar machen. Monatliche Performance-Berichte.",
    bullets: [
      "Technisches SEO-Audit",
      "Content + On-Page",
      "Autoritätsaufbau",
      "Monatliche Auswertung",
    ],
    video: "video/seo-logo.mp4",
    to: "/#contact",
    ctaLabel: "SEO anfragen",
  },
  {
    key: "google-ads",
    title: "Google Ads",
    /* Der Titel trug bis 25.08.2026 beide Sätze und lief auf dem Desktop
       über drei Zeilen — das Tor (check-render) lässt zwei zu. Kein Wort ist
       weg, der zweite Satz steht jetzt in der Erklärung. Damit sind alle
       vier Karten gleich gebaut: kurzes Versprechen, dann die Erklärung. */
    promise: "Wir finden Ihre Zielgruppe.",
    detail:
      "Unmittelbare Kundenanfragen und Sales-Gespräche für Ihren Vertrieb. Zielgerichtete Kampagnen. Conversion-Tracking.",
    bullets: [
      "Search + Performance Max",
      "Conversion-Tracking",
      "Zielseiten, die konvertieren",
      "Wöchentliche Optimierung",
    ],
    video: "video/google-ads-logo.mp4",
    to: "/#contact",
    ctaLabel: "Google Ads anfragen",
  },
  {
    key: "social",
    title: "Social Media",
    promise: "Content, der Anfragen bringt.",
    detail:
      "Social-Media-Content, der Vertrauen schafft und Anfragen bringt, anstatt Likes.",
    bullets: [
      "Short-Form-Video",
      "Paid Social (Instagram und Facebook Ads)",
      "Kreativ-Produktion",
      "Lead-getriebener Posting-Plan",
    ],
    video: "video/socials-logo.mp4",
    to: "/#contact",
    ctaLabel: "Social Media anfragen",
  },
  {
    key: "websites",
    title: "Websites",
    promise: "High-End Design. Optimiert für Sichtbarkeit in Google und KI-Suche.",
    detail:
      "Schnell. Modern. State-of-the-Art-Design. Mobile-first. Lädt schnell, sieht gut aus, macht aus Besuchern Anfragen.",
    bullets: [
      "Mobile-first Design",
      "Core Web Vitals",
      "Auf Conversion gebaut",
      "Optimiert für Google und KI-Suche",
    ],
    video: "video/website-logo.mp4",
    to: "/#contact",
    ctaLabel: "Website anfragen",
  },
];

/* ============================================================
   ZAHLEN
   ============================================================ */

export const metrics = {
  eyebrow: "Zahlen",
  headlineMain: "Was zählt wirklich?",
  headlineSub: "",
  intro: "Anfragen. Nicht Klicks. Drei Zahlen aus laufenden Kunden. Gemessen. Nicht behauptet.",
  items: [
    { value: 8, suffix: "×", label: "mehr Anfragen pro Monat", highlight: false },
    { value: 90, suffix: "", label: "Tage bis Google Seite 1", highlight: false },
    { value: 300, suffix: "", label: "Kundenprojekte abgeschlossen", highlight: true },
  ],
};

/** Wird von der Ergebnis-Leiste benutzt. Gleiche Zahlen wie oben. */
export const results = [
  {
    metric: "8×",
    label: "mehr Anfragen pro Monat",
    industry: "Dienstleister",
    work: "SEO + Website",
    timeline: "90 Tage",
    quote: "Schon nach einer Woche der erste neue Kunde. Seitdem stetiger Zuwachs.",
  },
  {
    metric: "13×",
    label: "mehr Anfragen pro Monat",
    industry: "Gewerbereinigung",
    work: "SEO + Webdesign + Google Ads",
    timeline: "4 Monate",
    quote: "Gewerbliche Suchbegriffe standen nach wenigen Wochen auf Google Platz 1.",
  },
  {
    metric: "5×",
    label: "mehr Beratungsgespräche",
    industry: "Finanzberatung",
    work: "SEO + Content + Webdesign",
    timeline: "5 Monate",
    quote: "Klare Expertise, zu wenig Sichtbarkeit — genau das haben wir gedreht.",
  },
];

/* ============================================================
   PROZESS — Ihre ersten 90 Tage
   ============================================================ */

export const processIntro = {
  eyebrow: "Ihr Projekt mit uns",
  headlineMain: "Wie läuft Ihr Projekt ab?",
  intro:
    "Vom ersten Gespräch bis zum monatlichen Bericht.",
};

export const processSteps = [
  {
    "n": "01",
    "eta": "Phase 01",
    "title": "Website prüfen, Ziele klären",
    "body": "Wir analysieren Ihre bestehende Website kostenlos und besprechen, welche Leistungen und Anfragen für Ihr Unternehmen zählen."
  },
  {
    "n": "02",
    "eta": "Phase 02",
    "title": "Die nächsten Schritte festlegen",
    "body": "Wir ordnen die Aufgaben nach Priorität und planen, welche technischen Verbesserungen und Inhalte Ihre Website braucht."
  },
  {
    "n": "03",
    "eta": "Phase 03",
    "title": "Verbesserungen umsetzen",
    "body": "Wir setzen die vereinbarten Maßnahmen um – an der Technik, den Inhalten und der Gestaltung Ihrer Website."
  },
  {
    "n": "04",
    "eta": "Phase 04",
    "title": "Monatlich berichten",
    "body": "Sie erhalten jeden Monat einen Bericht über die erledigten Arbeiten und die Entwicklung Ihrer Anfragen."
  },
  {
    "n": "05",
    "eta": "Phase 05",
    "title": "Prüfen und weiter verbessern",
    "body": "Wir werten die Ergebnisse aus und passen die nächsten Schritte daran an. So bleibt klar, woran wir arbeiten und warum."
  }
];

/* ============================================================
   KUNDENPROJEKTE
   ============================================================ */

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  location?: string;
  services: string[];
  timeline: string;
  headline: string;
  body: string;
  metrics: { value: string; label: string }[];
  /** Live-Website des Kunden. Wird verlinkt, wo vorhanden. */
  url?: string;
};

/* Kein `video` mehr: jede Kachel zeigt seit dem 15.08.2026 den
   eingefrorenen ersten Bildschirm der Kundenseite selbst
   (public/cases/<slug>/), nicht mehr einen Stimmungsfilm. Wer einen Kunden
   aufnimmt, trägt ihn in scripts/build-case-heroes.mjs ein und lässt das
   Skript laufen. */

export const casesIntro = {
  eyebrow: "Erfolgsgeschichten",
  headlineMain: "Kundenwebsites aus unserer Arbeit",
  headlineSub: "",
  intro: "Von Beratung und Gebäudereinigung bis zur Villenvermietung: Sehen Sie sich die Websites an und erfahren Sie, welche Leistungen wir für die jeweiligen Projekte übernommen haben.",
  visitLabel: "Website ansehen",
};

/** Reihenfolge nach Freigabe RMU: die aktuellen Marken zuerst, CEx voran. */
export const caseStudies: CaseStudy[] = [
  {
    slug: "cex",
    client: "CEx",
    industry: "Customer-Excellence-Plattform",
    location: "Köln",
    services: ["SEO", "Webdesign", "Content"],
    timeline: "2026",
    headline: "CEx: Customer Excellence aus Köln",
    body: "Für die Customer-Excellence-Plattform CEx haben wir SEO, Webdesign und Inhalte umgesetzt.",
    metrics: [{"value": "Köln", "label": "Standort"}, {"value": "SEO", "label": "Leistung"}, {"value": "2026", "label": "Projekt"}],
    url: "https://cex.koeln",
  },
  {
    slug: "azura-living-bali",
    client: "Azura Living Bali",
    industry: "Villenvermietung",
    location: "Bali",
    services: ["SEO", "Webdesign"],
    timeline: "2026",
    headline: "Azura Living Bali: Villen zur Miete",
    body: "Für die Villenvermietung Azura Living Bali haben wir die Website gestaltet und die Suchmaschinenoptimierung übernommen.",
    metrics: [{"value": "Bali", "label": "Standort"}, {"value": "SEO", "label": "Leistung"}, {"value": "2026", "label": "Projekt"}],
    url: "https://azuralivingbali.com",
  },
  {
    slug: "addressbali",
    client: "ADDRESSBALI",
    industry: "Premium-Villenmarke",
    location: "Bali",
    services: ["Webdesign", "Performance Marketing"],
    timeline: "2026",
    headline: "ADDRESS BALI: Eine Marke für Premiumvillen",
    body: "Für ADDRESS BALI haben wir Webdesign und Performance-Marketing umgesetzt.",
    metrics: [{"value": "Bali", "label": "Standort"}, {"value": "Webdesign", "label": "Leistung"}, {"value": "2026", "label": "Projekt"}],
    url: "https://addressbali.com",
  },
  {
    slug: "cunos",
    client: "Cunos",
    industry: "Finanzberatung",
    location: "London",
    services: ["SEO", "Content", "Webdesign"],
    timeline: "2026",
    headline: "Cunos: Finanzberatung in London",
    body: "Für die Londoner Finanzberatung Cunos haben wir die Website gestaltet, Inhalte erstellt und SEO umgesetzt.",
    metrics: [{"value": "London", "label": "Standort"}, {"value": "SEO", "label": "Leistung"}, {"value": "2026", "label": "Projekt"}],
    url: "https://cunos.co.uk",
  },
  {
    slug: "fantastic-finish",
    client: "Fantastic Finish",
    industry: "Gewerbereinigung",
    location: "Manchester",
    services: ["SEO", "Webdesign", "Google Ads"],
    timeline: "2026",
    headline: "Fantastic Finish: Gewerbliche Reinigung in Manchester",
    body: "Für Fantastic Finish haben wir Webdesign, Suchmaschinenoptimierung und Google Ads übernommen.",
    metrics: [{"value": "Manchester", "label": "Standort"}, {"value": "SEO", "label": "Leistung"}, {"value": "2026", "label": "Projekt"}],
  },
];

/* ============================================================
   STIMMEN
   ============================================================ */

export type Review = {
  name: string;
  role: string;
  quote: string;
  when?: string;
  initial?: string;
};

/**
 * Echte, verifizierte Google-Bewertungen vom Profil des
 * Mutterunternehmens. Sie sind bewusst im Original belassen: eine
 * übersetzte Bewertung ist keine Bewertung mehr, sondern unsere
 * Formulierung im Mund eines Kunden.
 */
export const testimonials: Review[] = [
  {
    name: "Andrew Schultz",
    role: "Onlineshop-Inhaber",
    when: "Verifizierte Google-Bewertung",
    quote:
      "I can't recommend Digital Movement enough for their incredible SEO services. As the owner of a small online store, I was struggling to attract consistent traffic and generate sales. Their team took the time to understand my business and implemented a tailored SEO strategy that delivered results almost immediately — a game-changer for my business.",
  },
  {
    name: "Beth Sorenson",
    role: "Selbstständig",
    when: "Verifizierte Google-Bewertung",
    quote:
      "Digital Movement have been amazing to work with. The team built me a great website and set up SEO and Google Ads, and I started getting real leads not long after. The team is easy to talk to, quick to respond, and they explain everything in plain English.",
  },
  {
    name: "Matthew Peard",
    role: "Erste eigene Website",
    when: "Verifizierte Google-Bewertung",
    quote:
      "Digital Movement has done an incredible job on my first website. I can't express how happy I am with Martey and his team. They know their stuff and know how to get the results I need. Thanks for looking after me and giving me the best package and price for what I needed at the time.",
  },
  {
    name: "Fabienne M.",
    role: "Kundin seit Jahren",
    when: "Verifizierte Google-Bewertung",
    quote:
      "Punctual, organised, and efficient are just a few of their best qualities. I have been dealing with this company for years now, and I couldn't recommend a better agency. Not only have they helped me with my websites, SEO, and Google Ads, but they've also always pointed me in the right direction.",
  },
];

/* ============================================================
   VERGLEICH
   ============================================================ */

export const comparison = {
  eyebrow: "Zusammenarbeit",
  headlineMain: "Was machen wir anders?",
  headlineSub: "",
  intro: "Sechs Punkte. Damit Sie wissen, worauf Sie sich einlassen. Bevor Sie sich einlassen.",
  columns: {"topic": "Kriterium", "other": "Darauf sollten Sie achten", "neo": "Bei Digital Movement"},
  rows: [
  {
    "topic": "Vertragslaufzeit",
    "other": "Laufzeit und Kündigungsbedingungen prüfen.",
    "neo": "Die Laufzeit vereinbaren wir im Angebot."
  },
  {
    "topic": "Berichte",
    "other": "Rhythmus und Inhalt der Berichte klären.",
    "neo": "Monatlicher Bericht über Arbeiten und Anfragen."
  },
  {
    "topic": "Ansprechpartner",
    "other": "Zuständigkeit und Erreichbarkeit klären.",
    "neo": "Johannes und Raoul sind persönlich erreichbar."
  },
  {
    "topic": "Preis",
    "other": "Leistungsumfang und Gesamtkosten prüfen.",
    "neo": "Umfang und Kosten vereinbaren wir vor Arbeitsbeginn im Angebot."
  },
  {
    "topic": "Ziel",
    "other": "Festlegen, welche Anfragen Ihrem Geschäft helfen.",
    "neo": "Unser Ziel: qualifizierte Anfragen, die zu Ihrem Angebot passen."
  },
  {
    "topic": "Website und Konten",
    "other": "Eigentum und Zugänge vorab klären.",
    "neo": "Ihre Website, Daten und Konten bleiben bei Ihnen."
  }
],
};

/* ============================================================
   SNAPSHOT
   ============================================================ */

export const snapshot = {
  eyebrow: "Snapshot",
  /* Überschrift als Frage — Blueprint LB1.4. Die freigegebenen Wörter
     ("Snapshot", "in 30 Sekunden") bleiben erhalten, sie stehen jetzt nur
     an anderer Stelle: das eine als Kicker, das andere in der Frage.
     Erfunden ist nichts, umgestellt ist alles. */
  title: "Was bekommen Sie von uns — in 30 Sekunden?",
  items: [
    {
      index: "01",
      label: "Was",
      headline: "Mehr Anfragen.",
      detail: "Sichtbarkeit in Google und ChatGPT.",
      /* Leere Listen statt fehlender Felder: so ist der Elementtyp der
         drei Einträge identisch und die Karte kann `item.tags.length`
         abfragen, ohne dass TypeScript über eine Vereinigung stolpert. */
      tags: [] as string[],
      points: [] as string[],
    },
    {
      index: "02",
      label: "Für wen",
      headline: "Inhaber & Mittelstand.",
      detail: "",
      /* Dieselben sechs Wörter wie vorher — vorher als ein Satz mit fünf
         Punkten, jetzt als sechs Marken. Eine Aufzählung, die aussieht wie
         eine Aufzählung, wird gelesen; ein Satz aus Einzelwörtern nicht. */
      tags: [
        "Beratung",
        "Handwerk",
        "Praxen",
        "Dienstleister",
        "E-Commerce",
        "B2B",
      ],
      points: [] as string[],
    },
    {
      index: "03",
      label: "Was Sie bekommen",
      /* Die Überschrift bestand aus drei Sätzen hintereinander. Wortgleich,
         aber getrennt: der erste bleibt Überschrift, die anderen beiden
         werden zu Punkten. */
      headline: "Premium-Website.",
      detail:
        "Brandneues Premium-Website-Design, optimiert für Ranking auf Google Seite 1.",
      tags: [] as string[],
      points: [
        "SEO-Pages, optimiert für KI-Suche.",
        "Monatliche Performance-Berichte.",
      ],
    },
  ],
};

/* ============================================================
   GRÜNDER-NOTIZ
   ============================================================ */


/* ============================================================
   KONTAKT
   ============================================================ */

export const contact = {
  eyebrow: "Schreiben Sie uns",
  headlinePre: "Lassen Sie uns",
  headlineSoft: "starten.",
  intro: "Johannes ist Ihr Ansprechpartner für das erste Gespräch. Sie erreichen ihn telefonisch, per WhatsApp oder per E-Mail.",
  /* Kein eigener Formulartext mehr. Das Formular in diesem Abschnitt ist
     Feld für Feld dasselbe wie im Startbereich und holt Beschriftungen,
     Platzhalter, Auswahlliste, Knopfbeschriftung, Hinweiszeile und
     Fehlertexte aus `hero` weiter oben. Der Text steht damit an einer
     Stelle und kann nicht mehr auseinanderlaufen. */
  tiles: [
    { kicker: "Telefon", value: business.phone, href: business.phoneHref },
    {
      kicker: "WhatsApp",
      value: business.whatsapp,
      href: business.whatsappHref,
      external: true,
    },
    { kicker: "E-Mail", value: "office@digitalmovement.eu", href: "mailto:office@digitalmovement.eu" },
    { kicker: "Adresse", value: "Kolonnenstraße 8, 10827 Berlin", href: "/impressum" },
  ] as { kicker: string; value: string; href: string; external?: boolean }[],
};

/* ============================================================
   POP-UP (Potenzialanalyse)
   ============================================================ */

/**
 * Abschnitt 14 des freigegebenen Dokuments. Überzeile, Überschrift,
 * Fließtext, die drei Feldnamen und beide Knopfbeschriftungen stehen dort
 * wörtlich. Ergänzt sind nur Bestätigung und Fehlermeldung — für die gibt
 * das Dokument nichts vor, und ohne sie hätte das Formular keinen Ausgang.
 */
export const popup = {
  /* Hier steht nur noch, was es AUSSERHALB eines Formulars gibt: die
     Überzeile, der Weg wieder hinaus und die Beschriftung des Kreuzes.

     Überschrift, Einleitung, Felder, Knopf, Hinweiszeile, Erfolgs- und
     Fehlermeldung kommen seit Fassung 1.8 aus `hero` — genau wie im
     Kontaktabschnitt. Eigene Schlüssel dafür wieder einzuführen hieße,
     die Drift von Neuem zu beginnen, die diese Fassung beendet: das
     Pop-up hatte drei Felder, wo die anderen fünf hatten, und nannte
     dasselbe Angebot anders. */
  eyebrow: "Bevor Sie weiterlesen",
  dismiss: "Später vielleicht",
  closeLabel: "Schließen",
};

/* ============================================================
   FUSSZEILE & STICKY
   ============================================================ */

export const footer = {
  blurb:
    "Digital Movement ist High-End Performance Marketing. Wir machen Websites zu Assets. Wir liefern qualifizierte Anfragen.",
  sections: [
    {
      title: "Leistungen",
      links: [
        { label: "SEO", href: "#services" },
        { label: "Google Ads", href: "#services" },
        { label: "Social Media", href: "#services" },
        { label: "Websites", href: "#services" },
      ],
    },
    {
      title: "Agentur",
      links: [
        { label: "Kundenprojekte", href: "#cases" },
        { label: "Kontakt", href: "#contact" },
        { label: "Sitemap", href: "/sitemap.xml" },
      ],
    },
    {
      title: "Kontakt",
      links: [
        { label: `Telefon: ${business.phone}`, href: business.phoneHref },
        { label: `WhatsApp: ${business.whatsapp}`, href: business.whatsappHref },
        { label: "E-Mail: office@digitalmovement.eu", href: "mailto:office@digitalmovement.eu" },
        { label: "Adresse: Kolonnenstraße 8, 10827 Berlin", href: "/impressum" },
      ],
    },
  ],
  rights: "© Digital Movement Germany. Alle Rechte vorbehalten.",
  legal: [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
  ],
};

export const sticky = {
  cta: "Kostenloses Erstgespräch",
};

/* ============================================================
   HÄUFIGE FRAGEN
   ============================================================ */

export const faqs = [
  {
    q: "Wie arbeiten SEO und GEO zusammen?",
    a: "SEO richtet Ihre Website auf klassische Suchergebnisse aus. GEO ergänzt diese Arbeit mit Blick auf Antworten in KI-Suchsystemen. Wir verbinden beides durch verständliche Inhalte, klare Seitenstrukturen und belegbare Aussagen über Ihr Angebot. Ziel ist, dass potenzielle Kunden Ihre Leistungen auch dann nachvollziehen können, wenn ihre Suche mit einer KI beginnt.",
  },
  {
    q: "Wie lange dauert es, bis ich etwas sehe?",
    a: "Das hängt vom Zustand Ihrer Website, vom Wettbewerb und vom Umfang der Maßnahmen ab. Im monatlichen Bericht sehen Sie, welche Arbeiten abgeschlossen wurden und welche Kundenanfragen eingegangen sind. So können Sie die Entwicklung nachvollziehen.",
  },
  {
    q: "Gibt es eine Mindestlaufzeit?",
    a: "Die Laufzeit vereinbaren wir im Angebot.",
  },
  {
    q: "Wie viel kostet eine SEO-Agentur?",
    a: "Die Kosten hängen vom Zustand Ihrer Website, Ihren Zielen und dem Umfang der Betreuung ab. Einzelne Seiten zu überarbeiten erfordert einen anderen Aufwand als eine umfangreiche Website neu aufzubauen. Nach der kostenlosen Analyse besprechen wir die sinnvollen Maßnahmen und die damit verbundenen Kosten. So können Sie das Angebot anhand konkreter Leistungen beurteilen.",
  },
  {
    q: "Garantieren Sie Platz 1 bei Google?",
    a: "Nein — und Vorsicht bei allen, die das tun: Niemand steuert Googles Ergebnisse, dieses Versprechen ist zum Brechen gebaut. Schriftlich zusagen können wir: die Suchbegriffe, auf die wir arbeiten, was jeden Monat passiert, und einen Bericht, der Ihren Stand bei jedem einzelnen zeigt.",
  },
  {
    q: "Wem gehören Website, Daten und Konten?",
    a: "Ihnen, vom ersten Tag an. Domain, Website, Google-Konten, Tracking — alles läuft auf Ihren Namen. Wenn Sie gehen, nehmen Sie alles mit.",
  },
  {
    q: "Mit welchen Branchen arbeiten Sie?",
    a: "Beratung, Handwerk, Praxen, Dienstleister, E-Commerce und B2B. Wenn Ihre Kunden bei Google oder in der KI-Suche nach Ihnen suchen, können wir helfen.",
  },
];

/* ============================================================
   BAUTEILE DES LANDING-PAGE-BLUEPRINTS
   ============================================================

   Die folgenden Blöcke stammen aus dem Hausstandard
   `Operations/Web Project Operating Process/landing-page-blueprint.md`
   („The Million-Dollar Landing Page“, übernommen 23.08.2026). Das
   freigegebene Copy-Dokument gibt für sie keinen Text vor — der Text
   hier ist deshalb ergänzt und als solcher gekennzeichnet, genau wie im
   Dateikopf beschrieben.

   Zwei Regeln des Blueprints greifen hier ausdrücklich nicht:
     · Kein Preis. Für Deutschland ist keiner freigegeben, und ein
       erfundener Preis ist schlechter als keiner. Die Vergleichstabelle
       läuft deshalb auf Leistungen, nicht auf Beträge.
     · Die Überschriften der bereits freigegebenen Abschnitte bleiben
       Aussagesätze statt Fragen. Der Blueprint verlangt Fragen, sein
       eigener Konfliktabschnitt stellt aber freigegebenen Text darüber.
       Nur die hier neu gebauten Blöcke tragen Frageüberschriften.
   ============================================================ */

/**
 * Blueprint 4 — der Antwortblock.
 *
 * 40 bis 60 Wörter, die für sich allein stehen: der Block, den eine KI
 * zitiert, wenn sie die Seite als Quelle nimmt. Gezählt sind es 52
 * Wörter. Er steht direkt unter dem Startbereich und ragt damit auf dem
 * Telefon in den ersten Bildschirm hinein.
 */
export const answerBlock = {
  question: "Was macht eine SEO-Agentur — und was bringt Ihnen das?",
  answer:
    "Eine SEO-Agentur verbessert die technischen Grundlagen, die Struktur und die Inhalte Ihrer Website. Wir prüfen, welche Fragen Ihre Seiten beantworten sollten und wie Interessenten anschließend Kontakt aufnehmen können. Im monatlichen Bericht sehen Sie, welche Arbeiten wir umgesetzt haben und welche Anfragen eingegangen sind.",
};

/**
 * Blueprint 5 — die Vertrauensleiste.
 *
 * Der Blueprint verlangt Kundenlogos. Wir haben keine Logodateien, für
 * die uns eine Freigabe vorliegt — also stehen hier die Namen der Kunden,
 * die weiter unten mit Projekt, Zahlen und Website ohnehin ausführlich
 * genannt werden. Ein echter Name ist besser als ein Logo, das wir nicht
 * verwenden dürfen, und besser als ein Platzhalter.
 */
export const trustBar = {
  label: "Kunden, die mit uns arbeiten",
  note: "Eine Auswahl aus 2026. Jedes Projekt weiter unten mit Zahlen und Website.",
  clients: caseStudies.map((c) => ({ name: c.client, place: c.location ?? c.industry })),
};

/**
 * Blueprint 6 — der Problemblock.
 *
 * In den Worten der Käuferin, nicht in unseren. Die vier Sätze sind die
 * Formulierungen, mit denen Inhaber anrufen; sie nehmen die Sprache des
 * freigegebenen Gründer-Abschnitts auf („Tausende pro Monat“,
 * „Eitelkeitsmetriken“, „keine Anfragen im Posteingang“).
 */
export const problem = {
  eyebrow: "Das Problem",
  question: "Warum bringt Ihr Marketing gerade keine Anfragen?",
  intro: "Vier Sätze, die wir am Telefon fast wörtlich immer wieder hören.",
  points: [
    {
      quote: "Wir zahlen jeden Monat, und ich weiß nicht, wofür.",
      body: "Die Rechnung kommt pünktlich. Der Bericht hat 30 Seiten. Die eine Zahl, die zählt, steht nirgends drin.",
    },
    {
      quote: "Die Reichweite steigt, im Posteingang liegt trotzdem nichts.",
      body: "Klicks, Impressionen, Follower — alles wächst. Anfragen von Menschen, die kaufen wollen, wachsen nicht mit.",
    },
    {
      quote: "Bei den Suchbegriffen, die zählen, sind wir nicht zu finden.",
      body: "Wer heute Ihre Leistung sucht, sieht auf Seite 1 den Wettbewerb. Sie stehen auf Seite 3, und dorthin scrollt niemand.",
    },
    {
      quote: "In ChatGPT taucht unser Name gar nicht erst auf.",
      body: "Immer mehr Menschen fragen erst die KI und dann erst Google. Wer dort nicht als Quelle zitiert wird, kommt in dieser Suche nicht vor.",
    },
  ],
  costLabel: "Was das kostet",
  cost: "Jeder Monat ohne Sichtbarkeit ist ein Monat, in dem jemand anders die Anfrage bekommt, die Ihre gewesen wäre. Das Geld ist dabei nicht das Teuerste — die verlorene Zeit ist es.",
};

/**
 * Blueprint 7 — der eine nächste Schritt.
 *
 * Der Lösungsteil endet auf genau einer Handlung. Die Leistungskacheln
 * darüber tragen je einen eigenen Knopf; dieser Block sagt, welcher
 * Schritt gemeint ist, wenn man sich nicht entscheiden will.
 */
export const solutionStep = {
  question: "Was ist der nächste Schritt?",
  body:
    "Einer. Sie fordern die kostenlose Analyse an. Wir sehen uns Ihre Website an und sagen Ihnen, was wir zuerst beheben würden — kostenlos, unverbindlich, ohne Verkaufsanruf.",
  cta: "Kostenlose Analyse anfordern",
  href: "#contact",
};

/**
 * Blueprint — häufige Fragen.
 *
 * Die Fragen unten in `faqs` standen schon im freigegebenen Dokument,
 * wurden bisher aber nirgends ausgespielt. Sie stehen jetzt sichtbar auf
 * der Seite und wortgleich im FAQPage-Schema.
 */
export const faqIntro = {
  eyebrow: "Häufige Fragen",
  headline: "Was fragen Inhaber uns vor dem Start?",
};

/**
 * Blueprint 11 — sichtbares Aktualisierungsdatum.
 *
 * Datum und Schema-Datum müssen übereinstimmen; `iso` ist deshalb die
 * einzige Quelle für beide. Wer die Seite ändert, ändert diese Zeile mit.
 */
export const lastUpdated = {
  iso: contentRevisions["/"],
  label: `Zuletzt aktualisiert am ${new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${contentRevisions["/"]}T00:00:00Z`))}`,
  note: "Verantwortlich für den Inhalt: Raoul Müller.",
};

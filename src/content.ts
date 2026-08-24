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
 * Version 1.2 · Stand 24.08.2026
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
  email: "office@digitalmovement.eu",
  emailHref: "mailto:office@digitalmovement.eu",
  phone: "+49 176 23296439",
  phoneHref: "tel:+4917623296439",
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
 * Zwei getrennte Nummern, kein Tippfehler: die eine wird als Telefon
 * beantwortet, die andere ist der WhatsApp-Account. Ein gemeinsamer Wert
 * hätte WhatsApp-Nachrichten an eine Nummer ohne WhatsApp geschickt.
 */
export const contactChannels = {
  phoneE164: "+4917623296439" as string | null,
  whatsappE164: "+4917682360647" as string | null,
  /** Wohin „Rückruf“ scrollt. */
  formTarget: "#contact",
};

export const navLinks = [
  { label: "Offer", href: "#services" },
  { label: "Über uns", href: "#founder" },
  { label: "Success Stories", href: "#cases" },
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
     Der Startbereich ist die 1:1-Übernahme von digitalmovement.uk
     (abgerufen 24.08.2026, Anweisung RMU: „Fully copy the hero … but all
     translated in German. Must all be identical.“). Aufbau, Reihenfolge
     und Gestaltung sind unverändert; übersetzt ist der Text.

     Drei Dinge weichen ab, jedes mit Grund:

     1. Der Preissatz der englischen Fassung („It starts from £495 a
        month“) fehlt. Für Deutschland ist kein Preis freigegeben. £495
        stehen zu lassen wäre falsch, umzurechnen hieße, einen Preis zu
        erfinden — beides schlechter als der Verzicht. Der zweite Teil
        des Satzes („you can leave whenever you like“) bleibt, er ist
        eine Aussage über die Vertragsbindung, keine über den Preis.
     2. Die Bewertungszahl ist „über 100“, nicht „102“. Die englische
        Seite nennt 102; freigegeben ist für die deutsche Seite die
        Angabe aus googleRating (5,0 / über 100). Die kleinere, belegte
        Zahl gewinnt.
     3. Das Etikett heißt „SEO-Agentur Deutschland“, nicht „… Berlin“.
        Die englische Fassung nennt das Land, nicht die Stadt; die Seite
        wirbt außerdem ausdrücklich mit Sichtbarkeit „in jeder relevanten
        Stadt“. Berlin steht im Impressum und in der Fußzeile.

     Der Bewertungsblock nennt weiterhin „Digital Movement Australia“ —
     genau wie die englische Seite. Die Bewertungen sind dort entstanden;
     sie einem deutschen Unternehmen zuzuschreiben, das es seit dem
     21.08.2026 gibt, wäre eine Falschangabe.
     ------------------------------------------------------------------ */

  /* Überzeile mit dem Strich davor („ilabel“ im englischen System). */
  label: "SEO-Agentur Deutschland",

  /* Die Überschrift ist zweiteilig, weil der letzte Teil den
     Farbverlaufs-Strich untergelegt bekommt. Er darf nicht umbrechen —
     deshalb steht das Satzzeichen mit im hervorgehobenen Teil. */
  /* Die Vorlage lautet „A UK SEO agency measured in enquiries." und steht
     dort in drei Zeilen. Der unbestimmte Artikel fehlt hier bewusst:
     „Eine SEO-Agentur, gemessen in Anfragen." misst bei 66 px 693 px und
     passt damit nicht in die 635 px breite Textspalte — die Überschrift
     bräuchte vier Zeilen und begänne mit einem Wort allein. Ohne den
     Artikel stehen dieselben drei Zeilen wie im Original, und die Aussage
     ist unverändert. Wirkung schlägt Wörtlichkeit.

     `headlineNoBreak` ist ein eigenes Feld, weil der Browser sonst am
     Bindestrich von „SEO-Agentur" umbricht; es bekommt white-space:nowrap. */
  headlineNoBreak: "SEO-Agentur,",
  headlineRest: " gemessen in ",
  headlineAccent: "Anfragen.",

  lede: "Wir machen deutsche Unternehmen bei Google und in KI-Antworten sichtbar — und machen daraus Anfragen. Jeden Monat sehen Sie in klarem Deutsch, was wir getan haben und was sich verändert hat. Und Sie können jederzeit aufhören.",

  /* Zeile „Gefunden werden bei“ mit den vier Marken. Die Dateinamen sind
     die Originaldateien der englischen Seite; sie liegen unter
     public/brand/hero-uk/logos/ und werden über import.meta.env.BASE_URL
     angesprochen, damit sie auch unter abweichendem Basispfad laden. */
  findLabel: "Gefunden werden bei",
  apps: [
    { key: "google", label: "Google", icon: "google.svg" },
    { key: "gemini", label: "Gemini", icon: "googlegemini.svg" },
    { key: "chatgpt", label: "ChatGPT", icon: "openai.svg" },
    { key: "claude", label: "Claude", icon: "claude.svg" },
  ],

  /* Belegzeile: Bewertungs-Pille + zwei Kennzahlen. */
  reviewsHref: googleRating.reviewsUrl,
  reviewsRating: "5,0",
  reviewsText: "· über 100 Bewertungen · Digital Movement Australia",
  stats: [
    { value: "300+", label: "Kunden" },
    /* Schmales Leerzeichen vor dem Prozentzeichen (U+202F): deutsche
       Rechtschreibung verlangt hier ein Leerzeichen, ein normales würde
       am Zeilenende umbrechen. */
    { value: "92 %", label: "Kundenbindung" },
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
  headlineMain: "Vier Services.",
  headlineSub: "Ein Ziel – Ihr Unternehmenswachstum.",
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
    promise:
      "Wir finden Ihre Zielgruppe. Unmittelbare Kundenanfragen und Sales-Gespräche für Ihren Vertrieb.",
    detail: "Zielgerichtete Kampagnen. Conversion-Tracking.",
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
  headlineMain: "Was wirklich zählt.",
  headlineSub: "Anfragen. Nicht Klicks.",
  intro: "Drei Zahlen aus laufenden Kunden. Gemessen. Nicht behauptet.",
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
  eyebrow: "Ihre ersten 90 Tage mit uns",
  headlineMain: "Fünf Meilensteine.",
  intro:
    "Verbindliche Meilensteine, professionelles Projektmanagement von Senior-Beratern.",
};

export const processSteps = [
  {
    n: "01",
    eta: "Tag 1",
    title: "Audit & Kickoff",
    body:
      "Diagnose Ihrer aktuellen SEO-Performance. Wettbewerbs-Analyse. Chancen für Umsatzwachstum mit einer neuen SEO-optimierten Webseite. 30 Minuten Screen-Share mit einem der Gründer.",
  },
  {
    n: "02",
    eta: "Tag 1–30",
    title: "Development",
    body:
      "Tiefenanalyse der relevanten Suchbegriffe Ihrer Zielgruppe. Erstellung der neuen Seiten für jeden der Suchbegriffe. Website-Design. Hochladen bei Google und Beginn des Rankings.",
  },
  {
    n: "03",
    eta: "Tag 30",
    title: "Launch",
    body:
      "Tracking live. Neue Zielseiten online. Die ersten Seiten fangen an, im Google-Ranking zu steigen.",
  },
  {
    n: "04",
    eta: "Tag 60",
    title: "Erste Seite-1-Platzierungen",
    body:
      "Erste kommerzielle Suchanfragen erreichen Seite 1. Pipeline füllt sich. Monatlicher Performance-Report.",
  },
  {
    n: "05",
    eta: "Tag 90",
    title: "8× Pipeline",
    body:
      "Gemessene Steigerung qualifizierter Anfragen. Ab hier monatliche Optimierung.",
  },
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
  headlineMain: "8x Umsatzwachstum unserer Kunden",
  headlineSub: "und mehr.",
  intro: "Eine Auswahl von Kunden aus dem Jahr 2026.",
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
    headline: "SEO-Architektur trägt das B2B-Pipeline-Wachstum",
    body:
      "Customer-Excellence-Plattform. Sunset-Hero plus Service-Karten. Die SEO-Architektur trägt das B2B-Pipeline-Wachstum.",
    metrics: [
      { value: "19", label: "Standortseiten" },
      { value: "Seite 1", label: "Google-Ranking" },
      { value: "2026", label: "Relaunch" },
    ],
    url: "https://cex.koeln",
  },
  {
    slug: "azura-living-bali",
    client: "Azura Living Bali",
    industry: "Villenvermietung",
    location: "Bali",
    services: ["SEO", "Webdesign"],
    timeline: "90 Tage",
    headline: "Von 0 auf Seite 1 in 90 Tagen",
    body:
      "Von 0 auf Seite 1 für „villa rental bali“ in 90 Tagen — kontinuierliche Direktbuchungen statt Plattform-Kommission.",
    metrics: [
      { value: "90", label: "Tage bis Seite 1" },
      { value: "Direkt", label: "Buchungen ohne Plattform" },
      { value: "0 %", label: "Plattform-Kommission" },
    ],
    url: "https://azuralivingbali.com",
  },
  {
    slug: "addressbali",
    client: "ADDRESSBALI",
    industry: "Premium-Villenmarke",
    location: "Bali",
    services: ["Webdesign", "Performance Marketing"],
    timeline: "2026",
    headline: "8× Anfragen-Pipeline",
    body:
      "Premium-Villenmarke. Komplettes Website-Re-Design plus Performance-Marketing-Sprint, 8× Anfragen-Pipeline.",
    metrics: [
      { value: "8×", label: "Anfragen-Pipeline" },
      { value: "Neu", label: "Website-Design" },
      { value: "2026", label: "Sprint" },
    ],
    url: "https://addressbali.com",
  },
  {
    slug: "cunos",
    client: "Cunos",
    industry: "Finanzberatung",
    location: "London",
    services: ["SEO", "Content", "Webdesign"],
    timeline: "5 Monate",
    headline: "5x mehr Beratungen über Google",
    body:
      "Die Marke hatte klare Expertise, aber zu wenig Sichtbarkeit. Wir bauten Themenautorität auf und lieferten neue Seiten für die richtigen Suchbegriffe.",
    metrics: [
      { value: "5x", label: "Beratungen" },
      { value: "7x", label: "Organischer Traffic" },
      { value: "#1", label: "12 wichtige Suchanfragen" },
    ],
    url: "https://cunos.co.uk",
  },
  {
    slug: "fantastic-finish",
    client: "Fantastic Finish",
    industry: "Gewerbereinigung",
    location: "Manchester",
    services: ["SEO", "Webdesign", "Google Ads"],
    timeline: "4 Monate",
    headline: "13x mehr Anfragen pro Monat",
    body:
      "Starke Bewertungen, aber kaum Präsenz in der Google-Suche, weil es für keine Leistung eine eigene Seite gab. Wir bauten die Website neu, optimierten für Google und KI-Suche, ordneten die Service-Struktur — und schon nach wenigen Wochen standen gewerbliche Suchbegriffe auf Google Platz 1.",
    metrics: [
      { value: "13x", label: "Mehr Anfragen" },
      { value: "60", label: "Tage bis Seite 1" },
      { value: "8x", label: "ROAS" },
    ],
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
  eyebrow: "Digital Movement vs. Andere",
  headlineMain: "Was wir anders machen.",
  headlineSub: "Sechs Punkte.",
  intro: "Damit Sie wissen, worauf Sie sich einlassen. Bevor Sie sich einlassen.",
  columns: { other: "Andere Agenturen", neo: "Digital Movement" },
  rows: [
    {
      topic: "Vertragslaufzeit",
      other: "12 oder 24 Monate, schwer zu beenden",
      neo: "90-Tage-Sprint, monatlich verlängerbar",
    },
    {
      topic: "Reporting",
      other: "Eitelkeitsmetriken in 30-seitigen PDFs",
      neo: "Anfragen, Umsatz, Quellen — eine Seite",
    },
    {
      topic: "Ansprechpartner",
      other: "Account-Manager, der Excel vorliest",
      neo: "Der Gründer, am Telefon",
    },
    {
      topic: "Preisgestaltung",
      other: "Stundensätze, Setup-Fees, Mehrkosten",
      neo: "Festpreis, alles inklusive, transparent",
    },
    {
      topic: "Ziel",
      other: "Mehr Klicks, mehr Reichweite",
      neo: "Mehr qualifizierte Anfragen",
    },
    {
      topic: "Lock-in",
      other: "Daten und Accounts beim Wechsel verloren",
      neo: "Sie besitzen alles vom ersten Tag",
    },
  ],
};

/* ============================================================
   SNAPSHOT
   ============================================================ */

export const snapshot = {
  title: "Snapshot",
  tagline: "Digital Movement in 30 Sekunden.",
  items: [
    {
      index: "01",
      label: "Was",
      headline: "Mehr Anfragen.",
      detail: "Sichtbarkeit in Google und ChatGPT.",
    },
    {
      index: "02",
      label: "Für wen",
      headline: "Inhaber & Mittelstand.",
      detail: "Beratung. Handwerk. Praxen. Dienstleister. E-Commerce. B2B.",
    },
    {
      index: "03",
      label: "Was Sie bekommen",
      headline:
        "Premium-Website. SEO-Pages, optimiert für KI-Suche. Monatliche Performance-Berichte.",
      detail:
        "Brandneues Premium-Website-Design, optimiert für Ranking auf Google Seite 1.",
    },
  ],
};

/* ============================================================
   GRÜNDER-NOTIZ
   ============================================================ */

export const founder = {
  eyebrow: "Eine Notiz vom Gründer",
  headlinePre: "Sie reden mit der Person,",
  headlineSoft: "die auch liefert.",
  paragraphs: [
    "Ich habe Digital Movement gegründet, weil ich es leid war. Gute Firmen zahlen Tausende pro Monat. Bekommen Eitelkeitsmetriken. Keine Anfragen im Posteingang. Das ändert sich hier.",
    "Bei Digital Movement: kein Account-Manager mit Excel. Sie kriegen mich am Hörer. Festpreis. Kein Lock-in. Ein 90-Tage-Sprint mit meinem Namen drauf.",
    "Klingt nach Ihrer Art? Schreiben Sie unten. Werktags antworte ich innerhalb 2 Stunden. Persönlich.",
  ],
  signature: "Raoul",
  signatureBlock: "Raoul Müller · Gründer, Digital Movement",
  photo: "brand/raoul-founder.png",
};

/* ============================================================
   KONTAKT
   ============================================================ */

export const contact = {
  eyebrow: "Schreiben Sie uns",
  headlinePre: "Lassen Sie uns",
  headlineSoft: "starten.",
  intro: "Kostenloses Erstgespräch. Werktags antworte ich innerhalb 2 Stunden. Persönlich.",
  form: {
    name: "Name",
    phone: "Telefonnummer",
    email: "E-Mail (optional)",
    company: "Unternehmen (optional)",
    message: "Was möchten Sie erreichen?",
    submit: "Nachricht senden",
    success: "Danke. Sie hören innerhalb 2 Stunden von mir.",
    sending: "Wird gesendet …",
    error:
      "Das hat nicht geklappt. Bitte rufen Sie uns an oder schreiben Sie an office@digitalmovement.eu.",
  },
  /* Auswahl im Formular. Die vier Services aus dem Dokument plus eine
     Option für alle, die sich noch nicht festlegen wollen. */
  serviceOptions: ["SEO", "Google Ads", "Social Media", "Website", "Noch unklar"],
  tiles: [
    { kicker: "Telefon", value: "+49 176 23296439", href: "tel:+4917623296439" },
    {
      kicker: "WhatsApp",
      value: "+49 176 82360647",
      href: "https://wa.me/4917682360647",
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
  eyebrow: "Bevor Sie weiterlesen",
  headline: "Kostenloses Audit Ihrer Website.",
  intro:
    "30 Minuten Walkthrough plus Ein-Seiten-Audit per E-Mail. Egal, ob wir zusammenarbeiten oder nicht.",
  fields: { name: "Name", phone: "Telefonnummer", email: "E-Mail" },
  submit: "Audit anfordern",
  sending: "Wird gesendet …",
  dismiss: "Später vielleicht",
  successTitle: "Danke — bis gleich.",
  successBody: "Sie hören innerhalb 2 Stunden von mir. Persönlich.",
  error:
    "Das hat nicht geklappt. Bitte rufen Sie uns an oder schreiben Sie an office@digitalmovement.eu.",
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
        { label: "Telefon: +49 176 23296439", href: "tel:+4917623296439" },
        { label: "WhatsApp: +49 176 82360647", href: "https://wa.me/4917682360647" },
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
    q: "Wie lange dauert es, bis ich etwas sehe?",
    a: "Erste Bewegung im Ranking oft in den ersten Wochen. Die ersten Seite-1-Platzierungen für kommerzielle Suchanfragen planen wir auf Tag 60, spürbar mehr Anfragen auf Tag 90. Was für Ihr Unternehmen realistisch ist, sagen wir Ihnen nach dem Audit — konkret, nicht als Spanne.",
  },
  {
    q: "Gibt es eine Mindestlaufzeit?",
    a: "Ein 90-Tage-Sprint, danach monatlich verlängerbar. Die 90 Tage stehen dort, weil die Aufbauarbeit — Analyse, neue Seiten, Technik — so lange braucht, bis sie messbar wird. Danach entscheiden Sie jeden Monat neu.",
  },
  {
    q: "Was kostet das?",
    a: "Ein Festpreis pro Monat, vor dem Start vereinbart, ohne Setup-Gebühr und ohne Nachforderungen. Die Höhe hängt von Ihrer Branche, Ihrer Region und dem Ziel ab. Eine echte Zahl bekommen Sie im Erstgespräch, keine Preisspanne von einer Webseite.",
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

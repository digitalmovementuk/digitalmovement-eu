import { Head } from "vite-react-ssg";

/**
 * Single source of truth for per-route metadata and structured data.
 *
 * Everything here is emitted into the pre-rendered HTML at build time, so a
 * crawler that never executes JavaScript still sees the right title,
 * description, canonical and schema for each route. Before pre-rendering,
 * every route shared the homepage's tags — which made them duplicates of
 * each other even once they returned 200.
 */

export const SITE_URL = "https://digitalmovement.eu";
export const OG_IMAGE = `${SITE_URL}/brand/og-cover.jpg`;

export function absoluteUrl(path: string): string {
  return path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

/* ------------------------------------------------------------------ *
 * Structured data
 *
 * Two rules govern everything below, both of them Google policy rather
 * than preference:
 *
 * 1. Never mark up a fact the page doesn't show. `aggregateRating` in
 *    particular triggers manual actions when it has no visible review
 *    content behind it.
 * 2. Never mark up a fact we don't actually have. Jeder Wert unten steht
 *    entweder so auch auf der Seite, oder er ist leer — und leere Werte
 *    fallen aus dem Markup heraus, statt erfunden zu werden.
 * ------------------------------------------------------------------ */

/** Leer lassen, solange keine echte Nummer existiert — leer heißt: nicht im Schema. */
export const TELEPHONE = "+4917623296439";

/**
 * Kein Handelsregister-Eintrag: Digital Movement Deutschland ist ein
 * Einzelunternehmen. Die Umsatzsteuer-ID liegt noch nicht vor — sobald sie
 * da ist, gehoert sie hierhin und ins Impressum, und zwar in beide.
 */
export const VAT_ID = "";

/**
 * Anschrift des Unternehmens — dieselbe, die das Impressum nennt.
 *
 * Eine Anschrift auszuzeichnen, die die Seite nirgends zeigt, verstößt gegen
 * dieselbe Google-Regel, die das aggregateRating gekostet hat: Nie etwas
 * auszeichnen, was die Seite nicht sagt. Die Lösung ist nicht, das Markup zu
 * verstecken, sondern die Anschrift zu zeigen — sie steht in der Fußzeile
 * jeder Seite. Das Markup wiederholt also nur sichtbaren Text.
 *
 * `areaServed` gehört daneben. Die Anschrift sagt, wo das Unternehmen sitzt;
 * areaServed sagt, wo es arbeitet — und das ist ganz Deutschland, nicht ein
 * Büro in Berlin-Schöneberg.
 *
 * ADDRESS_LINE ist die lesbare Form, die die Fußzeile ausgibt. Beide müssen
 * gleich bleiben: Ändert sich eine, muss die andere mit, sonst weicht das
 * Markup von dem ab, was auf der Seite steht.
 */
export const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Kolonnenstraße 8",
  addressLocality: "Berlin",
  postalCode: "10827",
  addressCountry: "DE",
};

export const ADDRESS_LINE = "Kolonnenstraße 8, 10827 Berlin, Deutschland";

/**
 * The registered company name, as it appears on the Companies Register.
 *
 * The site brands itself "Digital Movement" everywhere, and that is correct
 * for marketing. It is not correct on a legal page: the party bound by the
 * terms, the party that holds your personal information, and the party a
 * regulator or a customer would name in a complaint is the registered
 * company. The legal pages state both, so a reader can tell that the brand
 * they contacted and the entity on the register are the same business.
 */
export const LEGAL_ENTITY = "Digital Movement Deutschland · Raoul Müller";

/**
 * Die Bewertungen gehören der Gruppe, nicht der deutschen Einheit. Sie
 * wurden von einem anderen Standort erarbeitet, deshalb trägt der deutsche
 * Knoten keine eigene Bewertung — und im Markup steht überhaupt keine.
 * Die Zahlen hier steuern nur den sichtbaren Text auf der Seite.
 */
export const REVIEW_RATING = "5.0";
export const REVIEW_COUNT = "100";

/* Die Muttergesellschaft wird ausgezeichnet — die Verbindung ist eine echte
   Tatsache und darf im Markup stehen — aber OHNE aggregateRating.

   Eine AggregateRating über das eigene Unternehmen, ausgeliefert von der
   eigenen Domain, verstößt gegen Googles Richtlinie für strukturierte Daten
   und kann eine manuelle Maßnahme auslösen. Sie auf die Mutter zu schieben
   ändert daran nichts, weil sie weiterhin von unserer eigenen Domain kommt.

   Die Bewertungen bleiben auf der Seite SICHTBAR. Echte Bewertungen zu
   zeigen ist erlaubt und üblich; verboten ist nur das Markup dazu.
   REVIEW_RATING / REVIEW_COUNT werden deshalb weiter exportiert und steuern
   den Text — sie tauchen nur in keinem JSON-LD mehr auf.

   Der Name bleibt schlicht "Digital Movement", ohne Stadt und ohne Land, bis
   die richtige eingetragene Muttergesellschaft feststeht. parentOrganization
   ist eine Tatsachenbehauptung über die Konzernstruktur — eine falsche ist
   schlimmer als eine unbestimmte. */
const PARENT_ORG = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#parent-organization`,
  name: "Digital Movement",
};

export const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Digital Movement",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/brand/motif-positive.png`,
  image: OG_IMAGE,
  email: "hallo@digitalmovement.eu",
  address: POSTAL_ADDRESS,
  parentOrganization: PARENT_ORG,
  sameAs: [],
  ...(TELEPHONE ? { telephone: TELEPHONE } : {}),
  ...(VAT_ID ? { vatID: VAT_ID } : {}),
};

export const LOCAL_BUSINESS = {
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#localbusiness`,
  name: "Digital Movement",
  description:
    "Digital Movement Deutschland: SEO, GEO (KI-Suche), Google Ads, Social Media und High-End Website-Entwicklung.",
  url: `${SITE_URL}/`,
  image: OG_IMAGE,
  email: "hallo@digitalmovement.eu",
  address: POSTAL_ADDRESS,
  parentOrganization: { "@id": `${SITE_URL}/#parent-organization` },
  areaServed: { "@type": "Country", name: "Deutschland" },
  ...(TELEPHONE ? { telephone: TELEPHONE } : {}),
  ...(VAT_ID ? { vatID: VAT_ID } : {}),
};

export const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "Digital Movement",
  publisher: { "@id": `${SITE_URL}/#organization` },
  inLanguage: "de-DE",
};

/** Breadcrumbs for any route. Home is always the first crumb. */
export function breadcrumbs(trail: Array<{ name: string; path: string }>) {
  const items = [{ name: "Startseite", path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Human service names, keyed by route slug.
 *
 * The content file's `hero.headlineTop` is marketing copy ("Google Page 1",
 * "More net profit"), not a service name, so it can't be used here — a
 * Service node called "More net profit" tells a search engine nothing.
 */
export const SERVICE_NAMES: Record<string, string> = {
  seo: "SEO",
  geo: "GEO — Optimierung für KI-Suche",
  "google-ads": "Google Ads",
  "social-media": "Social Media Marketing",
  "web-design": "High-End Website-Entwicklung",
};

/** Service schema for a service page. */
export function serviceSchema(opts: { name: string; description: string; path: string }) {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(opts.path)}#service`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    serviceType: opts.name,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Deutschland" },
  };
}

/**
 * FAQPage built from the questions actually rendered on the page.
 * Called only where ServicePageShell renders content.faq.items — marking up
 * questions that aren't visible is the same policy breach as a phantom
 * rating.
 */
export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/* ------------------------------------------------------------------ */

type SeoProps = {
  title: string;
  description: string;
  /** Route path, e.g. "/" or "/services/seo". Drives canonical + og:url. */
  path: string;
  noindex?: boolean;
  /** Retired URL: emit a meta refresh to this path. Use with `noindex`. */
  metaRefresh?: string;
  /**
   * Route-specific schema nodes (Service, FAQPage, BreadcrumbList, ...).
   * ORGANIZATION, WEBSITE, LOCAL_BUSINESS and a per-route WebPage node are
   * added automatically by <Seo> itself — every route gets them, so no call
   * site needs to remember to. Gate item S2.4.
   */
  schema?: object[];
};

export function Seo({ title, description, path, noindex, metaRefresh, schema }: SeoProps) {
  const url = absoluteUrl(path);

  /**
   * WebPage node for this route, carrying `dateModified`.
   *
   * Sourced from __BUILD_DATE__ — the compile-time constant vite.config.ts
   * bakes in from the machine clock at build time — rather than any
   * hand-authored string. Gate item E1.16 exists to catch exactly that: a
   * "last updated" string someone typed once and never touched again. The
   * build date can't drift from reality because it's regenerated by the
   * build itself every time.
   */
  const page = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: title,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    dateModified: __BUILD_DATE__,
  };

  /**
   * Sitewide nodes, present in the @graph on every single route — not just
   * the /seo pages, which is all that carried a graph before. Gate item
   * S2.4. Connected by @id rather than left as a bag of loose nodes:
   * WEBSITE.publisher already points at ORGANIZATION, `page.isPartOf` above
   * points at WEBSITE, and serviceSchema/seoPageSchema's `provider` already
   * points at ORGANIZATION too.
   *
   * LOCAL_BUSINESS trägt die Anschrift aus POSTAL_ADDRESS. Erlaubt ist das
   * nur, weil dieselbe Anschrift in der Fußzeile jeder Seite steht. Den
   * Knoten wegzulassen wäre auch teuer: Für eine LocalBusiness ohne
   * `address` gibt Google keine lokalen Rich Results, auch nicht anteilig.
   *
   * Ehrlich bleibt das durch `areaServed: Deutschland` daneben — das eine
   * sagt, wo das Unternehmen sitzt, das andere, wo es arbeitet. Ein
   * Dienstleister mit Einzugsgebiet soll beides angeben.
   *
   * `telephone` kommt aus TELEPHONE und wird nur ausgegeben, wenn dort eine
   * echte Nummer steht. Ist das Feld leer, fehlt es im Markup — erfunden
   * wird an dieser Stelle nichts.
   */
  const graph = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [ORGANIZATION, WEBSITE, LOCAL_BUSINESS, page, ...(schema ?? [])],
  });

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex,follow" /> : null}
      {/* Static hosting cannot return a 301, so a retired URL says so in the
          pre-rendered head. Crawlers treat an instant meta refresh as a
          redirect signal, and it works without JavaScript. */}
      {metaRefresh ? <meta httpEquiv="refresh" content={`0; url=${metaRefresh}`} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Digital Movement" />
      <meta property="og:locale" content="de_DE" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:alt" content="Digital Movement — SEO, GEO und High-End Websites" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      <script type="application/ld+json">{graph}</script>
    </Head>
  );
}

import { hero } from "../content";

/**
 * Die gemeinsame Logik der Anfrageformulare.
 * Version 1.1 · Stand 24.08.2026
 *
 * Änderungen 1.1 (24.08.2026): `LEAD_FIELDS` ergänzt und das Pop-up
 * angeschlossen. Auf Weisung RMU: „The pop up contact form has to be
 * synced and aligned as well." Aus zwei Formularen sind drei geworden.
 *
 * Auf Weisung RMU (24.08.2026): „Make sure the data fields and content of
 * contact form at bottom of page is synced with contact form in hero."
 *
 * Gleiche Felder allein reichen dafür nicht. Zwei Formulare, die heute
 * zufällig dieselben Beschriftungen tragen, sind in vier Wochen zwei
 * verschiedene Formulare — genau so ist der Zustand entstanden, den diese
 * Datei auflöst (unten Unternehmen und Freitext, oben Website; unten
 * „Leistung", oben „Was soll am meisten wachsen?"; unten „Nachricht
 * senden", oben „Kostenlose Analyse anfordern").
 *
 * Deshalb liegt hier alles, was beide Formulare gleich machen müssen, und
 * beide holen es sich von hier: Prüfung, Fehlertexte, Reihenfolge der
 * Felder und die Art, wie die Website in den Nutzdatensatz kommt. Die
 * Beschriftungen selbst stehen einmal in `hero` in content.ts.
 */

/**
 * Die fünf Felder, die auf JEDEM Anfrageformular stehen — in dieser
 * Reihenfolge, mit diesen Namen, mit diesen Pflichtangaben.
 *
 * Diese Liste ist die Festlegung, nicht die Darstellung. Das Pop-up
 * zeichnet seine Felder direkt daraus. Startbereich und Kontaktabschnitt
 * haben eigene Auszeichnung — der Startbereich hängt an hero-uk.css und
 * ist die 1:1-Übernahme der englischen Seite, der Kontaktabschnitt steht
 * auf Weiß statt auf Dunkel. Beide werden deshalb nicht daraus gezeichnet,
 * sondern dagegen GEPRÜFT: `scratchpad/formsync.mjs` liest alle drei
 * Formulare aus dem laufenden Browser und vergleicht Namen, Reihenfolge
 * und Pflichtangaben mit dieser Liste. Ein Formular, das abweicht, fällt
 * dort auf, statt monatelang unbemerkt zu driften.
 *
 * `key` zeigt in `hero.fields` (Beschriftung und Platzhalter stehen dort,
 * damit derselbe Wortlaut überall greift). `name` ist das, was beim
 * Endpunkt ankommt — und heißt bei der Website absichtlich `site`: ein
 * Feld namens `website` liest der gemeinsame Endpunkt als Honigtopf und
 * verwirft die Anfrage still.
 */
export const LEAD_FIELDS = [
  { key: "name", name: "name", type: "text", autoComplete: "name", required: true, half: true },
  { key: "phone", name: "phone", type: "tel", inputMode: "tel", autoComplete: "tel", required: true, half: true },
  { key: "email", name: "email", type: "email", autoComplete: "email", required: false, half: true },
  { key: "website", name: "site", type: "url", inputMode: "url", autoComplete: "url", required: true, half: true },
  { key: "service", name: "service", type: "select", required: true, half: false },
] as const;

export type LeadFieldKey = (typeof LEAD_FIELDS)[number]["key"];

/** Die vier Felder, die eine Anfrage blockieren können. */
export type LeadFieldErrors = {
  name?: string;
  phone?: string;
  website?: string;
  consent?: string;
};

/**
 * Reihenfolge für den Sprung zum ersten fehlenden Feld. Auf dem Telefon
 * steht der Fehler sonst außerhalb des Bildschirms und das Formular
 * wirkt, als sei der Knopf kaputt.
 */
export const LEAD_FIELD_ORDER = ["name", "phone", "website", "consent"] as const;

/**
 * Der Endpunkt bekommt die Adresse als Text. Ohne Schema ist
 * „ihrefirma.de" für jedes spätere Werkzeug ein relativer Pfad, nicht
 * eine Website — deshalb hier einmal sauber ergänzen statt später raten.
 */
export function normaliseUrl(raw: string): string {
  const v = raw.trim();
  if (!v) return v;
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

/**
 * `LeadPayload` kennt kein Feld `website`. Die Adresse wandert deshalb in
 * `message`. Ein neues Feld zu erfinden hieße, es an einem Endpunkt
 * vorbeizuschicken, der es nicht liest.
 */
export function websiteMessage(website: string): string {
  return `Website: ${normaliseUrl(website)}`;
}

/** Telefon ist Pflicht, E-Mail optional — auf jedem Formular jeder Seite. */
export function validateLead(v: {
  name: string;
  phone: string;
  website: string;
  consent: boolean;
}): LeadFieldErrors {
  const next: LeadFieldErrors = {};
  if (!v.name.trim()) next.name = hero.errRequiredName;
  if (!v.phone.trim()) next.phone = hero.errRequiredPhone;
  if (!v.website.trim()) next.website = hero.errRequiredWebsite;
  if (!v.consent) next.consent = hero.errConsent;
  return next;
}

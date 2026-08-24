import { hero } from "../content";

/**
 * Die gemeinsame Logik der beiden Anfrageformulare.
 * Version 1.0 · Stand 24.08.2026
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

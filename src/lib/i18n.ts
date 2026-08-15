import { comparison, founder, processIntro, processSteps, snapshot } from "../content";

/**
 * Die Seite ist einsprachig deutsch. Es gibt keine Umschaltung, keinen
 * gespeicherten Wert und keinen Provider — nur eine Funktion, die die
 * Textbausteine liefert.
 *
 * Sie existiert trotzdem, weil vier Bauteile (Snapshot, Prozess, Vergleich,
 * Gründer-Notiz) aus dem Vorgängerprojekt übernommen wurden und dort
 * `useT()` benutzen. Sie hier unverändert weiterlaufen zu lassen ist
 * risikoärmer, als in jedem von ihnen die Datenquelle umzuschreiben.
 *
 * Der einzige Ort, an dem Text steht, bleibt src/content.ts. Diese Datei
 * sortiert ihn nur um.
 */

const t = {
  snapshot,
  comparison,
  founder,
  process: {
    eyebrow: processIntro.eyebrow,
    headlineMain: processIntro.headlineMain,
    /* Das Dokument gibt für den Prozess keine zweite Zeile vor. Leer
       lassen statt erfinden — die Bauteile rendern sie dann nicht. */
    headlineSub: "",
    intro: processIntro.intro,
    steps: processSteps,
  },
};

export type Translations = typeof t;

export function useT(): Translations {
  return t;
}

/** Für Aufrufer außerhalb von React-Komponenten. */
export const translations = t;

/**
 * Die Sprache ist fest. Der Haken bleibt trotzdem stehen, weil die
 * übernommenen Bauteile ihn abfragen — sie sollen dabei immer "de"
 * bekommen und nie in einen halb englischen Zustand kippen.
 */
export function useLang(): { lang: "de" } {
  return { lang: "de" };
}

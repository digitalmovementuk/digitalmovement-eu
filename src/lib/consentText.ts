import { business } from "../content";

/**
 * Der Einwilligungstext — an einer Stelle, für alle Formulare.
 *
 * Der langweilige Grund: drei handgeschriebene Kopien eines Rechtstextes
 * werden zu drei verschiedenen Rechtstexten. Der tragende Grund: genau
 * dieser Satz wird als `consent_text` mit der Anfrage übertragen und ist
 * damit der Nachweis der Einwilligung. Der Satz, den die Besucherin
 * gelesen hat, und der Satz, den wir als Beleg aufbewahren, müssen
 * derselbe Satz sein — nicht zwei, die heute zufällig gleich lauten.
 *
 * Plain TypeScript, kein JSX: submitLead.ts importiert von hier, und ein
 * Lead-Modul soll nicht React mitziehen müssen.
 */

/** Wie lange eine Anfrage aufbewahrt wird. Wird genannt, also muss es stimmen. */
export const RETENTION = "24 Monate";

/** Der exakte Satz, dem zugestimmt wird. Geht als `consent_text` mit. */
export const CONSENT_TEXT =
  "Ich bin damit einverstanden, dass meine Angaben zur Beantwortung meiner Anfrage gespeichert und verarbeitet werden.";

/** Wer die Daten verarbeitet — für die Hinweistexte unter den Formularen. */
export const CONTROLLER = business.name;

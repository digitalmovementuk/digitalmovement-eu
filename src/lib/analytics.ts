/** The shared engine is loaded synchronously from /analytics-consent.js. */
export const CONSENT_KEY = "dm-eu-consent-v2";
export const CONSENT_DECIDED_EVENT = "dm:consent-decided";
export type ConsentValue = { analytics: boolean; ts: string; version: string };
type ConsentEngine = {
  read: () => ConsentValue | null;
  choose: (analytics: boolean) => ConsentValue;
  clear: () => void;
  enable: () => void;
  track: (name: string, parameters?: Record<string, unknown>) => boolean;
};
function engine(): ConsentEngine | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { DMAnalyticsConsent?: ConsentEngine }).DMAnalyticsConsent;
}
export function readConsent(): ConsentValue | null { return engine()?.read() ?? null; }
export function writeConsent(analytics: boolean) { return engine()?.choose(analytics) ?? null; }
export function clearConsent() { engine()?.clear(); }
export function enableAnalytics() { engine()?.enable(); }
export function initAnalyticsFromStoredConsent() { engine()?.enable(); }
export function trackAnalytics(name: string, parameters: Record<string, unknown>) {
  return engine()?.track(name, parameters) ?? false;
}

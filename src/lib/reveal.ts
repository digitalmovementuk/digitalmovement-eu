import { useEffect } from "react";

/* Einblenden beim Scrollen — ein Effekt für die ganze Seite.
   Jedes Element mit data-reveal startet unsichtbar (nur wenn <html class="js">,
   also nur wenn JavaScript läuft) und bekommt .is-in, sobald es in den
   Bildschirm rückt. Kinder eines data-reveal-group-Elements folgen sich in
   70-ms-Schritten, höchstens 280 ms. Der Startbereich trägt kein data-reveal:
   die Überschrift ist das größte Bild der Seite und darf nicht auf ein
   Skript warten. Unter prefers-reduced-motion bleibt alles sofort sichtbar
   (Regel in index.css). */
const STEP = 70;
const MAX = 280;

export function useReveal(dep: unknown) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");
    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }
    document.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
      let i = 0;
      group.querySelectorAll<HTMLElement>(":scope > [data-reveal], :scope > * > [data-reveal]").forEach((el) => {
        el.style.setProperty("--d", `${Math.min(i * STEP, MAX)}ms`);
        i += 1;
      });
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)");
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

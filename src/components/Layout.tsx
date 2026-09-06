import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Head } from "vite-react-ssg";
import manropeUrl from "@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2?url";
import { useReveal } from "../lib/reveal";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";

/* Ein fester Layer (die Leiste) plus die Cookie-Karte, bis entschieden ist.
   Sticky-CTA, Bewertungs-Badge und Pop-up sind seit dem Design-Audit vom
   04.09.2026 entfernt: drei Überlagerungen deckten auf dem Telefon ein
   Viertel des Bildschirms ab. */
export function Layout() {
  const { pathname, hash } = useLocation();
  useReveal(pathname);

  useEffect(() => {
    if (hash) {
      const id = hash.replace(/^#/, "");
      const raf = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      });
      return () => cancelAnimationFrame(raf);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <>
      <Head>
        <link rel="preload" as="font" type="font/woff2" href={manropeUrl} crossOrigin="anonymous" />
      </Head>
      <Nav />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}

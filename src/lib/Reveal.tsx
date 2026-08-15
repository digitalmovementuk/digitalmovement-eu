import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
};

// On mobile screens the staggered opacity 0 → 1 fade-ins across every
// section read as "components popping in" rather than animating in. We
// downgrade to a tiny y-translate (no opacity) so the reveal is felt rather
// than seen — desktop keeps the full editorial fade.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);
  return isMobile;
}

/**
 * WICHTIG — warum hier nur EIN Element steht und `opacity` immer im Ziel:
 *
 * Diese Seite wird vorgerendert (vite-react-ssg). Dabei gibt es kein
 * `window`, also ist `isMobile` beim Erzeugen des HTML immer false und
 * `useReducedMotion()` immer false: im ausgelieferten HTML steht die
 * Desktop-Fassung mit `style="opacity:0"`.
 *
 * Kippt einer der beiden Werte erst nach dem ersten Rendern — und genau das
 * passiert auf jedem Telefon — und führt das zu einem anderen Zweig, dann
 * schreibt niemand diese Eigenschaft je zurück: React kennt den Stil nicht
 * (framer-motion hat ihn gesetzt), und framer-motion animiert ihn im neuen
 * Zweig nicht mehr. Das Element bleibt für immer unsichtbar.
 *
 * Am 15.08.2026 waren dadurch auf digitalmovement.eu bei 390 px Breite
 * **32 Textblöcke unsichtbar** — praktisch jede Überschrift und jeder
 * Einleitungssatz unterhalb des ersten Bildschirms. Die Seite war live.
 *
 * Deshalb: ein einziges `motion.div` für alle Fälle, und `opacity: 1` steht
 * in jedem Animationsziel. Auch wenn ein Zweig nach dem Rendern kippt, wird
 * der Wert beim Einblenden überschrieben.
 */
export function Reveal({ children, delay = 0, y = 22, className }: Props) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();

  if (reduce) {
    // Explizit gesetzt, damit React den Stil selbst schreibt und ein von
    // framer-motion hinterlassenes opacity:0 überschreibt.
    return (
      <div className={className} style={{ opacity: 1, transform: "none" }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? Math.min(y, 12) : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: isMobile ? "-40px" : "-80px" }}
      transition={{
        duration: isMobile ? 0.4 : 0.55,
        delay: isMobile ? Math.min(delay, 0.05) : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

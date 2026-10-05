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

/** Keep server-rendered content visible before JavaScript and scroll observers run. */
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
      initial={false}
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

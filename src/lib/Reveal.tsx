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

export function Reveal({ children, delay = 0, y = 22, className }: Props) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  if (isMobile) {
    return (
      <motion.div
        className={className}
        initial={{ y: Math.min(y, 12) }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: Math.min(delay, 0.05), ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Bottom-centred sticky CTA bar.
 *
 * Light "frozen glass" pill (white/85 + backdrop-blur), centre-aligned, with
 * a plum-tinted ring pulse on both the bar and its inner CTA (synced 2.4s
 * beat). Only blends in once the user has scrolled the hero out of view —
 * the hero already has its own "Start" CTA, so showing this bar over the
 * hero would be redundant. Fades back out reversely when the user scrolls
 * up and the hero re-enters the viewport.
 */
export function StickyCTA() {
  const [show, setShow] = useState(false);

  // The bar fades in once the Metrics ("The numbers") section is
  // approaching, then fades back out as the Contact form approaches the
  // viewport — at that point the form's own primary CTA takes over, so
  // the sticky duplicate would be redundant. Reverses on scroll up.
  useEffect(() => {
    const metrics = document.getElementById("metrics");
    const contact = document.getElementById("contact");
    if (!metrics) return;
    const onScroll = () => {
      const vh = window.innerHeight;
      const metricsRect = metrics.getBoundingClientRect();
      const pastMetricsThreshold = metricsRect.top < vh * 0.6;
      // Hide while the contact form is approaching/visible (contact top
      // has crossed the lower half of the viewport from the bottom).
      const contactApproaching = contact
        ? contact.getBoundingClientRect().top < vh * 0.65
        : false;
      setShow(pastMetricsThreshold && !contactApproaching);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Outer wrapper handles fixed positioning + horizontal centring (CSS only).
  // Inner motion.div is the only thing framer-motion writes a transform to,
  // so the centring isn't clobbered when y/opacity animate.
  return (
    <div
      aria-hidden={!show}
      className="flex fixed inset-x-0 bottom-4 sm:bottom-6 z-40 justify-center px-4 pointer-events-none"
    >
      <motion.div
        initial={false}
        animate={
          show
            ? { opacity: 1, y: 0, pointerEvents: "auto" }
            : { opacity: 0, y: 24, pointerEvents: "none" }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center justify-center gap-3 sm:gap-5 rounded-full bg-white/85 backdrop-blur-xl pl-5 sm:pl-7 pr-2 sm:pr-3 py-2 sm:py-3 border border-white/55 animate-pulse-bar"
      >
        <p className="text-[13px] sm:text-[14.5px] font-semibold text-ink leading-tight whitespace-nowrap">
          Unverbindlich,{" "}
          <span className="hidden sm:inline text-ink-muted font-medium">und kostenlos</span>
        </p>
        {/* Root-relative, not a bare "#contact": this bar rides every page,
            and the contact section only exists on the homepage. A bare hash
            was a dead jump on all 46 other pages. */}
        <a
          href="/#contact"
          tabIndex={show ? 0 : -1}
          className="relative inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-[13.5px] sm:text-[15px] px-5 sm:px-7 py-2.5 sm:py-3.5 transition-colors animate-pulse-plum whitespace-nowrap"
        >
          Kostenloses Erstgespräch <ArrowRight size={14} strokeWidth={2.4} />
        </a>
      </motion.div>
    </div>
  );
}

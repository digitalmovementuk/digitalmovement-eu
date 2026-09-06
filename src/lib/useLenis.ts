import { useEffect } from "react";
import Lenis from "lenis";

const NAV_OFFSET = 72; // matches md+ nav height; mobile nav is 64 — close enough.

type IdleHandle = number;
type IdleCallback = () => void;
const onIdle = (cb: IdleCallback): IdleHandle => {
  const w = window as unknown as {
    requestIdleCallback?: (cb: IdleCallback, opts?: { timeout: number }) => IdleHandle;
  };
  if (typeof w.requestIdleCallback === "function") {
    return w.requestIdleCallback(cb, { timeout: 1200 });
  }
  return window.setTimeout(cb, 200) as unknown as IdleHandle;
};
const cancelIdle = (h: IdleHandle) => {
  const w = window as unknown as { cancelIdleCallback?: (h: IdleHandle) => void };
  if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(h);
  else window.clearTimeout(h as unknown as number);
};

export function useLenis() {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let lenis: Lenis | undefined;
    let raf = 0;
    let onAnchorClick: ((e: MouseEvent) => void) | undefined;

    // Defer the smooth-scroll setup until the browser is idle. On mobile this
    // shaves real time off TTI — Lenis hooks wheel + touch events and starts
    // a RAF loop, which would otherwise compete with React's first render.
    const idleHandle = onIdle(() => {
      lenis = new Lenis({
        // Wheel feels snappy at ~0.85s; anchor jumps use a slightly longer
        // duration explicitly inside scrollTo() so long jumps don't blur.
        duration: 0.85,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      const tick = (time: number) => {
        lenis!.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // Lenis doesn't intercept hash-anchor clicks by default — without this,
      // <a href="#section"> jumps instantly (browser-native), bypassing the
      // smooth scroll. Route through lenis.scrollTo with the nav offset so
      // the target lands flush below the fixed bar.
      onAnchorClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        const anchor = target?.closest?.("a") as HTMLAnchorElement | null;
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return;
        if (anchor.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const el = document.getElementById(href.slice(1));
        if (!el) return;
        e.preventDefault();
        lenis!.scrollTo(el, { offset: -NAV_OFFSET, duration: 1.1 });
        if (history.replaceState) history.replaceState(null, "", href);
      };
      document.addEventListener("click", onAnchorClick);
    });

    return () => {
      cancelIdle(idleHandle);
      cancelAnimationFrame(raf);
      lenis?.destroy();
      if (onAnchorClick) document.removeEventListener("click", onAnchorClick);
    };
  }, []);
}

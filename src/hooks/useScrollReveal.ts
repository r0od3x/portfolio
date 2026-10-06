import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Batches every `.reveal-fade` element in the document into a single
 * ScrollTrigger pass so simple fade/rise reveals don't each pay for their
 * own trigger + observer. Call once at the app root after the full tree
 * (including lazy content) has mounted.
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = gsap.utils.toArray<HTMLElement>(".reveal-fade");

    if (reduced) {
      els.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      return;
    }

    gsap.set(els, { opacity: 0, y: 28 });

    const batch = ScrollTrigger.batch(els, {
      start: "top 90%",
      once: true,
      onEnter: (batchEls) =>
        gsap.to(batchEls, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
        }),
    });

    ScrollTrigger.refresh();

    return () => {
      batch.forEach((b) => b.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

import { useEffect, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

export const C = {
  line: "#2a3150",
  fg: "#e6e9f0",
  fg2: "#9aa3b7",
  fg3: "#5e6880",
  accent: "#a78bfa",
  accent2: "#22d3ee",
  ink2: "#0f1320",
};

type Selector = (selector: string) => Element[];

/**
 * Shared choreography for project figures.
 * Intro (once, on first view): `.fig-draw` strokes draw in, `.fig-pop` pieces
 * pop, `.fig-text` fades up, `.fig-bar` grows from the left.
 * Then an optional looping timeline runs, paused whenever the figure is
 * off-screen so idle figures cost nothing.
 */
export function useFigure(
  ref: RefObject<SVGSVGElement | null>,
  buildLoop?: (q: Selector, root: SVGSVGElement) => gsap.core.Timeline
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root) as Selector;
      const intro = gsap
        .timeline({ paused: true })
        .from(q(".fig-draw"), { drawSVG: "0%", duration: 1.3, stagger: 0.05, ease: "power2.inOut" })
        .from(
          q(".fig-pop"),
          {
            autoAlpha: 0,
            scale: 0.3,
            transformOrigin: "50% 50%",
            duration: 0.6,
            stagger: { each: 0.008, from: "random" },
            ease: "back.out(2)",
          },
          0.1
        )
        .from(q(".fig-text"), { autoAlpha: 0, y: 6, duration: 0.6, stagger: 0.015 }, 0.25)
        .from(q(".fig-bar"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.1, stagger: 0.06 }, 0.5);

      const loop = buildLoop?.(q, root);
      loop?.pause();

      let introDone = false;
      intro.eventCallback("onComplete", () => {
        introDone = true;
        if (st.isActive) loop?.play();
      });

      const st = ScrollTrigger.create({
        trigger: root,
        start: "top 85%",
        end: "bottom top",
        onToggle: (self) => {
          if (self.isActive) {
            if (!introDone) intro.play();
            else loop?.play();
          } else {
            loop?.pause();
          }
        },
      });
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

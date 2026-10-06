import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type ScrambleTextProps = {
  children: string;
  as?: ElementType;
  className?: string;
  chars?: string;
  duration?: number;
  delay?: number;
  /** Start on scroll (default) or immediately on mount. */
  trigger?: "scroll" | "mount";
};

/** Text that decodes itself from random glyphs, terminal-style. */
export function ScrambleText({
  children,
  as: Tag = "span",
  className = "",
  chars = "01<>/_#*+=",
  duration = 1.1,
  delay = 0,
  trigger = "scroll",
}: ScrambleTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const text = children;
    const tween = gsap.fromTo(
      el,
      { scrambleText: { text: " ", chars } },
      {
        scrambleText: { text, chars, revealDelay: 0.25, speed: 0.6 },
        duration,
        delay,
        ease: "none",
        paused: trigger === "scroll",
      }
    );

    const st =
      trigger === "scroll"
        ? ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => tween.play() })
        : undefined;

    return () => {
      st?.kill();
      tween.kill();
      el.textContent = text;
    };
  }, [children, chars, duration, delay, trigger]);

  // aria-label keeps the real text available while the visible glyphs scramble.
  return createElement(Tag, { ref, className, "aria-label": children }, children);
}

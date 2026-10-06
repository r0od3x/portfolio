import { createElement, useEffect, useRef, type ElementType } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";

type RevealTextProps = {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  start?: string;
  stagger?: number;
};

/**
 * Characters rise out of per-line masks when the element scrolls into view.
 * autoSplit re-splits after web fonts load and on resize, so line breaks
 * are always measured against the real font.
 */
export function RevealText({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  start = "top 88%",
  stagger = 0.014,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const split = SplitText.create(el, {
      type: "lines,words,chars",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.chars, {
          yPercent: 115,
          rotate: 7,
          transformOrigin: "0% 100%",
          duration: 0.95,
          ease: "power4.out",
          stagger,
          delay,
          scrollTrigger: { trigger: el, start, once: true },
        }),
    });

    return () => split.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createElement(Tag, { ref, className }, children);
}

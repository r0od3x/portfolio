import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
  /** When provided, counting waits until this is true (e.g. after the intro). */
  waitFor?: boolean;
  delay?: number;
};

export function AnimatedCounter({
  value,
  suffix = "",
  decimals,
  className = "",
  waitFor,
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const places = decimals ?? (value % 1 !== 0 ? 1 : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || waitFor === false) return;
    if (prefersReducedMotion()) {
      el.textContent = value.toFixed(places) + suffix;
      return;
    }

    const counter = { val: 0 };
    const tween = gsap.to(counter, {
      val: value,
      duration: 1.8,
      delay,
      ease: "power2.out",
      paused: true,
      onUpdate: () => {
        el.textContent = counter.val.toFixed(places) + suffix;
      },
    });

    // Gated counters (hero) start with their intro; the rest start on scroll.
    const st =
      waitFor === true
        ? (tween.play(), undefined)
        : ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => tween.play() });

    return () => {
      st?.kill();
      tween.kill();
    };
  }, [value, suffix, places, waitFor, delay]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const SEEN_KEY = "mrg-intro-seen";

function introSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

type PreloaderProps = {
  /** The page underneath can start its intro (fires as the panel lifts). */
  onReveal: () => void;
  /** The preloader has fully left the screen and can be unmounted. */
  onDone: () => void;
};

/**
 * A big counter that runs to 100, then the whole panel lifts off the page.
 * Plays once per browser session; skipped for reduced motion.
 */
export function Preloader({ onReveal, onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  // Decided once per mount, so StrictMode's double effect run doesn't flip it.
  const [skip] = useState(() => prefersReducedMotion() || introSeen());

  useLayoutEffect(() => {
    if (skip) {
      onReveal();
      onDone();
      return;
    }
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable: the intro simply plays again next time */
    }

    document.documentElement.style.overflow = "hidden";
    const counter = { v: 0 };

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = "";
            onDone();
          },
        })
        .from(".pl-fade", { yPercent: 100, duration: 0.9, stagger: 0.05 })
        .to(
          counter,
          {
            v: 100,
            duration: 1.6,
            ease: "power3.inOut",
            onUpdate: () => {
              const v = Math.round(counter.v);
              if (countRef.current) countRef.current.textContent = String(v).padStart(3, "0");
              if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
            },
          },
          0.1
        )
        .to(".pl-fade, .pl-count", { yPercent: -110, duration: 0.7, ease: "power3.in", stagger: 0.03 }, "+=0.15")
        .add("lift", "-=0.15")
        .to(rootRef.current, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "lift")
        .call(() => onReveal(), [], "lift+=0.25");
    }, rootRef);

    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skip) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="page-x fixed inset-0 z-[9999] flex flex-col justify-between bg-ink-2 pb-6 pt-6 will-change-transform"
    >
      <div className="label flex justify-between text-fg-2">
        <span className="overflow-hidden">
          <span className="pl-fade block">Reda Ghalbi — Portfolio 2026</span>
        </span>
        <span className="overflow-hidden">
          <span className="pl-fade block">Casablanca, MA</span>
        </span>
      </div>

      <div>
        <div className="flex items-end justify-between gap-6">
          <span className="overflow-hidden">
            <span
              ref={countRef}
              className="pl-count tabular block text-[clamp(6rem,22vw,20rem)] font-medium leading-[0.85] tracking-[-0.06em]"
            >
              000
            </span>
          </span>
          <span className="overflow-hidden pb-3">
            <span className="pl-fade label block text-fg-3">Assembling pixels</span>
          </span>
        </div>
        <span className="mt-6 block h-px bg-line-2">
          <span ref={barRef} className="block h-full origin-left scale-x-0 bg-accent" />
        </span>
      </div>
    </div>
  );
}

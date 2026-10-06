import { useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const SEEN_KEY = "mrg-intro-seen";
const NAME = "MOHAMED REDA GHALBI";

function introSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

type PreloaderProps = {
  /** The page underneath can start its intro (fires while the curtain opens). */
  onReveal: () => void;
  /** The preloader has fully left the screen and can be unmounted. */
  onDone: () => void;
};

export function Preloader({ onReveal, onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  // Decided once per mount, so StrictMode's double effect run doesn't flip it.
  const [skip] = useState(() => prefersReducedMotion() || introSeen());

  useLayoutEffect(() => {
    // Skip the full intro for reduced motion and for repeat visits in a session.
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

    document.body.style.overflow = "hidden";
    const counter = { val: 0 };

    const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onDone();
      },
    });

    tl.from(contentRef.current, { autoAlpha: 0, y: 14, duration: 0.5, ease: "power2.out" })
      .fromTo(
        nameRef.current,
        { scrambleText: { text: " " } },
        {
          scrambleText: { text: NAME, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ01", revealDelay: 0.3, speed: 0.6 },
          duration: 1.4,
          ease: "none",
        },
        0.1
      )
      .to(
        counter,
        {
          val: 100,
          duration: 1.5,
          ease: "power3.inOut",
          onUpdate: () => {
            if (pctRef.current) pctRef.current.textContent = String(Math.round(counter.val)).padStart(3, "0");
            if (barRef.current) barRef.current.style.transform = `scaleX(${counter.val / 100})`;
          },
        },
        0.1
      )
      .to(contentRef.current, { autoAlpha: 0, y: -16, scale: 0.98, duration: 0.45, ease: "power2.in" }, "+=0.1")
      // Curtain: the two halves part from the middle.
      .add("curtain", "-=0.1")
      .to(topRef.current, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "curtain")
      .to(bottomRef.current, { yPercent: 100, duration: 1, ease: "expo.inOut" }, "curtain")
      // Start the page intro as the curtain begins to part, so the headline
      // is already rising when it comes into view.
      .call(() => onReveal(), [], "curtain+=0.15");
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (skip) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[9999]" aria-hidden>
      <div ref={topRef} className="absolute inset-x-0 top-0 h-1/2 border-b border-outline-variant bg-surface" />
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 h-1/2 bg-surface" />

      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6"
      >
        <p className="font-mono text-sm tracking-tight text-on-surface">
          M.R.G<span className="text-tertiary">/</span>
        </p>
        <p
          ref={nameRef}
          className="min-h-[1.5em] text-center font-mono text-[clamp(0.85rem,2.4vw,1.1rem)] tracking-[0.3em] text-on-surface-variant"
        >
          {NAME}
        </p>
        <div className="h-px w-48 overflow-hidden bg-outline-variant">
          <div ref={barRef} className="h-full w-full origin-left scale-x-0 bg-tertiary" />
        </div>
        <span className="font-mono text-xs tabular-nums text-on-surface-faint">
          <span ref={pctRef}>000</span>%
        </span>
      </div>
    </div>
  );
}

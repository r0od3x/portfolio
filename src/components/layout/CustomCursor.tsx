import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const glow = glowRef.current;
    if (!dot || !ring || !glow) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const glowX = gsap.quickTo(glow, "x", { duration: 0.7, ease: "power2.out" });
    const glowY = gsap.quickTo(glow, "y", { duration: 0.7, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      glowX(e.clientX);
      glowY(e.clientY);
    };

    const onDown = () => gsap.to(ring, { scale: 0.7, duration: 0.25, ease: "power2.out" });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" });

    const interactiveSelector = "a, button, [role='button'], input, textarea, .cursor-hover";
    const label = labelRef.current;
    let labelled: Element | null = null;

    // Elements with data-cursor="..." turn the ring into a labelled accent bubble.
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const withLabel = target.closest("[data-cursor]");
      if (withLabel && withLabel !== labelled) {
        labelled = withLabel;
        if (label) label.textContent = withLabel.getAttribute("data-cursor");
        gsap.to(ring, {
          width: 92,
          height: 92,
          backgroundColor: "var(--color-tertiary)",
          borderColor: "var(--color-tertiary)",
          scale: 1,
          duration: 0.45,
          ease: "expo.out",
        });
        gsap.to(label, { autoAlpha: 1, scale: 1, duration: 0.35, delay: 0.05, ease: "back.out(2)" });
        gsap.to(dot, { scale: 0, duration: 0.2 });
        return;
      }
      if (!withLabel && target.closest(interactiveSelector)) {
        gsap.to(ring, { scale: 1.8, duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      }
    };
    const onOut = (e: MouseEvent) => {
      const from = (e.target as HTMLElement).closest("[data-cursor]");
      const to = (e.relatedTarget as HTMLElement | null)?.closest?.("[data-cursor]") ?? null;
      if (from && from !== to) {
        labelled = null;
        gsap.to(label, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
        gsap.to(ring, {
          width: 36,
          height: 36,
          backgroundColor: "transparent",
          borderColor: "color-mix(in srgb, var(--color-tertiary) 70%, transparent)",
          duration: 0.4,
          ease: "expo.out",
        });
        gsap.to(dot, { scale: 1, duration: 0.2 });
        return;
      }
      if (!from && (e.target as HTMLElement).closest(interactiveSelector)) {
        gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);

    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <>
      {/* Ambient spotlight that trails the cursor, sits behind all content */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06] blur-[80px] md:block"
        style={{ background: "radial-gradient(circle, var(--color-tertiary), transparent 70%)" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-tertiary/70 md:flex"
      >
        <span
          ref={labelRef}
          className="invisible scale-50 whitespace-nowrap font-mono text-[11px] font-semibold uppercase tracking-wider text-surface opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tertiary md:block"
      />
    </>
  );
}

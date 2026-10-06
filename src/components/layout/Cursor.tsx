import { useEffect, useRef } from "react";
import { gsap, isTouchDevice, prefersReducedMotion } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='button'], input, textarea, label";

/**
 * A small violet dot that swells into a translucent disc over links and turns
 * into a labelled bubble over anything with data-cursor="...". No blend
 * modes: mix-blend-mode on a fixed element makes the browser re-composite the
 * whole page underneath it every frame (it halved FPS on integrated GPUs).
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion() || window.innerWidth < 1024) return;
    const dot = dotRef.current!;
    const bubble = bubbleRef.current!;
    // Set via GSAP, not a Tailwind scale class: Tailwind's `scale` property
    // would multiply with GSAP's transform.
    gsap.set(bubble, { scale: 0.3 });

    const dx = gsap.quickTo(dot, "x", { duration: 0.18, ease: "power3.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.18, ease: "power3.out" });
    const bx = gsap.quickTo(bubble, "x", { duration: 0.45, ease: "power3.out" });
    const by = gsap.quickTo(bubble, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;
    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot, bubble], { x: e.clientX, y: e.clientY });
        gsap.to(dot, { autoAlpha: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      bx(e.clientX);
      by(e.clientY);
    };

    let labelled: Element | null = null;
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element;
      const withLabel = target.closest("[data-cursor]");
      if (withLabel) {
        if (withLabel !== labelled) {
          labelled = withLabel;
          if (textRef.current) textRef.current.textContent = withLabel.getAttribute("data-cursor");
          gsap.to(bubble, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)" });
          gsap.to(dot, { scale: 0, duration: 0.25 });
        }
        return;
      }
      if (labelled) {
        labelled = null;
        gsap.to(bubble, { scale: 0.3, autoAlpha: 0, duration: 0.3 });
      }
      const overLink = !!target.closest(INTERACTIVE);
      gsap.to(dot, {
        scale: overLink ? 4.4 : 1,
        backgroundColor: overLink ? "rgba(167, 139, 250, 0.22)" : "rgba(167, 139, 250, 1)",
        duration: 0.4,
        ease: "settle",
      });
    };

    const onLeaveWindow = () => {
      shown = false;
      gsap.to([dot, bubble], { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    document.documentElement.classList.add("has-cursor");

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent opacity-0"
      />
      <div
        ref={bubbleRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] -ml-11 -mt-11 flex h-22 w-22 items-center justify-center rounded-full bg-accent opacity-0"
      >
        <span ref={textRef} className="label text-ink" />
      </div>
    </>
  );
}

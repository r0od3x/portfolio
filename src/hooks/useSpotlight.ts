import { useEffect } from "react";
import { isTouchDevice, prefersReducedMotion } from "@/lib/gsap";

/**
 * Feeds the pointer position into every `.spotlight` element as --mx/--my
 * (relative to each element), so the accent border glow in index.css follows
 * the cursor and spills over onto neighbouring cards.
 */
export function useSpotlight() {
  useEffect(() => {
    if (isTouchDevice() || prefersReducedMotion()) return;

    let frame = 0;
    let x = -9999;
    let y = -9999;

    const update = () => {
      frame = 0;
      document.querySelectorAll<HTMLElement>(".spotlight").forEach((el) => {
        const r = el.getBoundingClientRect();
        // Skip off-screen cards; nothing to light up there.
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        el.style.setProperty("--mx", `${x - r.left}px`);
        el.style.setProperty("--my", `${y - r.top}px`);
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
}

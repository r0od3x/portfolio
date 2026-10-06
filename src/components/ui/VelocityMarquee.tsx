import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type VelocityMarqueeProps = {
  rows: string[][];
};

/**
 * Oversized infinite text rows that drift on their own, then speed up,
 * follow the scroll direction and skew with scroll velocity.
 */
export function VelocityMarquee({ rows }: VelocityMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const tracks = gsap.utils.toArray<HTMLElement>(".marquee-track", root);
      const loops = tracks.map((track, i) =>
        gsap.fromTo(
          track,
          { xPercent: i % 2 === 0 ? 0 : -50 },
          { xPercent: i % 2 === 0 ? -50 : 0, duration: 40 + i * 8, ease: "none", repeat: -1 }
        )
      );

      const skew = gsap.quickTo(tracks, "skewX", { duration: 0.6, ease: "power3.out" });
      const settle = gsap.delayedCall(0.15, () => skew(0)).pause();

      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const boost = 1 + Math.min(Math.abs(v) / 220, 9);
          loops.forEach((loop) => {
            gsap
              .timeline({ overwrite: true })
              .to(loop, { timeScale: self.direction * boost, duration: 0.15 })
              .to(loop, { timeScale: self.direction, duration: 1.4, ease: "power2.out" });
          });
          skew(gsap.utils.clamp(-14, 14, v / -140));
          settle.restart(true);
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="relative select-none overflow-hidden border-y border-outline-variant py-10 md:py-14"
      style={{
        maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      {rows.map((row, i) => (
        <div key={i} className="marquee-track flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {row.map((word) => (
                <span key={word} className="flex items-center">
                  <span
                    className={`px-6 font-sans text-[clamp(2.75rem,8vw,7.5rem)] font-semibold leading-[1.15] tracking-[-0.04em] transition-colors duration-300 md:px-10 ${
                      i % 2 === 0
                        ? "text-outline hover:[-webkit-text-stroke-color:var(--color-tertiary)]"
                        : "text-on-surface/85 hover:text-tertiary"
                    }`}
                  >
                    {word}
                  </span>
                  <span className="text-[clamp(1.25rem,2.5vw,2.25rem)] text-tertiary">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

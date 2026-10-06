import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

/**
 * One oversized line of words, alternating sans and serif italic, separated
 * by little pixel squares. Drifts on its own, follows the scroll direction
 * and speeds up with scroll velocity. Paused entirely while off-screen.
 */
export function Marquee({ words }: { words: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || prefersReducedMotion()) return;

    const loop = gsap.to(track, { xPercent: -50, duration: 48, ease: "none", repeat: -1, paused: true });
    let direction = 1;
    const settle = gsap.delayedCall(0.12, () => {
      gsap.to(loop, { timeScale: direction, duration: 1.2, ease: "power2.out", overwrite: true });
    }).pause();

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
      onUpdate: (self) => {
        direction = self.direction;
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 260, 7);
        gsap.to(loop, { timeScale: direction * boost, duration: 0.15, overwrite: true });
        settle.restart(true);
      },
    });

    return () => {
      st.kill();
      settle.kill();
      loop.kill();
    };
  }, []);

  const row = (copy: number) => (
    <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
      {words.map((word, i) => (
        <span key={word} className="flex items-center">
          <span
            className={`px-[0.35em] text-[clamp(3rem,9vw,8.5rem)] leading-[1.1] ${
              i % 2 === 0 ? "font-medium tracking-[-0.045em]" : "serif-i text-fg-2"
            }`}
          >
            {word}
          </span>
          <span aria-hidden className="mx-[0.4em] h-[0.18em] w-[0.18em] bg-accent text-[clamp(3rem,9vw,8.5rem)]" />
        </span>
      ))}
    </div>
  );

  return (
    <div ref={rootRef} className="select-none overflow-hidden border-y border-line py-8 md:py-12">
      <p className="sr-only">{words.join(", ")}</p>
      <div ref={trackRef} aria-hidden className="flex w-max will-change-transform">
        {row(0)}
        {row(1)}
      </div>
    </div>
  );
}

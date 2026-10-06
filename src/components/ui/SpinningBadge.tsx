import { useEffect, useId, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type SpinningBadgeProps = {
  text: string;
  className?: string;
  children?: React.ReactNode;
};

/** Circular rotating text that spins faster while the page is scrolling. */
export function SpinningBadge({ text, className = "", children }: SpinningBadgeProps) {
  const ringRef = useRef<SVGSVGElement>(null);
  const pathId = useId();

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring || prefersReducedMotion()) return;

    const spin = gsap.to(ring, { rotate: 360, duration: 16, ease: "none", repeat: -1 });
    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 7);
        gsap
          .timeline({ overwrite: true })
          .to(spin, { timeScale: boost * self.direction, duration: 0.15 })
          .to(spin, { timeScale: self.direction, duration: 1.2, ease: "power2.out" });
      },
    });

    return () => {
      st.kill();
      spin.kill();
    };
  }, []);

  return (
    <div className={className} aria-hidden>
      <div className="relative aspect-square w-full">
      <svg ref={ringRef} viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <path id={pathId} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text className="fill-on-surface-variant font-mono text-[13px] uppercase tracking-[0.32em]">
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}

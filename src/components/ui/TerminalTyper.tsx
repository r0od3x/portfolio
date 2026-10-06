import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type TerminalTyperProps = {
  lines: string[];
  className?: string;
  play?: boolean;
};

/**
 * A terminal prompt that types and deletes lines in a loop, the same motif
 * as the header on github.com/r0od3x.
 */
export function TerminalTyper({ lines, className = "", play = true }: TerminalTyperProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el || !play) return;
    if (prefersReducedMotion()) {
      el.textContent = lines[0];
      return;
    }

    const state = { n: 0 };
    const tl = gsap.timeline({ repeat: -1, delay: 0.4 });
    lines.forEach((line) => {
      tl.call(() => {
        state.n = 0;
      })
        .to(state, {
          n: line.length,
          duration: line.length * 0.045,
          ease: `steps(${line.length})`,
          onUpdate: () => {
            el.textContent = line.slice(0, Math.round(state.n));
          },
        })
        .to(state, {
          n: 0,
          duration: line.length * 0.018,
          delay: 2.2,
          ease: `steps(${line.length})`,
          onUpdate: () => {
            el.textContent = line.slice(0, Math.round(state.n));
          },
        })
        .to({}, { duration: 0.35 });
    });

    return () => {
      tl.kill();
    };
  }, [lines, play]);

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-outline bg-surface-container/80 px-4 py-3 font-mono text-[12.5px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md ${className}`}
    >
      <span aria-hidden className="flex shrink-0 gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-error" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FBBF24]" />
        <span className="h-2.5 w-2.5 rounded-full bg-success" />
      </span>
      <span className="min-w-0 truncate text-secondary">
        <span className="text-on-surface-faint">~$ </span>
        <span ref={textRef} aria-live="off" aria-label={lines.join(". ")} />
        <span aria-hidden className="caret ml-px inline-block h-[1.05em] w-[7px] translate-y-[2px] bg-secondary" />
      </span>
    </div>
  );
}

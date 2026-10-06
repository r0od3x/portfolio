import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type SectionLabelProps = {
  index: string;
  label: string;
  note?: string;
  tone?: "ink" | "paper";
  className?: string;
};

/** "(01) About ———————— note" row that opens every section. */
export function SectionLabel({ index, label, note, tone = "ink", className = "" }: SectionLabelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } })
        .from(".sl-text", { yPercent: 110, duration: 0.9, stagger: 0.06 })
        .from(".sl-line", { scaleX: 0, transformOrigin: "0% 50%", duration: 1.4 }, 0.1);
    }, el);
    return () => ctx.revert();
  }, []);

  const faint = tone === "ink" ? "text-fg-3" : "text-on-paper-2";
  const line = tone === "ink" ? "bg-line-2" : "bg-on-paper/20";

  return (
    <div ref={ref} className={`label flex items-center gap-4 ${className}`}>
      <span className="shrink-0 overflow-hidden">
        <span className={`sl-text inline-block ${faint}`}>({index})</span>
      </span>
      <span className="shrink-0 overflow-hidden">
        <span className="sl-text inline-block">{label}</span>
      </span>
      <span className={`sl-line h-px flex-1 ${line}`} />
      {note && (
        <span className="hidden overflow-hidden sm:inline">
          <span className={`sl-text inline-block ${faint}`}>{note}</span>
        </span>
      )}
    </div>
  );
}

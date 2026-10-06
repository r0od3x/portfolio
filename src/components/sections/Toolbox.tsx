import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { skillGroups } from "@/data/content";

/**
 * Replaces the old 3D "stacked layers": a plain typographic index. Hover
 * effects are CSS transforms only, so there's no per-frame JavaScript here.
 */
export function Toolbox() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tb-row").forEach((row) => {
        const split = SplitText.create(row.querySelector(".tb-tools"), { type: "lines", mask: "lines" });
        splits.push(split);
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 88%", once: true } })
          .from(row.querySelector(".tb-line"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.3 })
          .from(row.querySelector(".tb-cat"), { yPercent: 100, autoAlpha: 0, duration: 0.9 }, 0.1)
          .from(split.lines, { yPercent: 105, duration: 1, stagger: 0.07 }, 0.15);
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  return (
    <section ref={sectionRef} id="toolbox" className="page-x py-32 md:py-44">
      <SectionLabel index="04" label="Toolbox" note="Roughly in order of use" />

      <h2 className="mt-14 max-w-[18ch] text-[clamp(2.4rem,5.4vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em] md:mt-20">
        What I reach for <span className="serif-i tracking-[-0.02em] text-fg-2">most days.</span>
      </h2>

      <ul className="mt-16 md:mt-24">
        {skillGroups.map((group, i) => (
          <li key={group.id} className="tb-row group relative grid-12 gap-y-3 py-7 md:py-9">
            <span aria-hidden className="tb-line absolute inset-x-0 top-0 h-px bg-line-2" />
            <div className="col-span-12 overflow-hidden md:col-span-3">
              <p className="tb-cat label flex items-center gap-3 pt-2 text-fg-3 transition-colors duration-300 group-hover:text-accent">
                <span className="tabular">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-1.5 w-1.5 scale-0 bg-accent transition-transform duration-500 group-hover:scale-100" />
                {group.title}
              </p>
            </div>
            <p className="tb-tools col-span-12 text-[clamp(1.5rem,2.9vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.03em] text-fg-2 transition-[color,transform] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-3 group-hover:text-fg md:col-span-9">
              {group.skills.map((skill, j) => (
                <span key={skill}>
                  {skill}
                  {j < group.skills.length - 1 && <span className="text-fg-3">, </span>}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

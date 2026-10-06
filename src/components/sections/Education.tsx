import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { education } from "@/data/content";

export function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ed-row").forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 90%", once: true } })
          .from(row.querySelector(".ed-line"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.2 })
          .from(row.querySelectorAll(".ed-cell"), { yPercent: 100, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, 0.1);
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="education" className="page-x pb-40 pt-16 md:pb-56">
      <SectionLabel index="05" label="Education & certificates" note="2022 → 2027" />

      <ul className="mt-14 md:mt-20">
        {education.map((row) => (
          <li key={row.title} className="ed-row group relative grid-12 items-baseline gap-y-1 py-6">
            <span aria-hidden className="ed-line absolute inset-x-0 top-0 h-px bg-line-2" />
            <span className="col-span-12 overflow-hidden md:col-span-2">
              <span className="ed-cell label block text-fg-3">{row.year}</span>
            </span>
            {/* Hover nudge lives on the wrapper: a CSS transition on the element
                GSAP animates would fight the tween. */}
            <span className="col-span-12 overflow-hidden transition-transform duration-500 group-hover:translate-x-2 md:col-span-7">
              <span className="ed-cell block text-[clamp(1.15rem,1.7vw,1.5rem)] font-medium tracking-[-0.02em]">
                {row.title}
              </span>
            </span>
            <span className="col-span-12 overflow-hidden md:col-span-3 md:text-right">
              <span className="ed-cell serif-i block text-[clamp(1.1rem,1.5vw,1.35rem)] text-fg-2">{row.place}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

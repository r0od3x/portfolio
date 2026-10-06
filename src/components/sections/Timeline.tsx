import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { timeline } from "@/data/content";
import { Briefcase, GraduationCap, Sparkles, FolderGit2 } from "lucide-react";

const ICONS = {
  work: Briefcase,
  education: GraduationCap,
  milestone: Sparkles,
  project: FolderGit2,
};

export function Timeline() {
  const lineRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (prefersReducedMotion() || !lineRef.current || !wrap) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".tl-item");
      const lit = items.map(() => false);
      const comet = cometRef.current;

      // Light up each icon as the accent line reaches it, and carry the comet
      // along the tip of the line.
      const onProgress = (progress: number) => {
        const tip = progress * wrap.offsetHeight;
        if (comet) gsap.set(comet, { y: tip, autoAlpha: progress > 0.001 && progress < 0.999 ? 1 : 0 });
        items.forEach((item, i) => {
          const on = item.offsetTop + 20 <= tip;
          if (on === lit[i]) return;
          lit[i] = on;
          const icon = item.querySelector(".tl-icon");
          gsap.to(icon, {
            backgroundColor: on ? "var(--color-tertiary)" : "var(--color-surface-container-high)",
            color: on ? "var(--color-surface)" : "var(--color-tertiary)",
            borderColor: on ? "var(--color-tertiary)" : "var(--color-outline)",
            boxShadow: on
              ? "0 0 0 6px color-mix(in srgb, var(--color-tertiary) 15%, transparent), 0 0 32px color-mix(in srgb, var(--color-tertiary) 45%, transparent)"
              : "0 0 0 0px transparent, 0 0 0px transparent",
            duration: 0.4,
            ease: "power2.out",
          });
          if (on) gsap.fromTo(icon, { scale: 1.35 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        });
      };

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: wrap,
            start: "top 65%",
            end: "bottom 65%",
            scrub: 0.6,
          },
          onUpdate() {
            onProgress(this.progress());
          },
        }
      );

      // Entries sweep in from their own side.
      items.forEach((item) => {
        const fromRight = item.dataset.side === "right";
        const wide = window.innerWidth >= 768;
        gsap
          .timeline({ scrollTrigger: { trigger: item, start: "top 85%", once: true } })
          .fromTo(
            item,
            { x: wide ? (fromRight ? 90 : -90) : 40, autoAlpha: 0, filter: "blur(10px)" },
            { x: 0, autoAlpha: 1, filter: "blur(0px)", duration: 1, ease: "expo.out", clearProps: "filter" }
          )
          .from(
            item.querySelectorAll("li, .badge-row > *"),
            { y: 16, autoAlpha: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 },
            "-=0.7"
          );
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="container-px mx-auto max-w-7xl py-32 md:py-40">
      <SectionHeading
        eyebrow="Experience · 2022 → now"
        title="From first year to the bank floor."
        description="Read top to bottom: three internships in logistics, manufacturing and banking, and what happened between them."
        className="mb-20"
      />

      <div ref={wrapRef} className="relative">
        <div className="absolute left-[19px] top-0 h-full w-px bg-outline-variant md:left-1/2" />
        <div
          ref={lineRef}
          className="absolute left-[19px] top-0 h-full w-px bg-gradient-to-b from-tertiary/20 via-tertiary to-tertiary md:left-1/2"
        />
        {/* Comet riding the tip of the progress line */}
        <div
          ref={cometRef}
          aria-hidden
          className="pointer-events-none absolute left-[19px] top-0 z-10 opacity-0 md:left-1/2"
        >
          <span className="absolute -top-24 left-0 h-24 w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent to-tertiary blur-[1px]" />
          <span
            className="absolute left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-on-tertiary-container"
            style={{ boxShadow: "0 0 12px 3px var(--color-tertiary), 0 0 40px 10px color-mix(in srgb, var(--color-tertiary) 40%, transparent)" }}
          />
        </div>

        <ol className="flex flex-col gap-14">
          {timeline.map((item, i) => {
            const Icon = ICONS[item.kind];
            const isRight = i % 2 === 1;
            return (
              <li
                key={item.title}
                data-side={isRight ? "right" : "left"}
                className={`tl-item relative flex flex-col gap-4 pl-14 md:w-1/2 ${
                  isRight ? "md:ml-auto" : "md:pl-0 md:pr-14 md:text-right"
                }`}
              >
                <span
                  className={`tl-icon absolute left-0 top-0 z-[1] flex h-10 w-10 items-center justify-center rounded-full border border-outline bg-surface-container-high text-tertiary ${
                    isRight ? "md:-left-5" : "md:left-auto md:-right-5"
                  }`}
                >
                  <Icon size={16} />
                </span>

                <div
                  className={`badge-row flex flex-wrap items-center gap-3 ${
                    isRight ? "" : "md:justify-end"
                  }`}
                >
                  <Badge tone={item.kind === "work" ? "accent" : "outline"}>{item.date}</Badge>
                  <span className="font-mono text-xs uppercase tracking-wide text-on-surface-faint">
                    {item.org}
                  </span>
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-on-surface">
                  {item.title}
                </h3>
                <p
                  className={`max-w-md text-sm leading-relaxed text-on-surface-variant ${
                    isRight ? "" : "md:ml-auto"
                  }`}
                >
                  {item.description}
                </p>

                {item.points && (
                  <ul
                    className={`max-w-md space-y-2 text-left text-sm leading-relaxed text-on-surface-variant ${
                      isRight ? "" : "md:ml-auto"
                    }`}
                  >
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tertiary" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {item.stack && (
                  <div className={`flex flex-wrap gap-2 ${isRight ? "" : "md:justify-end"}`}>
                    {item.stack.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

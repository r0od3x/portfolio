import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { timeline, type TimelineItem } from "@/data/content";

const ICON_PATHS: Record<TimelineItem["kind"], string[]> = {
  work: ["M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z", "M9 8V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2", "M3 13h18"],
  education: ["M2 9.5 12 4.5l10 5-10 5Z", "M6 11.5v4.5c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5", "M22 9.5v5.5"],
  milestone: ["M12 3.5l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5-5.5-2 5.5-2Z"],
};

function KindIcon({ kind }: { kind: TimelineItem["kind"] }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" aria-hidden>
      {ICON_PATHS[kind].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const pill = "label inline-flex items-center rounded-full px-3 py-1.5";

/**
 * Vertical timeline, read top to bottom from 2022 to now: an accent line draws
 * down as you scroll with a comet riding its tip, each icon lights up as the
 * line reaches it, and entries sweep in from their own side.
 */
export function Experience() {
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

      const onProgress = (progress: number) => {
        const tip = progress * wrap.offsetHeight;
        if (comet) gsap.set(comet, { y: tip, autoAlpha: progress > 0.001 && progress < 0.999 ? 1 : 0 });
        items.forEach((item, i) => {
          const on = item.offsetTop + 20 <= tip;
          if (on === lit[i]) return;
          lit[i] = on;
          const icon = item.querySelector(".tl-icon");
          gsap.to(icon, {
            backgroundColor: on ? "var(--color-accent)" : "var(--color-ink-3)",
            color: on ? "var(--color-ink)" : "var(--color-accent)",
            borderColor: on ? "var(--color-accent)" : "var(--color-line-2)",
            boxShadow: on
              ? "0 0 0 6px color-mix(in srgb, var(--color-accent) 15%, transparent), 0 0 32px color-mix(in srgb, var(--color-accent) 45%, transparent)"
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
          scrollTrigger: { trigger: wrap, start: "top 65%", end: "bottom 65%", scrub: 0.6 },
          onUpdate() {
            onProgress(this.progress());
          },
        }
      );

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
    <section id="experience" className="page-x py-32 md:py-44">
      <SectionLabel index="03" label="Experience" note="2022 → now" />

      <div className="mt-14 flex flex-wrap items-end justify-between gap-6 md:mt-20">
        <h2 className="text-[clamp(2.4rem,5.4vw,5.4rem)] font-medium leading-[0.95] tracking-[-0.045em]">
          Four years, <span className="serif-i tracking-[-0.02em] text-fg-2">three internships.</span>
        </h2>
        <p className="max-w-[36ch] text-[15.5px] leading-relaxed text-fg-2">
          Read top to bottom: logistics, manufacturing and banking, and what happened between them.
        </p>
      </div>

      <div ref={wrapRef} className="relative mx-auto mt-20 max-w-6xl md:mt-28">
        <div className="absolute left-[19px] top-0 h-full w-px bg-line md:left-1/2" />
        <div
          ref={lineRef}
          className="absolute left-[19px] top-0 h-full w-px bg-gradient-to-b from-accent/20 via-accent to-accent md:left-1/2"
        />
        {/* Comet riding the tip of the progress line */}
        <div ref={cometRef} aria-hidden className="pointer-events-none absolute left-[19px] top-0 z-10 opacity-0 md:left-1/2">
          <span className="absolute -top-24 left-0 h-24 w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent to-accent blur-[1px]" />
          <span
            className="absolute left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ddd6fe]"
            style={{
              boxShadow:
                "0 0 12px 3px var(--color-accent), 0 0 40px 10px color-mix(in srgb, var(--color-accent) 40%, transparent)",
            }}
          />
        </div>

        <ol className="flex flex-col gap-16">
          {timeline.map((item, i) => {
            const isRight = i % 2 === 1;
            const isNow = item.year === "Now";
            return (
              <li
                key={item.title}
                data-side={isRight ? "right" : "left"}
                className={`tl-item relative flex flex-col gap-4 pl-14 md:w-1/2 ${
                  isRight ? "md:ml-auto md:pl-14" : "md:pl-0 md:pr-14 md:text-right"
                }`}
              >
                <span
                  className={`tl-icon absolute left-0 top-0 z-[1] flex h-10 w-10 items-center justify-center rounded-full border border-line-2 bg-ink-3 text-accent ${
                    isRight ? "md:-left-5" : "md:left-auto md:-right-5"
                  }`}
                >
                  <KindIcon kind={item.kind} />
                </span>

                <div className={`badge-row flex flex-wrap items-center gap-3 ${isRight ? "" : "md:justify-end"}`}>
                  <span
                    className={`${pill} ${
                      item.kind === "work" || isNow ? "bg-accent/15 text-accent" : "border border-line-2 text-fg-2"
                    }`}
                  >
                    {isNow && <span className="mr-2 h-1.5 w-1.5 rounded-full bg-ok" />}
                    {item.date}
                  </span>
                  <span className="label text-fg-3">{item.org}</span>
                </div>

                <h3 className="text-[clamp(1.35rem,1.9vw,1.75rem)] font-medium leading-tight tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className={`max-w-md text-[15.5px] leading-relaxed text-fg-2 ${isRight ? "" : "md:ml-auto"}`}>
                  {item.description}
                </p>

                {item.points && (
                  <ul
                    className={`max-w-md space-y-2 text-left text-[14.5px] leading-relaxed text-fg-2 ${
                      isRight ? "" : "md:ml-auto"
                    }`}
                  >
                    {item.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {item.stack && (
                  <div className={`flex flex-wrap gap-2 ${isRight ? "" : "md:justify-end"}`}>
                    {item.stack.map((tech) => (
                      <span key={tech} className={`${pill} bg-ink-3 text-fg-2`}>
                        {tech}
                      </span>
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

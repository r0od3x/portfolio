import { useEffect, useRef, type ComponentType } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RollText } from "@/components/ui/RollText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { NutriVisionFigure } from "@/components/figures/NutriVisionFigure";
import { MedAIFigure } from "@/components/figures/MedAIFigure";
import { CustomsFigure } from "@/components/figures/CustomsFigure";
import { SugarSightFigure } from "@/components/figures/SugarSightFigure";
import { archive, profile, projects, type Figure, type Project } from "@/data/content";

const FIGURES: Record<Figure, ComponentType> = {
  nutrivision: NutriVisionFigure,
  medai: MedAIFigure,
  customs: CustomsFigure,
  sugarsight: SugarSightFigure,
};

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia(sectionRef);

    mm.add("all", () => {
      // Content of each panel rises in as it arrives.
      gsap.utils.toArray<HTMLElement>(".work-panel").forEach((panel) => {
        gsap.from(panel.querySelectorAll(".wp-reveal"), {
          y: 36,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.06,
          scrollTrigger: { trigger: panel, start: "top 70%", once: true },
        });
      });
    });

    // Only where panels pin and stack: the covered panel sinks back.
    mm.add("(min-width: 1024px) and (min-height: 720px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".work-panel");
      panels.forEach((panel, i) => {
        const next = panels[i + 1];
        if (!next) return;
        const st = { trigger: next, start: "top bottom", end: "top top+=96", scrub: true };
        gsap.to(panel.querySelector(".wp-card"), { scale: 0.9, yPercent: -2, ease: "none", scrollTrigger: st });
        gsap.to(panel.querySelector(".wp-shade"), { opacity: 0.7, ease: "none", scrollTrigger: st });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" className="page-x pb-32 pt-36 md:pt-48">
      <SectionLabel index="02" label="Selected work" note={`${projects.length} projects · 2025–26`} />

      <div className="mt-14 flex flex-col gap-6 md:mt-20 tall-lg:gap-0">
        {projects.map((project, i) => (
          <ProjectPanel key={project.slug} project={project} total={projects.length} z={i} />
        ))}
      </div>

      <Archive />
    </section>
  );
}

function ProjectPanel({ project, total, z }: { project: Project; total: number; z: number }) {
  const Figure = FIGURES[project.figure];

  return (
    <article className="work-panel tall-lg:sticky tall-lg:top-24 tall-lg:pb-6" style={{ zIndex: z }}>
      <div className="wp-card relative origin-top overflow-hidden rounded-[22px] border border-line bg-ink-2 will-change-transform tall-lg:h-[calc(100svh-120px)] tall-lg:max-h-[860px]">
        <span aria-hidden className="wp-shade pointer-events-none absolute inset-0 z-20 bg-ink opacity-0" />

        <div className="grid h-full grid-cols-1 gap-8 p-6 md:p-10 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col lg:col-span-5">
            <div className="wp-reveal label flex items-center justify-between text-fg-3">
              <span>
                <span className="text-fg">{project.index}</span> / {String(total).padStart(2, "0")}
              </span>
              <span>
                {project.context} — {project.year}
              </span>
            </div>

            <h3 className="wp-reveal mt-8 text-[clamp(2.6rem,4.6vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.045em]">
              {project.name}
            </h3>
            <p className="wp-reveal serif-i mt-4 text-[clamp(1.35rem,2vw,1.9rem)] leading-[1.15] text-fg-2">
              {project.tagline}
            </p>
            <p className="wp-reveal mt-6 max-w-[48ch] text-[15.5px] leading-relaxed text-fg-2">{project.description}</p>

            <ol className="mt-6 space-y-2.5">
              {project.highlights.map((h, i) => (
                <li key={h} className="wp-reveal flex gap-4 text-[14.5px] leading-snug">
                  <span className="label pt-0.5 text-accent">{String.fromCharCode(97 + i)}.</span>
                  <span className="text-fg-2">{h}</span>
                </li>
              ))}
            </ol>

            <div className="wp-reveal mt-8 flex flex-wrap items-end justify-between gap-4 lg:mt-auto lg:pt-8">
              <p className="label max-w-[30ch] text-fg-3">{project.stack.join(" · ")}</p>
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="roll-host inline-flex items-center gap-2 rounded-full border border-line-2 px-5 py-2.5 text-[14px] transition-colors duration-300 hover:border-fg hover:bg-fg hover:text-ink"
                >
                  <RollText>View source</RollText>
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </div>

          <div className="flex min-h-0 flex-col lg:col-span-7">
            <div className="graph-paper relative aspect-[640/480] overflow-hidden rounded-[14px] border border-line tall-lg:aspect-auto tall-lg:min-h-0 tall-lg:flex-1">
              <p className="label absolute left-4 top-4 z-10 text-fg-3">
                Fig. {project.index} — {project.figureCaption}
              </p>
              <div className="absolute inset-0 p-3 pt-10 md:p-5 md:pt-12">
                <Figure />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="border-t border-line-2 pt-3">
                  <ScrambleText
                    as="p"
                    chars="0123456789.%−+"
                    className="text-[clamp(1.5rem,2.4vw,2.2rem)] font-medium tracking-[-0.03em]"
                  >
                    {m.value}
                  </ScrambleText>
                  <p className="label mt-1 text-fg-3">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Archive() {
  const listRef = useRef<HTMLUListElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  const moveTo = (el: HTMLElement | null) => {
    const bar = barRef.current;
    if (!bar) return;
    if (!el) {
      gsap.to(bar, { autoAlpha: 0, duration: 0.3 });
      return;
    }
    gsap.to(bar, {
      y: el.offsetTop,
      height: el.offsetHeight,
      autoAlpha: 1,
      duration: prefersReducedMotion() ? 0 : 0.5,
      ease: "settle",
    });
  };

  return (
    <div className="mt-32 md:mt-44">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="text-[clamp(2rem,4vw,3.6rem)] font-medium leading-none tracking-[-0.04em]">
          More on <span className="serif-i text-fg-2">GitHub</span>
        </h3>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="roll-host label inline-flex items-center gap-2 text-fg-2 hover:text-fg"
        >
          <RollText>All repositories</RollText> ↗
        </a>
      </div>

      <ul ref={listRef} className="relative mt-10 border-t border-line" onMouseLeave={() => moveTo(null)}>
        <span
          ref={barRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-0 rounded-[10px] bg-fg opacity-0"
        />
        {archive.map((p) => (
          <li key={p.repo}>
            <a
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open"
              onMouseEnter={(e) => moveTo(e.currentTarget)}
              onFocus={(e) => moveTo(e.currentTarget)}
              className="group relative z-10 grid grid-cols-12 items-baseline gap-x-4 gap-y-1 border-b border-line px-3 py-5 transition-colors duration-300 hover:text-ink md:px-4"
            >
              <span className="col-span-10 text-[clamp(1.15rem,1.7vw,1.5rem)] font-medium tracking-[-0.02em] md:col-span-4">
                {p.name}
              </span>
              <span className="col-span-2 text-right label text-fg-3 transition-colors group-hover:text-ink md:order-last md:col-span-1">
                {p.year} ↗
              </span>
              <span className="col-span-12 text-[15px] text-fg-2 transition-colors group-hover:text-ink/75 md:col-span-4">
                {p.description}
              </span>
              <span className="label col-span-12 text-fg-3 transition-colors group-hover:text-ink/60 md:col-span-3">
                {p.stack}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

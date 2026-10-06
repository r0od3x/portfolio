import { useEffect, useRef } from "react";
import { gsap, isTouchDevice, prefersReducedMotion } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { GithubMark } from "@/components/ui/BrandIcons";
import { RevealText } from "@/components/ui/RevealText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import type { Project } from "@/data/content";

export function ProjectCard({ project }: { project: Project }) {
  const rootRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLAnchorElement & HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Giant index number drifts slower than the page.
      gsap.fromTo(
        indexRef.current,
        { yPercent: 35 },
        {
          yPercent: -35,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
        }
      );

      const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 78%", once: true } });
      tl.from(".pc-meta", { y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 })
        .from(
          ".pc-badges > *",
          { y: 14, scale: 0.8, autoAlpha: 0, duration: 0.5, ease: "back.out(2)", stagger: 0.04 },
          "-=0.5"
        )
        .fromTo(
          cardRef.current,
          { clipPath: "inset(100% 0% 0% 0% round 16px)" },
          { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.3, ease: "expo.inOut" },
          0.1
        )
        .from(
          ".pc-panel-item",
          { y: 22, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.06 },
          "-=0.6"
        );
    }, root);

    return () => ctx.revert();
  }, []);

  const handleMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card || isTouchDevice()) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateX: py * -6,
      rotateY: px * 8,
      duration: 0.5,
      ease: "power3.out",
      transformPerspective: 900,
    });
    gsap.to(glowRef.current, {
      x: (px + 0.5) * rect.width,
      y: (py + 0.5) * rect.height,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleLeave = () => {
    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
    });
  };

  const panel = (
    <>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[60px] transition-opacity duration-300 group-hover:opacity-[0.14]"
        style={{ background: "var(--color-tertiary)" }}
      />

      <div className="pc-panel-item relative flex items-start justify-between gap-4">
        <p className="eyebrow">The problem</p>
        <ArrowUpRight
          size={20}
          className="text-on-surface-faint transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-tertiary"
        />
      </div>
      <p className="pc-panel-item relative mt-3 text-sm leading-relaxed text-on-surface-variant">
        {project.problem}
      </p>

      <p className="pc-panel-item eyebrow relative mt-8">The approach</p>
      <ul className="relative mt-3 space-y-2.5">
        {project.approach.map((step) => (
          <li key={step} className="pc-panel-item flex gap-3 text-sm leading-relaxed text-on-surface-variant">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-tertiary" />
            {step}
          </li>
        ))}
      </ul>

      <div className="pc-panel-item relative mt-8 grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
        {project.metrics.map((m) => (
          <div key={m.label}>
            <ScrambleText
              as="p"
              chars="0123456789.%−+"
              duration={1.4}
              className="font-mono text-lg font-medium text-on-surface"
            >
              {m.value}
            </ScrambleText>
            <p className="mt-1 text-xs text-on-surface-faint">{m.label}</p>
          </div>
        ))}
      </div>
    </>
  );

  const panelClass =
    "spotlight cursor-hover group relative block overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-8 transition-colors duration-300 hover:border-outline hover:bg-surface-container-high lg:col-span-7";

  return (
    <article
      ref={rootRef}
      className="relative isolate grid grid-cols-1 gap-10 border-t border-outline-variant py-16 first:border-t-0 first:pt-0 lg:grid-cols-12 lg:gap-8"
      style={{ perspective: 1200 }}
    >
      <span
        ref={indexRef}
        aria-hidden
        className="text-outline pointer-events-none absolute -top-6 right-0 -z-10 select-none font-sans text-[clamp(8rem,20vw,17rem)] font-bold leading-none tracking-[-0.06em] opacity-60 lg:left-[30%] lg:right-auto"
      >
        {project.index}
      </span>

      <div className="lg:col-span-5">
        <span className="pc-meta block font-mono text-sm text-tertiary">{project.index}</span>
        <RevealText
          as="h3"
          className="mt-3 text-3xl font-semibold tracking-tight text-on-surface md:text-4xl"
          start="top 80%"
        >
          {project.name}
        </RevealText>
        <p className="pc-meta mt-2 font-mono text-sm text-tertiary">{project.tagline}</p>
        <p className="pc-meta mt-6 max-w-md text-base leading-relaxed text-on-surface-variant">
          {project.description}
        </p>

        <div className="pc-badges mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="pc-meta mt-8 flex flex-wrap items-center gap-4">
          <Badge tone="accent">{project.context}</Badge>
          {project.repo && (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-hover inline-flex items-center gap-2 font-mono text-[13px] text-on-surface-variant transition-colors hover:text-tertiary"
            >
              <GithubMark size={14} /> Source code
              <ArrowUpRight size={13} />
            </a>
          )}
        </div>
      </div>

      {project.repo ? (
        <a
          ref={cardRef}
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="View code"
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className={panelClass}
          style={{ transformStyle: "preserve-3d" }}
        >
          {panel}
        </a>
      ) : (
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          className={panelClass}
          style={{ transformStyle: "preserve-3d" }}
        >
          {panel}
        </div>
      )}
    </article>
  );
}

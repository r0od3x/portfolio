import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealText } from "@/components/ui/RevealText";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Badge } from "@/components/ui/Badge";
import { GithubMark } from "@/components/ui/BrandIcons";
import { moreProjects, profile, projects } from "@/data/content";
import { ArrowUpRight } from "lucide-react";

export function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".mini-card", {
        y: 90,
        rotateX: -25,
        rotateY: (i) => (i % 3 - 1) * 10,
        scale: 0.92,
        autoAlpha: 0,
        transformPerspective: 1000,
        transformOrigin: "50% 100%",
        duration: 1.2,
        ease: "expo.out",
        stagger: { each: 0.08, grid: "auto", from: "start" },
        scrollTrigger: { trigger: grid, start: "top 85%", once: true },
      });
    }, grid);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" className="container-px mx-auto max-w-7xl py-32 md:py-40">
      <SectionHeading
        eyebrow="Featured Projects"
        title="From model to something people can use."
        description="Each project goes past the notebook: a trained model, the API that serves it, and an interface someone can actually open."
        className="mb-8"
      />

      <div>
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <div className="mt-24 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">More on GitHub</p>
          <RevealText as="h3" className="mt-3 text-2xl font-semibold tracking-tight text-on-surface md:text-3xl">
            Smaller builds and experiments.
          </RevealText>
        </div>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-hover flex items-center gap-2 rounded-full border border-outline px-5 py-2.5 font-mono text-[13px] text-on-surface transition-colors hover:border-tertiary/60"
        >
          <GithubMark size={15} /> All repositories
        </a>
      </div>

      <div ref={gridRef} className="spotlight-group mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {moreProjects.map((p) => (
          <a
            key={p.repo}
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Open"
            className="mini-card spotlight cursor-hover group flex flex-col rounded-lg border border-outline-variant bg-surface-container p-7 transition-colors duration-300 hover:border-outline hover:bg-surface-container-high"
          >
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-lg font-semibold leading-snug tracking-tight text-on-surface">
                {p.name}
              </h4>
              <ArrowUpRight
                size={18}
                className="shrink-0 text-on-surface-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-tertiary"
              />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-on-surface-variant">
              {p.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {p.stack.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/data/content";
import {
  LineChart,
  Layers,
  Sparkles,
  Server,
  MonitorSmartphone,
  Database,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  frontend: MonitorSmartphone,
  ai: Sparkles,
  dl: Layers,
  ml: LineChart,
  backend: Server,
  databases: Database,
  tools: Wrench,
};

// Ordered top (user-facing) to bottom (foundation) — an actual "stack",
// read the way you'd read a system architecture diagram.
const ORDER = ["frontend", "ai", "dl", "ml", "backend", "databases", "tools"];
const LAYERS = ORDER.map((id) => skillGroups.find((g) => g.id === id)!).filter(Boolean);

export function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>(".stack-layer");

      if (reduced) {
        gsap.set(layers, { opacity: 1, x: 0 });
        return;
      }

      gsap.set(layers, { opacity: 0, x: (i) => (i % 2 === 0 ? -36 : 36) });

      ScrollTrigger.batch(layers, {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.09,
          }),
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="stack" ref={sectionRef} className="relative overflow-hidden py-32 md:py-40">
      {/* Ambient background — same language as Hero/Contact, tokenized */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.055] blur-[130px]"
          style={{ background: "radial-gradient(circle, var(--color-tertiary), transparent 70%)" }}
        />
      </div>

      <div className="container-px mx-auto max-w-5xl">
        <SectionHeading
          eyebrow="Tech Stack"
          title="The stack, literally stacked."
          description="From the interface a user touches down to the data underneath. Hover or tap a layer to see what lives there."
          className="mb-16"
        />

        <div
          className="spotlight-group flex flex-col gap-3 [perspective:1600px]"
          onMouseLeave={() => !isTouch.current && setActiveId(null)}
        >
          {LAYERS.map((layer, i) => {
            const Icon = CATEGORY_ICONS[layer.id] ?? Sparkles;
            const active = activeId === layer.id;
            const dimmed = activeId !== null && !active;

            return (
              <div
                key={layer.id}
                className="stack-layer origin-center [transform-style:preserve-3d]"
                style={{
                  transform: active
                    ? "translateZ(28px) translateY(-2px) rotateX(0deg)"
                    : dimmed
                      ? "translateZ(0px) scale(0.99)"
                      : "translateZ(0px)",
                  opacity: dimmed ? 0.5 : 1,
                  transition:
                    "transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.5s ease, background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.5s ease",
                }}
              >
                <button
                  type="button"
                  onMouseEnter={() => !isTouch.current && setActiveId(layer.id)}
                  onFocus={() => setActiveId(layer.id)}
                  onBlur={() => setActiveId((cur) => (cur === layer.id ? null : cur))}
                  onClick={() => setActiveId((cur) => (cur === layer.id ? null : layer.id))}
                  aria-expanded={active}
                  className="spotlight cursor-hover flex w-full flex-col gap-4 rounded-xl border px-6 py-5 text-left md:flex-row md:items-center md:gap-6 md:px-8"
                  style={{
                    borderColor: active ? "var(--color-tertiary)" : "var(--color-outline-variant)",
                    backgroundColor: active
                      ? "var(--color-surface-container-high)"
                      : "var(--color-surface-container)",
                    boxShadow: active
                      ? "0 24px 48px -18px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in srgb, var(--color-tertiary) 35%, transparent)"
                      : "none",
                  }}
                >
                  <div className="flex shrink-0 items-center gap-4 md:w-56">
                    <span
                      className="font-mono text-xs transition-colors duration-300"
                      style={{ color: active ? "var(--color-tertiary)" : "var(--color-on-surface-faint)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300"
                      style={{
                        borderColor: active ? "var(--color-tertiary)" : "var(--color-outline-variant)",
                        color: "var(--color-tertiary)",
                      }}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="text-sm font-semibold tracking-tight text-on-surface md:text-base">
                      {layer.title}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-wrap gap-2">
                    {layer.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border px-3 py-1.5 font-mono text-[11px] transition-colors duration-300"
                        style={{
                          borderColor: active ? "color-mix(in srgb, var(--color-tertiary) 45%, transparent)" : "var(--color-outline-variant)",
                          color: active ? "var(--color-on-surface)" : "var(--color-on-surface-variant)",
                          backgroundColor: active ? "color-mix(in srgb, var(--color-tertiary) 10%, transparent)" : "transparent",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <span className="hidden shrink-0 font-mono text-[11px] text-on-surface-faint md:block">
                    {layer.skills.length} tool{layer.skills.length > 1 ? "s" : ""}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

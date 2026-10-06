import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { certifications } from "@/data/content";
import { Award } from "lucide-react";

export function Certifications() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Cards are dealt onto the table like a hand of cards.
      gsap.from(".cert-card", {
        y: 120,
        x: (i) => (i - 1) * -60,
        rotate: (i) => (i - 1) * 9,
        rotateX: 40,
        autoAlpha: 0,
        transformPerspective: 1000,
        duration: 1.3,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: grid, start: "top 85%", once: true },
      });
    }, grid);
    return () => ctx.revert();
  }, []);

  return (
    <section className="container-px mx-auto max-w-7xl py-32 md:py-40">
      <SectionHeading
        eyebrow="Certifications"
        title="The theory behind the projects."
        className="mb-16"
      />

      <div ref={gridRef} className="spotlight-group grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert, i) => (
          <CertCard key={cert.name} cert={cert} index={i} />
        ))}
      </div>
    </section>
  );
}

function CertCard({
  cert,
  index,
}: {
  cert: (typeof certifications)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateX: py * -8,
      rotateY: px * 10,
      y: -4,
      duration: 0.4,
      ease: "power3.out",
      transformPerspective: 800,
    });
  };

  const handleLeave = () => {
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transformStyle: "preserve-3d",
        animationDelay: `${index * 0.05}s`,
      }}
      className="cert-card spotlight cursor-hover group relative overflow-hidden rounded-lg border border-outline-variant bg-surface-container p-7 transition-colors duration-300 hover:border-outline hover:bg-surface-container-high"
    >
      <div className="flex items-start justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant text-tertiary">
          <Award size={18} />
        </span>
        <Badge tone="accent">{cert.year}</Badge>
      </div>

      <h3 className="mt-6 text-lg font-semibold leading-snug tracking-tight text-on-surface">
        {cert.name}
      </h3>
      <p className="mt-1.5 text-sm text-on-surface-faint">{cert.issuer}</p>
      {cert.detail && (
        <p className="mt-4 text-xs leading-relaxed text-on-surface-variant">{cert.detail}</p>
      )}
    </div>
  );
}

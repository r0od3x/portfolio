import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { about } from "@/data/content";

/** Turns "*word*" into serif-italic accents. */
function withAccents(text: string) {
  return text.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="serif-i text-accent">
        {part}
      </span>
    ) : (
      part
    )
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let split: SplitText | undefined;

    const ctx = gsap.context(() => {
      // Words light up one by one as the reader scrolls through.
      split = SplitText.create(copyRef.current, { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: copyRef.current, start: "top 78%", end: "bottom 45%", scrub: true },
        }
      );

      gsap
        .timeline({ scrollTrigger: { trigger: ".about-facts", start: "top 88%", once: true } })
        .from(".fact-line", { scaleX: 0, transformOrigin: "0% 50%", duration: 1.4, stagger: 0.08 })
        .from(".fact-text", { yPercent: 105, duration: 1, stagger: 0.04 }, 0.15);
    }, sectionRef);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="about" className="page-x pb-32 pt-36 md:pb-44 md:pt-48">
      <SectionLabel index="01" label="About" note="Who's behind this" />

      <div className="grid-12 mt-14 md:mt-20">
        <span aria-hidden className="col-span-12 mb-6 grid h-4 w-4 grid-cols-2 gap-[2px] md:col-span-2 md:mb-0 md:mt-4">
          <span className="bg-accent" />
          <span className="bg-accent/40" />
          <span className="bg-accent/40" />
          <span className="bg-accent" />
        </span>
        <p
          ref={copyRef}
          className="col-span-12 text-[clamp(1.6rem,3.15vw,3rem)] font-medium leading-[1.14] tracking-[-0.025em] md:col-span-10"
        >
          {withAccents(about.statement)}
        </p>
      </div>

      <dl className="about-facts mt-24 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-32 lg:grid-cols-4">
        {about.facts.map((fact) => (
          <div key={fact.label} className="relative pt-5">
            <span aria-hidden className="fact-line absolute inset-x-0 top-0 h-px bg-line-2" />
            <dt className="overflow-hidden">
              <span className="fact-text label block text-fg-3">{fact.label}</span>
            </dt>
            <dd className="mt-3 overflow-hidden">
              <span className="fact-text block text-[19px] leading-snug">{fact.value}</span>
            </dd>
            <dd className="mt-1 overflow-hidden">
              <span className="fact-text label block text-fg-3">{fact.note}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

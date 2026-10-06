import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { RevealText } from "@/components/ui/RevealText";
import { ScrambleText } from "@/components/ui/ScrambleText";
import { SpinningBadge } from "@/components/ui/SpinningBadge";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { contact, profile } from "@/data/content";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubMark } from "@/components/ui/BrandIcons";

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // The card opens up from a smaller rounded window as it scrolls in.
      gsap.fromTo(
        cardRef.current,
        { scale: 0.84, clipPath: "inset(6% 10% 6% 10% round 64px)" },
        {
          scale: 1,
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "top 25%", scrub: 0.6 },
        }
      );
      gsap.from(".contact-cta > *", {
        y: 40,
        scale: 0.8,
        autoAlpha: 0,
        duration: 0.9,
        ease: "back.out(1.8)",
        stagger: 0.1,
        scrollTrigger: { trigger: ".contact-cta", start: "top 92%", once: true },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="container-px mx-auto max-w-7xl py-32 md:py-48">
      <div
        ref={cardRef}
        className="spotlight relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container px-8 py-20 text-center md:px-16 md:py-28"
      >
        <SpinningBadge
          text="Let's talk · Open to work · "
          className="absolute right-8 top-8 hidden w-28 opacity-80 md:block"
        >
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-tertiary" />
        </SpinningBadge>
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.12] blur-[100px]"
          style={{ background: "radial-gradient(circle, var(--color-tertiary), transparent 70%)" }}
        />

        <ScrambleText className="eyebrow relative">{contact.eyebrow}</ScrambleText>

        <RevealText
          as="h2"
          className="relative mx-auto mt-6 max-w-3xl text-balance font-sans text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-on-surface"
        >
          {contact.title}
        </RevealText>

        <p className="reveal-fade relative mx-auto mt-6 max-w-lg text-balance text-base leading-relaxed text-on-surface-variant">
          {contact.description}
        </p>

        <div className="contact-cta relative mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton variant="primary" href={`mailto:${profile.email}`}>
            <Mail size={15} /> Email me
          </MagneticButton>
          <MagneticButton variant="secondary" href={profile.socials.linkedin} external>
            LinkedIn <ArrowUpRight size={15} />
          </MagneticButton>
          <MagneticButton variant="secondary" href={profile.socials.github} external>
            <GithubMark size={15} /> GitHub
          </MagneticButton>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="cursor-hover reveal-fade relative mt-8 inline-block font-mono text-sm text-on-surface-faint transition-colors hover:text-tertiary"
        >
          {profile.email}
        </a>
      </div>
    </section>
  );
}

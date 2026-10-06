import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { useFitText } from "@/hooks/useFitText";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RollText } from "@/components/ui/RollText";
import { LiveClock } from "@/components/ui/LiveClock";
import { contact, profile } from "@/data/content";

const LINKS = [
  { label: "GitHub", href: profile.socials.github, note: "r0od3x", external: true },
  { label: "LinkedIn", href: profile.socials.linkedin, note: "Mohamed Reda Ghalbi", external: true },
  { label: "Résumé", href: profile.socials.resume, note: "PDF, 1 page", external: false },
];

/** Contact + footer, printed on a light sheet that slides over the page. */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const [copied, setCopied] = useState(false);

  useFitText(nameRef);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const splits: SplitText[] = [];
    const ctx = gsap.context(() => {
      const title = SplitText.create(titleRef.current, { type: "chars", mask: "lines" });
      const name = SplitText.create(nameRef.current, { type: "chars" });
      splits.push(title, name);

      gsap.from(title.chars, {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.04,
        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
      });
      gsap.from(".ct-reveal", {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.07,
        scrollTrigger: { trigger: ".ct-body", start: "top 85%", once: true },
      });
      // The footer name rises out of the bottom edge as the page bottoms out.
      gsap.from(name.chars, {
        yPercent: 100,
        ease: "none",
        stagger: { each: 0.05, from: "center" },
        scrollTrigger: { trigger: ".ct-footer", start: "top bottom", end: "bottom bottom", scrub: true },
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="page-x relative z-10 overflow-hidden rounded-t-[28px] bg-paper pt-24 text-on-paper md:rounded-t-[44px] md:pt-32"
    >
      <SectionLabel index="06" label="Contact" note={profile.availability} tone="paper" />

      <h2
        ref={titleRef}
        className="mt-12 text-[clamp(4.5rem,15vw,15rem)] font-medium leading-[0.9] tracking-[-0.06em] md:mt-16"
      >
        Let's <span className="serif-i tracking-[-0.025em] text-accent-ink">talk.</span>
      </h2>

      <div className="ct-body grid-12 mt-14 gap-y-12 md:mt-20">
        <p className="ct-reveal col-span-12 max-w-[40ch] text-[18px] leading-relaxed text-on-paper-2 md:col-span-5">
          {contact.description}
        </p>

        <div className="col-span-12 md:col-span-7">
          <p className="ct-reveal label text-on-paper-2">Email</p>
          <div className="ct-reveal mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`mailto:${profile.email}`}
              data-cursor="Write"
              className="draw-line break-all pb-1 text-[clamp(1.35rem,2.7vw,2.5rem)] font-medium tracking-[-0.03em]"
            >
              {profile.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="label rounded-full border border-on-paper/20 px-4 py-2 transition-colors hover:border-on-paper hover:bg-on-paper hover:text-paper"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>

          <ul className="mt-12 border-t border-on-paper/15">
            {LINKS.map((link) => (
              <li key={link.label} className="ct-reveal border-b border-on-paper/15">
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : { download: "Mohamed-Reda-Ghalbi-Resume.pdf" })}
                  className="roll-host group flex items-center justify-between gap-4 py-5"
                >
                  <span className="text-[clamp(1.3rem,2vw,1.75rem)] font-medium tracking-[-0.02em]">
                    <RollText>{link.label}</RollText>
                  </span>
                  <span className="label flex items-center gap-4 text-on-paper-2">
                    <span className="hidden sm:inline">{link.note}</span>
                    <span className="text-[16px] transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1">
                      {link.external ? "↗" : "↓"}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="ct-footer mt-28 md:mt-40">
        <div className="label grid grid-cols-2 gap-x-6 gap-y-3 border-t border-on-paper/15 pt-5 text-on-paper-2 md:grid-cols-4">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>
            Casablanca <LiveClock className="text-on-paper" />
          </span>
          <span>Built with React & GSAP</span>
          <button type="button" onClick={() => scrollToTarget(0)} className="roll-host text-left md:text-right">
            <RollText>Back to top ↑</RollText>
          </button>
        </div>
        <div className="mt-6 overflow-hidden">
          <p
            ref={nameRef}
            aria-hidden
            className="-mb-[0.14em] inline-block whitespace-nowrap font-semibold leading-[1] tracking-[-0.06em]"
          >
            Mohamed Reda Ghalbi
          </p>
        </div>
      </footer>
    </section>
  );
}

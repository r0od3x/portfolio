import { useEffect, useRef } from "react";
import { Mail, ArrowUp } from "lucide-react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandIcons";
import { profile } from "@/data/content";

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const bigRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const big = bigRef.current;
    if (!big || prefersReducedMotion()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      split = SplitText.create(big, { type: "chars", mask: "chars", charsClass: "fade-accent-char" });
      // Letters rise out of the floor as the page bottoms out.
      gsap.from(split.chars, {
        yPercent: 110,
        ease: "none",
        stagger: { each: 0.06, from: "center" },
        scrollTrigger: { trigger: footerRef.current, start: "top 85%", end: "bottom bottom", scrub: 0.8 },
      });
    }, footerRef);
    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <footer ref={footerRef} className="overflow-hidden border-t border-outline-variant">
      <div className="container-px mx-auto flex max-w-7xl flex-col gap-10 py-16">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="font-mono text-sm font-medium tracking-tight text-on-surface">
              M.R.G<span className="text-tertiary">/</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-on-surface-variant">
              AI &amp; Data Science engineering student building machine learning and
              full-stack systems in Casablanca, Morocco.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="cursor-hover flex h-11 w-11 items-center justify-center rounded-full border border-outline text-on-surface-variant transition-colors hover:border-tertiary/60 hover:text-tertiary"
            >
              <GithubMark size={17} />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="cursor-hover flex h-11 w-11 items-center justify-center rounded-full border border-outline text-on-surface-variant transition-colors hover:border-tertiary/60 hover:text-tertiary"
            >
              <LinkedinMark size={17} />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="cursor-hover flex h-11 w-11 items-center justify-center rounded-full border border-outline text-on-surface-variant transition-colors hover:border-tertiary/60 hover:text-tertiary"
            >
              <Mail size={17} />
            </a>
            <button
              onClick={() => scrollToTarget(0)}
              aria-label="Back to top"
              className="cursor-hover flex h-11 w-11 items-center justify-center rounded-full border border-outline text-on-surface-variant transition-colors hover:border-tertiary/60 hover:text-tertiary"
            >
              <ArrowUp size={17} />
            </button>
          </div>
        </div>

        <p
          ref={bigRef}
          aria-hidden
          className="text-fade-accent -mb-[0.18em] select-none whitespace-nowrap text-center font-sans text-[15.5vw] font-bold leading-[0.9] tracking-[-0.06em] xl:text-[12.5rem]"
        >
          Reda Ghalbi
        </p>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-outline-variant pt-8 text-xs text-on-surface-faint md:flex-row md:items-center">
          <p className="font-mono">© {new Date().getFullYear()} {profile.name}.</p>
          <p className="font-mono">Built with React · TypeScript · GSAP · Three.js</p>
        </div>
      </div>
    </footer>
  );
}

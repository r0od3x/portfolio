import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { useFitText } from "@/hooks/useFitText";
import { PixelPortrait } from "@/components/ui/PixelPortrait";
import { RollText } from "@/components/ui/RollText";
import { profile } from "@/data/content";

export function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useFitText(nameRef);

  // Hidden before first paint; the intro reveals everything.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.set([topRef.current, nameRef.current], { autoAlpha: 0 });
  }, []);

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const name = nameRef.current!;
        const chars = SplitText.create(name, {
          type: "chars",
          charsClass: "hero-char",
          ignore: name.querySelector(".sr-only") ?? undefined,
        }).chars;
        const statement = SplitText.create(statementRef.current, { type: "lines", mask: "lines" });

        gsap.set([topRef.current, name], { autoAlpha: 1 });

        gsap
          .timeline()
          .from(chars, {
            yPercent: 112,
            rotate: 6,
            transformOrigin: "0% 100%",
            duration: 1.5,
            stagger: 0.045,
          })
          .from(".hero-rule", { scaleX: 0, transformOrigin: "0% 50%", duration: 1.6 }, 0.2)
          .from(".hero-meta", { yPercent: 100, autoAlpha: 0, duration: 1, stagger: 0.06 }, 0.45)
          .from(statement.lines, { yPercent: 105, duration: 1.2, stagger: 0.08 }, 0.35)
          .from(".hero-fade", { y: 16, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.7)
          // Free the letters from the clip so they can drift on scroll, and only
          // now attach the scroll-out, so it records the letters' resting
          // position rather than the hidden "from" state of the intro.
          .call(() => {
            name.style.overflow = "visible";
            statement.revert();
            ctx?.add(() => {
              const scroll = { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true };
              // Each letter of the name lifts at its own speed.
              gsap.fromTo(
                chars,
                { yPercent: 0 },
                { yPercent: (i: number) => -30 - ((i * 37) % 70), ease: "none", scrollTrigger: scroll }
              );
              gsap.fromTo(
                topRef.current,
                { yPercent: 0, autoAlpha: 1 },
                { yPercent: -18, autoAlpha: 0.15, ease: "none", scrollTrigger: scroll }
              );
            });
          });
      }, sectionRef);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [ready]);

  return (
    <section ref={sectionRef} id="top" className="page-x relative flex min-h-[100svh] flex-col pt-24">
      <div ref={topRef} className="grid-12 flex-1 content-start gap-y-10">
        {/* Portrait first on mobile, right column on desktop */}
        <figure className="col-span-12 justify-self-center lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:justify-self-end">
          <PixelPortrait
            src="/avatar.webp"
            label={`Pixel-art portrait of ${profile.name}`}
            play={ready}
            dissolveTrigger={sectionRef}
            className="w-[min(72vw,340px)] lg:w-[min(28vw,46vh,440px)]"
          />
          <figcaption className="hero-fade label mt-3 flex justify-between gap-6 text-fg-3">
            <span>Fig. 00 — self-portrait, 60 × 60 px</span>
            <span className="hidden sm:inline">Move through it</span>
          </figcaption>
        </figure>

        <div className="col-span-12 lg:col-span-6 lg:row-start-1 lg:pt-6">
          <p className="hero-fade label text-fg-3">Portfolio — 2026</p>
          <p
            ref={statementRef}
            className="mt-5 max-w-[22ch] text-[clamp(1.85rem,min(3.1vw,5.4vh),3.1rem)] font-medium leading-[1.06] tracking-[-0.03em]"
          >
            Engineering student in Casablanca. I train models, then build the software that lets
            people <span className="serif-i text-accent">actually use them.</span>
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="button"
              onClick={() => scrollToTarget("#work")}
              className="hero-fade roll-host group inline-flex items-center gap-3 rounded-full bg-fg px-6 py-3.5 text-[15px] font-medium text-ink"
            >
              <RollText>Selected work</RollText>
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-y-0.5">↓</span>
            </button>
            <a
              href={profile.socials.resume}
              download="Mohamed-Reda-Ghalbi-Resume.pdf"
              className="hero-fade roll-host inline-flex items-center gap-2 text-[15px] font-medium"
            >
              <RollText>Résumé</RollText>
              <span className="label text-fg-3">PDF</span>
            </a>
          </div>

          <p className="hero-fade mt-8 flex items-center gap-3 text-[15px] text-fg-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-ok opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-ok" />
            </span>
            {profile.availability}
          </p>
        </div>
      </div>

      <div className="relative mt-8">
        <span aria-hidden className="hero-rule absolute inset-x-0 top-0 h-px bg-line-2" />
        <div className="label grid grid-cols-2 gap-x-6 gap-y-2 pt-4 text-fg-2 md:grid-cols-4">
          <span className="overflow-hidden">
            <span className="hero-meta block">AI & Data Science — EMSI</span>
          </span>
          <span className="overflow-hidden">
            <span className="hero-meta block">Prev. FedEx, GPC, Crédit du Maroc</span>
          </span>
          <span className="overflow-hidden">
            <span className="hero-meta block">Casablanca, MA — GMT+1</span>
          </span>
          <span className="overflow-hidden md:text-right">
            <span className="hero-meta block">Scroll ↓</span>
          </span>
        </div>
      </div>

      <h1
        ref={nameRef}
        className="relative -mb-[0.05em] -mt-[0.1em] inline-block self-start overflow-hidden whitespace-nowrap pb-[0.02em] pt-[0.16em] leading-[0.86] tracking-[-0.055em]"
      >
        <span className="font-semibold">Reda</span>{" "}
        <span className="serif-i pr-[0.04em] tracking-[-0.02em]">Ghalbi</span>
        <span className="sr-only">, {profile.role}</span>
      </h1>
    </section>
  );
}

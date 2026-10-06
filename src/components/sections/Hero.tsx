import { lazy, Suspense, useEffect, useId, useLayoutEffect, useRef } from "react";
import { gsap, SplitText, isTouchDevice, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ArrowUpRight, Download } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { profile, heroMetrics, terminalLines } from "@/data/content";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";
import { TerminalTyper } from "@/components/ui/TerminalTyper";

// Three.js is the heaviest dependency on the page: load it in its own chunk
// so the hero text paints without waiting for it.
const EngineerIllustration = lazy(() =>
  import("@/components/ui/EngineerIllustration/EngineerIllustration").then((m) => ({
    default: m.EngineerIllustration,
  }))
);

const EYEBROW = `Open to AI/ML internships & PFE · ${profile.location}`;

export function Hero({ ready }: { ready: boolean }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const illoRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const underlineRef = useRef<SVGSVGElement>(null);
  const orbA = useRef<HTMLDivElement>(null);
  const orbB = useRef<HTMLDivElement>(null);
  const gradientId = useId();

  // Hide the hero before first paint so nothing flashes before the intro.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    gsap.set(innerRef.current, { autoAlpha: 0 });
  }, []);

  // Intro timeline: runs once the preloader is gone and fonts are ready
  // (line breaks for the split are measured against the real font).
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const underline = underlineRef.current;
        const headline = SplitText.create(headlineRef.current, {
          type: "lines,words,chars",
          mask: "lines",
          ignore: underline ? [underline] : undefined,
        });
        const para = SplitText.create(paraRef.current, { type: "lines", mask: "lines" });
        const path = underline?.querySelector("path");
        const len = path?.getTotalLength() ?? 0;

        gsap.set(innerRef.current, { autoAlpha: 1 });
        if (path) gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

        gsap
          .timeline()
          .from(headline.chars, {
            yPercent: 120,
            rotate: 12,
            transformOrigin: "0% 100%",
            duration: 1.15,
            ease: "power4.out",
            stagger: 0.022,
          })
          .fromTo(
            eyebrowRef.current,
            { scrambleText: { text: " " } },
            {
              scrambleText: { text: EYEBROW, chars: "01<>/_#*", revealDelay: 0.2, speed: 0.5 },
              duration: 1.3,
              ease: "none",
            },
            0.1
          )
          .from(".hero-dot", { scale: 0, duration: 0.6, ease: "back.out(3)" }, 0.1)
          .from(
            illoRef.current,
            { scale: 0.55, autoAlpha: 0, rotate: -10, duration: 2, ease: "expo.out" },
            0.2
          )
          .from(para.lines, { yPercent: 105, duration: 1, ease: "power3.out", stagger: 0.08 }, 0.7)
          .from(
            ".hero-cta > *",
            { y: 36, autoAlpha: 0, scale: 0.85, duration: 0.8, ease: "back.out(1.7)", stagger: 0.09 },
            0.95
          )
          .from(".hero-terminal", { y: 24, autoAlpha: 0, duration: 0.9, ease: "expo.out" }, 1.0)
          .from(".hero-rule", { scaleX: 0, transformOrigin: "0% 50%", duration: 1.2, ease: "expo.out" }, 1.1)
          .from(
            ".hero-meta",
            { y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 },
            1.2
          )
          // Unwrap the split so the underline isn't clipped by line masks.
          .call(() => {
            headline.revert();
            para.revert();
          })
          .to(path ?? {}, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" });
      }, sectionRef);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [ready]);

  // Ambient motion: drifting orbs, mouse parallax, and scroll-away depth.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(orbA.current, { x: 40, y: -30, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(orbB.current, { x: -50, y: 40, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1 });

      gsap.fromTo(
        scrollRef.current,
        { yPercent: 0, scale: 1, opacity: 1 },
        {
        yPercent: -14,
        scale: 0.93,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true },
        }
      );
    }, sectionRef);

    let onMove: ((e: PointerEvent) => void) | undefined;
    if (!isTouchDevice()) {
      const copyX = gsap.quickTo(copyRef.current, "x", { duration: 1.2, ease: "power3.out" });
      const copyY = gsap.quickTo(copyRef.current, "y", { duration: 1.2, ease: "power3.out" });
      const illoX = gsap.quickTo(illoRef.current, "x", { duration: 1.4, ease: "power3.out" });
      const illoY = gsap.quickTo(illoRef.current, "y", { duration: 1.4, ease: "power3.out" });
      const illoR = gsap.quickTo(illoRef.current, "rotate", { duration: 1.4, ease: "power3.out" });

      onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        copyX(nx * -14);
        copyY(ny * -10);
        illoX(nx * 36);
        illoY(ny * 28);
        illoR(nx * 4);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    return () => {
      if (onMove) window.removeEventListener("pointermove", onMove);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28"
    >
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          ref={orbA}
          className="absolute left-[8%] top-[18%] h-[420px] w-[420px] rounded-full opacity-[0.12] blur-[110px]"
          style={{ background: "radial-gradient(circle, var(--color-tertiary), transparent 70%)" }}
        />
        <div
          ref={orbB}
          className="absolute right-[5%] top-[45%] h-[380px] w-[380px] rounded-full opacity-[0.08] blur-[110px]"
          style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-outline-variant) 1px, transparent 1px), linear-gradient(to bottom, var(--color-outline-variant) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 90%)",
          }}
        />
      </div>

      <div ref={scrollRef} className="w-full will-change-transform">
      <div ref={innerRef} className="container-px mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_400px] lg:gap-8">
          <div ref={copyRef}>
            <div className="eyebrow mb-8 flex items-center gap-3">
              <span className="hero-dot relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
              </span>
              <span ref={eyebrowRef} aria-label={EYEBROW}>
                {EYEBROW}
              </span>
            </div>

            <h1
              ref={headlineRef}
              className="max-w-5xl text-balance font-sans text-[clamp(2.6rem,6.2vw,5.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-on-surface"
            >
              I build intelligent software powered by{" "}
              <span
                className="text-brand-gradient relative inline-block pr-[0.04em]"
                style={{ filter: "drop-shadow(0 0 28px color-mix(in srgb, var(--color-tertiary) 35%, transparent))" }}
              >
                AI.
                <svg
                  ref={underlineRef}
                  aria-hidden
                  viewBox="0 0 120 16"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute -bottom-[0.14em] left-0 h-[0.22em] w-full overflow-visible"
                >
                  <defs>
                    <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="var(--color-tertiary)" />
                      <stop offset="50%" stopColor="var(--color-accent-blue)" />
                      <stop offset="100%" stopColor="var(--color-secondary)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M3 11 C 30 3, 72 2, 117 8"
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
            </h1>

            <p
              ref={paraRef}
              className="mt-8 max-w-xl text-balance font-sans text-lg leading-relaxed text-on-surface-variant"
            >
              {profile.name}: AI &amp; Data Science engineering student at EMSI. I take models
              from notebook to production: computer vision, LLM agents, forecasting pipelines,
              and the APIs and apps that put them in front of real users.
            </p>

            <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
              <MagneticButton variant="primary" onClick={() => scrollToTarget("#projects")}>
                View Projects <ArrowUpRight size={15} />
              </MagneticButton>
              <MagneticButton variant="secondary" onClick={() => scrollToTarget("#contact")}>
                Contact Me
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                href={profile.socials.resume}
                download="Mohamed-Reda-Ghalbi-Resume.pdf"
              >
                Résumé <Download size={15} />
              </MagneticButton>
            </div>

            <div className="relative mt-20 grid max-w-2xl grid-cols-3 gap-5 pt-8 sm:gap-8">
              <span aria-hidden className="hero-rule absolute inset-x-0 top-0 h-px bg-outline-variant" />
              {heroMetrics.map((m) => (
                <div key={m.label} className="hero-meta">
                  <div className="font-mono text-[clamp(1.5rem,3vw,2.2rem)] font-medium tracking-tight text-on-surface">
                    <AnimatedCounter value={m.value} suffix={m.suffix} waitFor={ready} delay={1.3} />
                  </div>
                  <p className="mt-1.5 text-xs leading-snug text-on-surface-faint">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Only one WebGL canvas is mounted at a time. Your GitHub avatar sits
              at the centre of the neural network, like on the profile header. */}
          <div
            ref={illoRef}
            className={
              isDesktop
                ? "flex w-full max-w-[700px] flex-col items-center gap-2 justify-self-end"
                : "order-first flex w-full flex-col items-center gap-4 justify-self-center"
            }
          >
            <div className={`relative w-full ${isDesktop ? "h-[420px]" : "mx-auto aspect-square max-w-[280px]"}`}>
              <div aria-hidden className="absolute inset-0">
                <Suspense fallback={null}>
                  <EngineerIllustration className="h-full w-full" />
                </Suspense>
              </div>
              <ProfileAvatar
                play={ready}
                delay={0.5}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
                  isDesktop ? "w-44" : "w-28"
                }`}
              />
            </div>
            <TerminalTyper
              lines={terminalLines}
              play={ready}
              className="hero-terminal w-[min(100%,430px)]"
            />
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

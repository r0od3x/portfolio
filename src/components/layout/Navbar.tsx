import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { RollText } from "@/components/ui/RollText";
import { LiveClock } from "@/components/ui/LiveClock";
import { profile } from "@/data/content";

const NAV = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ ready }: { ready: boolean }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const barRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!prefersReducedMotion()) gsap.set(barRef.current, { yPercent: -100 });
  }, []);

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    gsap.to(barRef.current, { yPercent: 0, duration: 1.2, delay: 0.5 });
  }, [ready]);

  // Solid background once scrolled; hide on the way down, return on the way up.
  useEffect(() => {
    const reduced = prefersReducedMotion();
    let hidden = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setSolid(y > 40);
        if (reduced) return;
        const hide = self.direction === 1 && y > window.innerHeight * 0.6;
        if (hide !== hidden) {
          hidden = hide;
          gsap.to(barRef.current, { yPercent: hide ? -100 : 0, duration: 0.6, overwrite: "auto" });
        }
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const triggers = NAV.map(({ href }) =>
      ScrollTrigger.create({
        trigger: href,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => setActive((cur) => (self.isActive ? href : cur === href ? null : cur)),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const go = (href: string) => {
    setOpen(false);
    scrollToTarget(href);
  };

  return (
    <>
      <header
        ref={barRef}
        className={`page-x fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
          solid && !open ? "border-b border-line bg-ink/90" : "border-b border-transparent"
        }`}
      >
        <nav className="grid h-[72px] grid-cols-2 items-center lg:grid-cols-3">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
            className="roll-host flex items-center gap-3 justify-self-start"
          >
            <img src="/avatar.webp" alt="" width={28} height={28} className="h-7 w-7 rounded-full" />
            <span className="text-[15px] font-medium tracking-[-0.01em]">
              <RollText>{profile.firstName + " " + profile.lastName}</RollText>
            </span>
          </a>

          <ul className="hidden items-center gap-8 justify-self-center lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.href);
                  }}
                  aria-current={active === item.href ? "true" : undefined}
                  className={`roll-host flex items-center gap-2 text-[14px] transition-colors hover:text-fg ${
                    active === item.href ? "text-fg" : "text-fg-2"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 bg-accent transition-transform duration-500 ${
                      active === item.href ? "scale-100" : "scale-0"
                    }`}
                  />
                  <RollText>{item.label}</RollText>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6 justify-self-end">
            <span className="label hidden text-fg-3 xl:inline">
              Casablanca <LiveClock className="text-fg-2" />
            </span>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("#contact");
              }}
              className="roll-host hidden rounded-full border border-line-2 px-4 py-2 text-[14px] transition-colors hover:border-fg hover:bg-fg hover:text-ink lg:inline-flex"
            >
              <RollText>Let's talk</RollText>
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="label rounded-full border border-line-2 px-4 py-2 text-fg lg:hidden"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </header>

      {open && <MobileMenu active={active} onNavigate={go} />}
    </>
  );
}

function MobileMenu({ active, onNavigate }: { active: string | null; onNavigate: (href: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.__lenis?.stop();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduced) return;
      gsap.from(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 0.8, ease: "expo.inOut" });
      gsap.from(".mm-item", { yPercent: 110, duration: 0.9, stagger: 0.06, delay: 0.25 });
      gsap.from(".mm-foot", { autoAlpha: 0, y: 10, duration: 0.6, delay: 0.5 });
    }, ref);
    return () => {
      ctx.revert();
      window.__lenis?.start();
    };
  }, []);

  return (
    <div id="mobile-menu" ref={ref} className="page-x fixed inset-0 z-40 flex flex-col bg-ink pb-8 pt-28 lg:hidden">
      <ul className="flex flex-col gap-1">
        {[{ label: "Home", href: "#top" }, ...NAV].map((item, i) => (
          <li key={item.href} className="overflow-hidden border-b border-line">
            <button
              type="button"
              onClick={() => onNavigate(item.href)}
              className="mm-item flex w-full items-baseline gap-4 py-4 text-left"
            >
              <span className="label text-fg-3">0{i}</span>
              <span
                className={`text-[clamp(2.4rem,11vw,3.5rem)] font-medium leading-none tracking-[-0.04em] ${
                  active === item.href ? "serif-i text-accent" : ""
                }`}
              >
                {item.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mm-foot label mt-auto flex justify-between text-fg-3">
        <span>
          Casablanca <LiveClock className="text-fg-2" />
        </span>
        <a href={`mailto:${profile.email}`} className="text-fg-2">
          Email ↗
        </a>
      </div>
    </div>
  );
}

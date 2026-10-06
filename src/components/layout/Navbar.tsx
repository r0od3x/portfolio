import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ ready }: { ready: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Hidden until the page intro starts.
  useLayoutEffect(() => {
    if (!prefersReducedMotion()) gsap.set(navRef.current, { yPercent: -100, autoAlpha: 0 });
  }, []);

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    gsap.to(navRef.current, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", delay: 0.6 });
  }, [ready]);

  // Background on scroll + hide on scroll down / reveal on scroll up.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const reduced = prefersReducedMotion();

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 24);
        if (reduced) return;
        const hide = self.direction === 1 && y > window.innerHeight * 0.8;
        gsap.to(nav, { yPercent: hide ? -100 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      },
    });
    return () => st.kill();
  }, []);

  // Track which section is in view.
  useEffect(() => {
    const triggers = NAV_ITEMS.map(({ href }) =>
      ScrollTrigger.create({
        trigger: href,
        start: "top center",
        end: "bottom center",
        onToggle: (self) =>
          setActive((cur) => (self.isActive ? href : cur === href ? null : cur)),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  // Glide the pill under the active item.
  useEffect(() => {
    const pill = pillRef.current;
    const target = active ? itemRefs.current[active] : null;
    if (!pill) return;
    if (!target) {
      gsap.to(pill, { autoAlpha: 0, duration: 0.3 });
      return;
    }
    gsap.to(pill, {
      x: target.offsetLeft,
      width: target.offsetWidth,
      autoAlpha: 1,
      duration: prefersReducedMotion() ? 0 : 0.6,
      ease: "expo.out",
    });
  }, [active]);

  const handleClick = (href: string) => {
    setOpen(false);
    scrollToTarget(href);
  };

  return (
    <div
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled
          ? "border-b border-outline-variant bg-surface/75 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-px mx-auto flex h-20 max-w-7xl items-center justify-between">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
          className="cursor-hover group flex items-center gap-3 font-mono text-sm font-medium tracking-tight text-on-surface"
        >
          <span className="relative h-8 w-8 shrink-0 rounded-full bg-brand-gradient p-[1.5px] transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
            <img
              src="/avatar.webp"
              alt=""
              width={32}
              height={32}
              className="h-full w-full rounded-full border border-surface object-cover"
            />
          </span>
          <span>
            M.R.G
            <span className="inline-block text-tertiary transition-transform duration-500 group-hover:rotate-[200deg]">
              /
            </span>
          </span>
        </a>

        <ul className="relative hidden items-center gap-2 lg:flex">
          <span
            ref={pillRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-1/2 h-9 -translate-y-1/2 rounded-full border border-tertiary/30 bg-tertiary/10 opacity-0"
          />
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <button
                ref={(el) => {
                  itemRefs.current[item.href] = el;
                }}
                onClick={() => handleClick(item.href)}
                aria-current={active === item.href ? "true" : undefined}
                className={`cursor-hover relative rounded-full px-4 py-2 font-mono text-[13px] tracking-wide transition-colors duration-300 hover:text-on-surface ${
                  active === item.href ? "text-on-surface" : "text-on-surface-variant"
                }`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <button
            onClick={() => handleClick("#contact")}
            className="cursor-hover group inline-flex items-center gap-1.5 rounded-full border border-outline px-5 py-2.5 font-mono text-[13px] text-on-surface transition-colors hover:border-tertiary/60"
          >
            Let's talk
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="cursor-hover flex h-10 w-10 items-center justify-center rounded-full border border-outline text-on-surface lg:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && <MobileMenu onNavigate={handleClick} />}
    </div>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: (href: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(ref.current, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "expo.out" });
      gsap.from("li", { y: 24, autoAlpha: 0, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="border-t border-outline-variant bg-surface px-6 pb-8 pt-4 lg:hidden">
      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map((item, i) => (
          <li key={item.href}>
            <button
              onClick={() => onNavigate(item.href)}
              className="flex w-full items-baseline gap-4 py-3 text-left font-sans text-2xl font-semibold tracking-tight text-on-surface"
            >
              <span className="font-mono text-xs text-tertiary">0{i + 1}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

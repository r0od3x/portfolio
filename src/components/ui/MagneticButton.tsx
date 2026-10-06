import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type MagneticButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
  href?: string;
  download?: boolean | string;
  external?: boolean;
  ariaLabel?: string;
};

export function MagneticButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  href,
  download,
  external,
  ariaLabel,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, { x: x * 0.35, y: y * 0.45, duration: 0.5, ease: "power3.out" });
    gsap.to(labelRef.current, { x: x * 0.15, y: y * 0.2, duration: 0.5, ease: "power3.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(wrapRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
    gsap.to(labelRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-mono text-sm font-medium tracking-tight transition-colors duration-300 overflow-hidden cursor-pointer select-none";
  const variants = {
    primary: "bg-on-surface text-surface",
    secondary: "bg-transparent text-on-surface border border-outline hover:border-tertiary/60",
  };

  const inner = (
    <span ref={labelRef} className="relative inline-flex items-center gap-2 z-10">
      {children}
    </span>
  );

  const shared = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    "aria-label": ariaLabel,
    className: `${base} ${variants[variant]} ${className}`,
  };

  const fill = variant === "primary" && (
    <span className="absolute inset-0 z-0 origin-bottom scale-y-0 bg-tertiary transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100" />
  );

  if (href) {
    return (
      <a
        ref={wrapRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        download={download}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...shared}
      >
        {fill}
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={wrapRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      {...shared}
    >
      {fill}
      {inner}
    </button>
  );
}

type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "outline";
  className?: string;
};

export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  const tones = {
    neutral: "bg-surface-container-high text-on-surface-variant",
    accent: "bg-tertiary-container text-on-tertiary-container",
    outline: "bg-transparent text-on-surface-variant border border-outline",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

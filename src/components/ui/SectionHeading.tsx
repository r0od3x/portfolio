import { RevealText } from "./RevealText";
import { ScrambleText } from "./ScrambleText";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "items-center text-center mx-auto" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-5 ${alignment} ${className}`}>
      <span className="eyebrow reveal-fade flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-tertiary/70" />
        <ScrambleText>{eyebrow}</ScrambleText>
      </span>
      <RevealText
        as="h2"
        className="text-balance font-sans text-[clamp(2rem,4.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-on-surface"
      >
        {title}
      </RevealText>
      {description && (
        <p className="max-w-xl text-balance font-sans text-base leading-relaxed text-on-surface-variant reveal-fade">
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Text whose letters roll up to a copy of themselves when the closest
 * `.roll-host` ancestor is hovered (styles in index.css). Screen readers get
 * the plain text once; the animated letters are hidden from them.
 */
export function RollText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`roll ${className}`}>
      <span className="sr-only">{children}</span>
      {Array.from(children).map((char, i) => (
        <span
          key={i}
          aria-hidden
          className="roll-letter"
          data-char={char}
          style={{ "--i": i } as React.CSSProperties}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

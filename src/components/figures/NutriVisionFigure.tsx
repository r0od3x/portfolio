import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { C, useFigure } from "./useFigure";

// A 10×10 pixel-art bowl, generated so it stays deterministic.
const FOOD = ["#7bc47f", "#f4a261", "#e9c46a", "#e76f51", "#8fd694", "#f6bd60"];
const BOWL = Array.from({ length: 100 }, (_, i) => {
  const x = i % 10;
  const y = Math.floor(i / 10);
  const d = Math.hypot(x - 4.5, y - 4.5);
  if (d > 4.9) return null;
  if (d > 4.0) return "#c9ced8";
  return FOOD[(x * 7 + y * 13 + ((x * y) % 5)) % FOOD.length];
}).map((fill, i) => ({ fill, x: i % 10, y: Math.floor(i / 10) }));

const OUTPUTS = [
  { k: "kcal", v: "412", w: 0.92 },
  { k: "mass", v: "286 g", w: 0.74 },
  { k: "protein", v: "24 g", w: 0.34 },
  { k: "fat", v: "18 g", w: 0.27 },
  { k: "carbs", v: "41 g", w: 0.5 },
];

const STAGES = [110, 96, 84, 72, 60, 48, 36];

export function NutriVisionFigure() {
  const ref = useRef<SVGSVGElement>(null);

  useFigure(ref, (q) => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    tl.fromTo(q(".nv-scan"), { y: 0, autoAlpha: 1 }, { y: 140, duration: 1.4, ease: "power1.inOut" })
      .to(q(".nv-scan"), { autoAlpha: 0, duration: 0.2 })
      .fromTo(
        q(".nv-packet"),
        { autoAlpha: 1 },
        {
          motionPath: { path: q(".nv-path")[0] as SVGPathElement },
          duration: 1.6,
          ease: "power2.inOut",
        },
        "-=0.2"
      )
      .to(q(".nv-stage"), { fill: C.accent, duration: 0.15, stagger: 0.12, yoyo: true, repeat: 1 }, "<0.3")
      .to(q(".nv-packet"), { autoAlpha: 0, duration: 0.2 })
      .fromTo(q(".nv-out"), { scaleX: 0.15 }, { scaleX: 1, transformOrigin: "0% 50%", duration: 0.9, stagger: 0.07 }, "-=0.1");
    return tl;
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 440"
      role="img"
      aria-label="Diagram: a food photo goes through EfficientNet-B3 and a dense layer that outputs calories, mass, protein, fat and carbs. Calorie error is 36.4 kcal against Google Research's 44.0 kcal baseline."
      className="h-full w-full font-mono"
    >
      {/* Column labels */}
      {[
        ["Input", 32],
        ["Model", 226],
        ["Output", 452],
      ].map(([t, x]) => (
        <text key={t} x={x} y={52} className="fig-text fill-fg-3 text-[11px] uppercase tracking-wider">
          {t}
        </text>
      ))}

      {/* Photo */}
      <rect className="fig-draw fill-ink-2 stroke-line-2" x={32} y={70} width={150} height={150} rx={8} strokeWidth={1.25} />
      {BOWL.map(
        (p, i) =>
          p.fill && (
            <rect key={i} className="fig-pop" x={45 + p.x * 12.4} y={83 + p.y * 12.4} width={11.4} height={11.4} fill={p.fill} />
          )
      )}
      <rect className="nv-scan" x={36} y={72} width={142} height={2} fill={C.accent2} opacity={0} />
      <text x={32} y={242} className="fig-text fill-fg-3 text-[11px]">
        photo.jpg · 300×300
      </text>

      {/* Model */}
      <path className="fig-draw stroke-line-2" d="M186 145 H220" strokeWidth={1.25} fill="none" />
      <rect className="fig-draw fill-ink-2 stroke-line-2" x={226} y={70} width={180} height={150} rx={8} strokeWidth={1.25} />
      {STAGES.map((h, i) => (
        <rect
          key={h}
          className="fig-pop nv-stage"
          x={246 + i * 21}
          y={145 - h / 2}
          width={12}
          height={h}
          rx={2}
          fill={i === STAGES.length - 1 ? C.accent : C.line}
        />
      ))}
      <text x={226} y={242} className="fig-text fill-fg-3 text-[11px]">
        EfficientNet-B3 → Dense(5)
      </text>
      <path className="fig-draw stroke-line-2" d="M410 145 H444" strokeWidth={1.25} fill="none" />

      {/* Outputs */}
      {OUTPUTS.map((o, i) => (
        <g key={o.k}>
          <text x={452} y={88 + i * 28} className="fig-text fill-fg-2 text-[11px] uppercase">
            {o.k}
          </text>
          <rect className="fig-bar nv-out" x={452} y={94 + i * 28} width={110 * o.w} height={6} rx={1} fill={i === 0 ? C.accent : C.fg3} />
          <text x={452 + 110 * o.w + 8} y={100 + i * 28} className="fig-text fill-fg text-[11px]">
            {o.v}
          </text>
        </g>
      ))}
      <text x={452} y={242} className="fig-text fill-fg-3 text-[11px]">
        example prediction
      </text>

      {/* Packet route */}
      <path className="nv-path" d="M107 145 H452" fill="none" stroke="none" />
      <circle className="nv-packet" r={4} fill={C.accent2} opacity={0} />

      {/* Benchmark */}
      <path className="fig-draw stroke-line" d="M32 282 H608" strokeWidth={1} />
      <text x={32} y={310} className="fig-text fill-fg-3 text-[11px] uppercase tracking-wider">
        Calorie MAE on Nutrition5K · lower is better
      </text>
      <text x={32} y={346} className="fig-text fill-fg-2 text-[12px]">
        Google Research
      </text>
      <rect className="fig-bar" x={180} y={336} width={352} height={12} rx={1} fill={C.fg3} />
      <text x={542} y={346} className="fig-text fill-fg-2 text-[12px]">
        44.0
      </text>
      <text x={32} y={382} className="fig-text fill-fg text-[12px]">
        NutriVision v4.1
      </text>
      <rect className="fig-bar" x={180} y={372} width={291} height={12} rx={1} fill={C.accent} />
      <text x={481} y={382} className="fig-text fill-accent text-[12px]">
        36.4 kcal
      </text>
      <text x={608} y={414} textAnchor="end" className="fig-text fill-accent text-[11px] uppercase tracking-wider">
        −17.3% error
      </text>
    </svg>
  );
}

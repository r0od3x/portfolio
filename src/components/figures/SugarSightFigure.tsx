import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { C, useFigure } from "./useFigure";

const FEATURES = ["glucose", "bmi", "age", "insulin", "pressure", "skin", "pregnancies", "pedigree"];
const START = [0.72, 0.6, 0.45, 0.3, 0.55, 0.4, 0.2, 0.5];
const TREE_X = [336, 406, 476];
const GAUGE = { cx: 566, cy: 250, r: 50 };

// Root → two children → four leaves, as [x1, y1, x2, y2] relative to the root.
const tree = (x: number) => {
  const root = { x, y: 100 };
  const kids = [-20, 20].map((dx) => ({ x: x + dx, y: 158 }));
  const leaves = kids.flatMap((k) => [-10, 10].map((dx) => ({ x: k.x + dx, y: 216, parent: k })));
  return { root, kids, leaves };
};
const TREES = TREE_X.map(tree);

export function SugarSightFigure() {
  const ref = useRef<SVGSVGElement>(null);

  useFigure(ref, (q) => {
    const knobs = q(".ss-knob");
    const needle = q(".ss-needle")[0];
    const arc = q(".ss-arc")[0];
    const risk = { v: 0.35 };
    gsap.set(arc, { drawSVG: "0% 35%" });
    gsap.set(needle, { rotation: -90 + 180 * 0.35, svgOrigin: `${GAUGE.cx} ${GAUGE.cy}` });

    const lightPath = (t: number) => {
      const leaf = Math.floor(Math.random() * 4);
      const edges = [q(`.ss-e-${t}-k${leaf >> 1}`)[0], q(`.ss-e-${t}-l${leaf}`)[0], q(`.ss-leaf-${t}-${leaf}`)[0]];
      gsap.timeline()
        .to(edges, { stroke: C.accent, fill: (i: number) => (i === 2 ? C.accent : "none"), duration: 0.2, stagger: 0.12 })
        .to(edges, { stroke: C.line, fill: (i: number) => (i === 2 ? C.fg3 : "none"), duration: 0.6 }, "+=1.4");
    };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8, repeatRefresh: true });
    tl.to(knobs, {
      x: () => (Math.random() - 0.5) * 70,
      duration: 0.9,
      stagger: 0.05,
      ease: "power3.inOut",
    });
    TREE_X.forEach((_, t) => tl.call(() => lightPath(t), [], `>-${t === 0 ? 0.1 : 0.05}`).to({}, { duration: 0.25 }));
    tl.to(q(".ss-vote"), { stroke: C.accent, duration: 0.2 })
      .to(risk, {
        v: () => 0.15 + Math.random() * 0.75,
        duration: 1.1,
        ease: "elastic.out(1, 0.6)",
        onUpdate: () => {
          gsap.set(needle, { rotation: -90 + 180 * risk.v });
          gsap.set(arc, { drawSVG: `0% ${risk.v * 100}%` });
        },
      })
      .to(q(".ss-vote"), { stroke: C.line, duration: 0.5 }, "+=0.4")
      .to({}, { duration: 1 });
    return tl;
  });

  const arcPath = `M${GAUGE.cx - GAUGE.r} ${GAUGE.cy} A${GAUGE.r} ${GAUGE.r} 0 0 1 ${GAUGE.cx + GAUGE.r} ${GAUGE.cy}`;

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 440"
      role="img"
      aria-label="Diagram: eight patient indicators feed a random forest of decision trees whose votes set a diabetes risk gauge. About 81% test accuracy."
      className="h-full w-full font-mono"
    >
      {/* Inputs */}
      <text x={32} y={52} className="fig-text fill-fg-3 text-[11px] uppercase tracking-wider">
        8 indicators
      </text>
      {FEATURES.map((f, i) => (
        <g key={f}>
          <text x={32} y={84 + i * 36} className="fig-text fill-fg-2 text-[10.5px] uppercase">
            {f}
          </text>
          <path className="fig-draw" d={`M140 ${80 + i * 36} H252`} stroke={C.line} strokeWidth={2} strokeLinecap="round" />
          <circle className="fig-pop ss-knob" cx={140 + START[i] * 112} cy={80 + i * 36} r={5.5} fill={i < 2 ? C.accent : C.fg2} />
        </g>
      ))}
      <path className="fig-draw" d="M266 200 H300" stroke={C.line} strokeWidth={1.25} fill="none" />

      {/* Forest */}
      <text x={316} y={52} className="fig-text fill-fg-3 text-[11px] uppercase tracking-wider">
        Random forest
      </text>
      {TREES.map((t, ti) => (
        <g key={ti}>
          {t.kids.map((k, ki) => (
            <path key={ki} className={`fig-draw ss-e-${ti}-k${ki}`} d={`M${t.root.x} ${t.root.y} L${k.x} ${k.y}`} stroke={C.line} strokeWidth={1.5} fill="none" />
          ))}
          {t.leaves.map((l, li) => (
            <g key={li}>
              <path className={`fig-draw ss-e-${ti}-l${li}`} d={`M${l.parent.x} ${l.parent.y} L${l.x} ${l.y}`} stroke={C.line} strokeWidth={1.5} fill="none" />
              <circle className={`fig-pop ss-leaf-${ti}-${li}`} cx={l.x} cy={l.y} r={4} fill={C.fg3} stroke={C.line} />
            </g>
          ))}
          <circle className="fig-pop" cx={t.root.x} cy={t.root.y} r={6} fill={C.ink2} stroke={C.fg2} strokeWidth={1.5} />
          {t.kids.map((k, ki) => (
            <circle key={ki} className="fig-pop" cx={k.x} cy={k.y} r={4.5} fill={C.ink2} stroke={C.fg3} strokeWidth={1.5} />
          ))}
          <path className="fig-draw" d={`M${t.root.x} 232 Q${t.root.x} 280 ${406} 296`} stroke={C.line} strokeWidth={1} fill="none" strokeDasharray="2 4" />
        </g>
      ))}
      <circle className="fig-draw ss-vote fill-ink-2" cx={406} cy={306} r={16} stroke={C.line} strokeWidth={1.5} />
      <text x={406} y={310} textAnchor="middle" className="fig-text fill-fg text-[12px]">
        Σ
      </text>
      <text x={406} y={346} textAnchor="middle" className="fig-text fill-fg-3 text-[11px]">
        majority vote
      </text>
      <path className="fig-draw" d="M424 306 H486 Q508 306 516 286" stroke={C.line} strokeWidth={1.25} fill="none" />

      {/* Gauge */}
      <text x={GAUGE.cx} y={170} textAnchor="middle" className="fig-text fill-fg-3 text-[11px] uppercase tracking-wider">
        Risk
      </text>
      <path className="fig-draw" d={arcPath} stroke={C.line} strokeWidth={8} fill="none" strokeLinecap="round" />
      <path className="ss-arc" d={arcPath} stroke={C.accent} strokeWidth={8} fill="none" strokeLinecap="round" />
      <line className="ss-needle" x1={GAUGE.cx} y1={GAUGE.cy} x2={GAUGE.cx} y2={GAUGE.cy - GAUGE.r + 10} stroke={C.fg} strokeWidth={2} strokeLinecap="round" />
      <circle cx={GAUGE.cx} cy={GAUGE.cy} r={5} fill={C.fg} />
      <text x={GAUGE.cx - GAUGE.r} y={GAUGE.cy + 22} textAnchor="middle" className="fig-text fill-fg-3 text-[10px]">
        low
      </text>
      <text x={GAUGE.cx + GAUGE.r} y={GAUGE.cy + 22} textAnchor="middle" className="fig-text fill-fg-3 text-[10px]">
        high
      </text>

      <path className="fig-draw" d="M32 384 H608" stroke={C.line} strokeWidth={1} />
      <text x={32} y={414} className="fig-text fill-fg-2 text-[12px]">
        Pima Indians dataset · 768 patients
      </text>
      <text x={608} y={414} textAnchor="end" className="fig-text fill-accent text-[12px]">
        ~81% test accuracy
      </text>
    </svg>
  );
}

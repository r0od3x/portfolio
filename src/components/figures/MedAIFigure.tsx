import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { C, useFigure } from "./useFigure";

const EDGES = {
  pt: "M92 206 Q118 112 168 100",
  to: "M226 116 Q262 186 282 204",
  od: "M320 262 V340",
  os: "M358 204 Q392 150 416 116",
  sr: "M470 100 Q544 108 560 190",
};

const STEPS = [
  { edge: "pt", node: "triage", text: "triage agent interviews the patient" },
  { edge: "to", node: "orch", text: "orchestrator routes the case" },
  { edge: "od", node: "doctor", text: "doctor validates and prescribes" },
  { edge: "od", node: "orch", text: "back to the orchestrator", reverse: true },
  { edge: "os", node: "synth", text: "synthesis agent drafts the report" },
  { edge: "sr", node: "report", text: "report ready" },
] as const;

export function MedAIFigure() {
  const ref = useRef<SVGSVGElement>(null);

  useFigure(ref, (q) => {
    const packet = q(".md-packet")[0];
    const status = q(".md-status")[0];
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });

    STEPS.forEach((step, i) => {
      const path = q(`.md-edge-${step.edge}`)[0] as SVGPathElement;
      const node = q(`.md-node-${step.node}`);
      tl.call(() => {
        status.textContent = `${i + 1}/${STEPS.length}  ${step.text}`;
      })
        .to(packet, {
          motionPath: { path, start: "reverse" in step ? 1 : 0, end: "reverse" in step ? 0 : 1 },
          duration: 0.9,
          ease: "power2.inOut",
        })
        // Fade in with the motion, so it never sits visible at the origin.
        .to(packet, { autoAlpha: 1, duration: 0.15 }, "<")
        // "<0.9" = when the 0.9s hop above lands.
        .to(node, { stroke: C.accent, duration: 0.2 }, "<0.9")
        .to(path, { stroke: C.accent, duration: 0.2 }, "<")
        .to([node, path], { stroke: C.line, duration: 0.6 }, step.node === "doctor" ? "+=0.9" : "+=0.35");
    });
    tl.to(packet, { autoAlpha: 0, duration: 0.2 });
    // The orchestrator's dashed ring turns once per loop (added last so it
    // spans the whole sequence instead of delaying it).
    tl.to(q(".md-ring"), { rotation: 360, svgOrigin: "320 220", duration: tl.duration(), ease: "none" }, 0);
    return tl;
  });

  const nodeLabel = (x: number, y: number, t: string, cls = "fill-fg-2") => (
    <text x={x} y={y} textAnchor="middle" className={`fig-text ${cls} text-[11px]`}>
      {t}
    </text>
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 440"
      role="img"
      aria-label="Diagram: patient to triage agent, orchestrator, doctor validation, back to the orchestrator, synthesis agent, then the final report."
      className="h-full w-full font-mono"
    >
      {/* Edges */}
      {Object.entries(EDGES).map(([k, d]) => (
        <path key={k} className={`fig-draw md-edge-${k}`} d={d} fill="none" stroke={C.line} strokeWidth={1.5} />
      ))}

      {/* Patient */}
      <rect className="fig-draw fill-ink-2" x={40} y={200} width={52} height={52} rx={10} stroke={C.line} strokeWidth={1.5} />
      <circle className="fig-pop" cx={66} cy={218} r={7} fill={C.fg3} />
      <path className="fig-pop" d="M53 242 Q66 226 79 242" fill={C.fg3} />
      {nodeLabel(66, 276, "patient")}

      {/* Triage */}
      <circle className="fig-draw md-node-triage fill-ink-2" cx={196} cy={98} r={30} stroke={C.line} strokeWidth={1.5} />
      {nodeLabel(196, 102, "T", "fill-fg")}
      {nodeLabel(196, 150, "triage")}

      {/* Orchestrator */}
      <circle className="md-ring" cx={320} cy={220} r={60} fill="none" stroke={C.line} strokeDasharray="3 7" />
      <circle className="fig-draw md-node-orch fill-ink-2" cx={320} cy={220} r={40} stroke={C.line} strokeWidth={1.5} />
      {nodeLabel(320, 224, "O", "fill-accent")}
      <text x={400} y={260} className="fig-text fill-fg-2 text-[11px]">
        orchestrator
      </text>
      <text x={400} y={276} className="fig-text fill-fg-3 text-[10px]">
        shared state
      </text>

      {/* Doctor: the human in the loop */}
      <circle className="fig-draw fill-none" cx={320} cy={372} r={36} stroke={C.line} strokeDasharray="2 4" />
      <circle className="fig-draw md-node-doctor fill-ink-2" cx={320} cy={372} r={28} stroke={C.line} strokeWidth={1.5} />
      {nodeLabel(320, 376, "Dr", "fill-fg")}
      <text x={366} y={376} className="fig-text fill-fg-2 text-[11px]">
        doctor · human in the loop
      </text>

      {/* Synthesis */}
      <circle className="fig-draw md-node-synth fill-ink-2" cx={444} cy={98} r={30} stroke={C.line} strokeWidth={1.5} />
      {nodeLabel(444, 102, "S", "fill-fg")}
      {nodeLabel(444, 150, "synthesis")}

      {/* Report */}
      <rect className="fig-draw md-node-report fill-ink-2" x={548} y={194} width={48} height={60} rx={6} stroke={C.line} strokeWidth={1.5} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className="fig-bar" x={557} y={208 + i * 10} width={i === 3 ? 18 : 30} height={3} rx={1} fill={C.fg3} />
      ))}
      {nodeLabel(572, 276, "report")}

      <circle className="md-packet" r={5} fill={C.accent2} opacity={0} />

      <text x={32} y={420} className="md-status fig-text fill-fg-3 text-[11px]">
        1/6  triage agent interviews the patient
      </text>
    </svg>
  );
}

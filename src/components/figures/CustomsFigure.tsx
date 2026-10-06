import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { C, useFigure } from "./useFigure";

const DOC = "M0 0 H92 L116 24 V150 H0 Z";
const ROWS = [0.82, 0.64, 0.9, 0.55, 0.72];
const LEDGER = [0.86, 0.6, 0.34];
// Share of each declaration left after allocation (oldest drawn down most).
const FIFO_LEFT = [0.35, 0.8, 1];

export function CustomsFigure() {
  const ref = useRef<SVGSVGElement>(null);

  useFigure(ref, (q) => {
    gsap.set(q(".cu-check"), { drawSVG: "0%" });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    tl.fromTo(q(".cu-scan"), { y: 0, autoAlpha: 1 }, { y: 146, duration: 1.5, ease: "power1.inOut" })
      .to(q(".cu-scan"), { autoAlpha: 0, duration: 0.2 })
      .to(q(".cu-chip"), { stroke: C.accent, duration: 0.2 }, "-=0.3")
      .fromTo(q(".cu-row"), { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%", duration: 0.5, stagger: 0.12 })
      .to(q(".cu-chip"), { stroke: C.line, duration: 0.4 }, "<")
      // FIFO: the oldest declaration is drawn down first.
      .to(q(".cu-ledger"), { scaleX: (i: number) => FIFO_LEFT[i], transformOrigin: "0% 50%", duration: 0.8, stagger: 0.25 })
      .fromTo(q(".cu-check"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: "power2.out" })
      .to(q(".cu-out"), { stroke: C.accent, duration: 0.2 }, "<")
      .to({}, { duration: 1.2 })
      .to(q(".cu-ledger"), { scaleX: 1, duration: 0.6 })
      .to(q(".cu-out"), { stroke: C.line, duration: 0.4 }, "<")
      .to(q(".cu-check"), { drawSVG: "0%", duration: 0.3 }, "<");
    return tl;
  });

  return (
    <svg
      ref={ref}
      viewBox="0 0 640 440"
      role="img"
      aria-label="Diagram: scanned PDF invoices go through OCR, fields fill a table, quantities are allocated first-in first-out against a PostgreSQL ledger, and a certificate is generated."
      className="h-full w-full font-mono"
    >
      {/* Stack of PDFs */}
      {[2, 1, 0].map((i) => (
        <path
          key={i}
          className="fig-draw fill-ink-2"
          transform={`translate(${36 + i * 12} ${84 - i * 12})`}
          d={DOC}
          stroke={C.line}
          strokeWidth={1.25}
        />
      ))}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} className="fig-bar" x={50} y={112 + i * 16} width={i % 3 === 2 ? 52 : 84} height={4} rx={1} fill={C.fg3} />
      ))}
      <rect className="cu-scan" x={38} y={86} width={112} height={2} fill={C.accent2} opacity={0} />
      <text x={36} y={262} className="fig-text fill-fg-3 text-[11px]">
        invoice_*.pdf · scans
      </text>

      {/* OCR chip */}
      <path className="fig-draw" d="M162 160 H198" stroke={C.line} strokeWidth={1.25} fill="none" />
      <rect className="fig-draw cu-chip fill-ink-2" x={198} y={142} width={118} height={36} rx={18} stroke={C.line} strokeWidth={1.25} />
      <text x={257} y={164} textAnchor="middle" className="fig-text fill-fg text-[11px]">
        OCR · pdfminer
      </text>
      <path className="fig-draw" d="M316 160 H350" stroke={C.line} strokeWidth={1.25} fill="none" />

      {/* Extracted table */}
      <rect className="fig-draw fill-ink-2" x={350} y={70} width={258} height={190} rx={8} stroke={C.line} strokeWidth={1.25} />
      {["article", "paper", "kg"].map((h, i) => (
        <text key={h} x={366 + i * 84} y={96} className="fig-text fill-fg-3 text-[10px] uppercase tracking-wider">
          {h}
        </text>
      ))}
      <path className="fig-draw" d="M350 108 H608" stroke={C.line} strokeWidth={1} />
      {ROWS.map((w, i) => (
        <g key={i}>
          <rect className="fig-bar cu-row" x={366} y={124 + i * 26} width={64 * w} height={6} rx={1} fill={C.fg3} />
          <rect className="fig-bar cu-row" x={450} y={124 + i * 26} width={60 * (1 - w / 2)} height={6} rx={1} fill={C.fg3} />
          <rect className="fig-bar cu-row" x={534} y={124 + i * 26} width={50 * w} height={6} rx={1} fill={i === 0 ? C.accent : C.fg2} />
        </g>
      ))}

      {/* Ledger (PostgreSQL), allocated FIFO */}
      <path className="fig-draw" d="M420 260 V300" stroke={C.line} strokeWidth={1.25} fill="none" />
      <ellipse className="fig-draw fill-ink-2" cx={420} cy={312} rx={70} ry={12} stroke={C.line} strokeWidth={1.25} />
      <path className="fig-draw" d="M350 312 V392 A70 12 0 0 0 490 392 V312" stroke={C.line} strokeWidth={1.25} fill="none" />
      {LEDGER.map((w, i) => (
        <rect key={i} className="fig-bar cu-ledger" x={364} y={334 + i * 18} width={112 * w} height={8} rx={1} fill={i === 0 ? C.accent : C.fg3} />
      ))}
      <text x={350} y={424} className="fig-text fill-fg-3 text-[11px]">
        declarations ledger · FIFO
      </text>

      {/* Output */}
      <path className="fig-draw" d="M490 352 H532" stroke={C.line} strokeWidth={1.25} fill="none" />
      <path className="fig-draw cu-out fill-ink-2" transform="translate(532 296) scale(0.62)" d={DOC} stroke={C.line} strokeWidth={2} />
      <path className="cu-check" d="M548 346 L560 358 L582 330" fill="none" stroke={C.accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <text x={532 + 36} y={424} textAnchor="middle" className="fig-text fill-fg-3 text-[11px]">
        .xlsx + .pdf
      </text>
    </svg>
  );
}

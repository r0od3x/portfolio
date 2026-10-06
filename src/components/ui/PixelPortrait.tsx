import { useEffect, useRef, type RefObject } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type PixelPortraitProps = {
  src: string;
  label: string;
  /** Cells per side. */
  grid?: number;
  /** Start the assemble-in animation. */
  play: boolean;
  /** Section whose scroll-out blows the pixels away. */
  dissolveTrigger?: RefObject<HTMLElement | null>;
  className?: string;
};

type Engine = { intro: () => void; destroy: () => void };

const ACCENT = [167, 139, 250];
const ACCENT_2 = [34, 211, 238];

/**
 * The GitHub avatar rebuilt from ~1.8k live pixels on a 2D canvas: they fly
 * in, get pushed around by the cursor (spring physics), tint violet where
 * touched, and drift away as the hero scrolls out. Only ticks while
 * something is actually moving and the canvas is on screen.
 */
export function PixelPortrait({
  src,
  label,
  grid = 60,
  play,
  dissolveTrigger,
  className = "",
}: PixelPortraitProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const playRef = useRef(play);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const engine = createEngine(canvas, wrap, src, grid, dissolveTrigger?.current ?? null);
    engineRef.current = engine;
    if (playRef.current) engine.intro();
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [src, grid, dissolveTrigger]);

  useEffect(() => {
    playRef.current = play;
    if (play) engineRef.current?.intro();
  }, [play]);

  return (
    <div ref={wrapRef} className={`relative aspect-square touch-pan-y ${className}`}>
      <canvas ref={canvasRef} role="img" aria-label={label} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

function createEngine(
  canvas: HTMLCanvasElement,
  wrap: HTMLElement,
  src: string,
  grid: number,
  dissolveEl: HTMLElement | null
): Engine {
  const ctx = canvas.getContext("2d")!;
  const reduced = prefersReducedMotion();

  let n = 0;
  let hx = new Float32Array(0); // home, in grid units
  let hy = new Float32Array(0);
  let sx = new Float32Array(0); // scatter offset for the intro
  let sy = new Float32Array(0);
  let delay = new Float32Array(0);
  let driftX = new Float32Array(0); // where the pixel blows to on scroll-out
  let driftY = new Float32Array(0);
  let fade = new Float32Array(0);
  let ox = new Float32Array(0); // cursor displacement (css px) + velocity
  let oy = new Float32Array(0);
  let vx = new Float32Array(0);
  let vy = new Float32Array(0);
  let tint = new Float32Array(0);
  let tintCyan = new Uint8Array(0);
  let rgb = new Uint8Array(0);
  let colors: string[] = [];
  // Cells bucketed by (posterised) colour, so a frame is ~one fill per colour
  // instead of one fillStyle switch + fill per cell.
  let groups: { color: string; cells: Uint16Array }[] = [];

  const state = { intro: reduced ? 1 : 0, dissolve: 0 };
  const pointer = { x: -1e4, y: -1e4, inside: false, lastMove: 0 };
  let cssSize = 0;
  let dpr = 1;
  let cell = 0;
  let loaded = false;
  let wantIntro = false;
  let visible = true;
  let ticking = false;
  let tweening = 0;
  let destroyed = false;
  let drawQueued = 0;
  const tweens: gsap.core.Animation[] = [];

  // ---------- setup ----------

  const sample = (img: HTMLImageElement) => {
    const off = document.createElement("canvas");
    off.width = off.height = grid;
    const o = off.getContext("2d", { willReadFrequently: true })!;
    o.imageSmoothingEnabled = true;
    o.imageSmoothingQuality = "high";
    o.drawImage(img, 0, 0, grid, grid);
    const data = o.getImageData(0, 0, grid, grid).data;

    // Background = average of the four corners; anything close to it is dropped
    // so the figure floats on the page instead of sitting in a purple square.
    const corner = (x: number, y: number) => (y * grid + x) * 4;
    const bg = [0, 1, 2].map(
      (c) =>
        (data[corner(1, 1) + c] +
          data[corner(grid - 2, 1) + c] +
          data[corner(1, grid - 2) + c] +
          data[corner(grid - 2, grid - 2) + c]) /
        4
    );

    const keep: number[] = [];
    for (let i = 0; i < grid * grid; i++) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      const dist = Math.hypot(r - bg[0], g - bg[1], b - bg[2]);
      if (dist > 42) keep.push(i);
    }

    n = keep.length;
    hx = new Float32Array(n);
    hy = new Float32Array(n);
    sx = new Float32Array(n);
    sy = new Float32Array(n);
    delay = new Float32Array(n);
    driftX = new Float32Array(n);
    driftY = new Float32Array(n);
    fade = new Float32Array(n);
    ox = new Float32Array(n);
    oy = new Float32Array(n);
    vx = new Float32Array(n);
    vy = new Float32Array(n);
    tint = new Float32Array(n);
    tintCyan = new Uint8Array(n);
    rgb = new Uint8Array(n * 3);
    colors = new Array(n);

    const cx = grid * 0.5;
    const cy = grid * 0.42;
    const maxD = Math.hypot(grid, grid) * 0.6;

    keep.forEach((idx, i) => {
      const x = idx % grid;
      const y = Math.floor(idx / grid);
      hx[i] = x;
      hy[i] = y;

      let r = data[idx * 4];
      let g = data[idx * 4 + 1];
      let b = data[idx * 4 + 2];
      // Lift the near-blacks (hair, hoodie) so the silhouette reads on navy.
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (lum < 48) {
        const k = 0.45 * (1 - lum / 48);
        r = r + (42 - r) * k;
        g = g + (49 - g) * k;
        b = b + (80 - b) * k;
      }
      // Posterise to 16 levels per channel: on-style for pixel art, and it keeps
      // the number of colour groups (and so fill calls) small.
      r = Math.round(r / 17) * 17;
      g = Math.round(g / 17) * 17;
      b = Math.round(b / 17) * 17;
      rgb[i * 3] = r;
      rgb[i * 3 + 1] = g;
      rgb[i * 3 + 2] = b;
      colors[i] = `rgb(${r | 0},${g | 0},${b | 0})`;

      // Build outward from the face, with some noise so it doesn't look radial.
      const d = Math.hypot(x - cx, y - cy) / maxD;
      delay[i] = Math.min(1, d * 0.75 + Math.random() * 0.25);
      const a = Math.random() * Math.PI * 2;
      const rad = grid * (0.2 + Math.random() * 0.55);
      sx[i] = Math.cos(a) * rad;
      sy[i] = Math.sin(a) * rad - grid * 0.15;

      driftX[i] = (Math.random() - 0.5) * 1.2;
      driftY[i] = -(0.35 + Math.random() * 0.9);
      fade[i] = Math.random();
      tintCyan[i] = Math.random() < 0.25 ? 1 : 0;
    });

    const byColor = new Map<string, number[]>();
    for (let i = 0; i < n; i++) {
      const list = byColor.get(colors[i]);
      if (list) list.push(i);
      else byColor.set(colors[i], [i]);
    }
    groups = [...byColor].map(([color, cells]) => ({ color, cells: Uint16Array.from(cells) }));
  };

  const resize = () => {
    cssSize = wrap.clientWidth;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(cssSize * dpr);
    canvas.height = Math.round(cssSize * dpr);
    cell = cssSize / grid;
    draw();
  };

  // ---------- render ----------

  const colorFor = (i: number) => {
    const t = Math.min(1, tint[i]);
    if (t < 0.02) return colors[i];
    const A = tintCyan[i] ? ACCENT_2 : ACCENT;
    const r = rgb[i * 3] + (A[0] - rgb[i * 3]) * t;
    const g = rgb[i * 3 + 1] + (A[1] - rgb[i * 3 + 1]) * t;
    const b = rgb[i * 3 + 2] + (A[2] - rgb[i * 3 + 2]) * t;
    return `rgb(${r | 0},${g | 0},${b | 0})`;
  };

  // Position + size of cell i for the current frame, or null if invisible.
  const frame = { x: 0, y: 0, w: 0 };
  const place = (i: number, s: number, gap: number, I: number, D: number) => {
    const W = 0.5;
    let t = (I * (1 + W) - delay[i]) / W;
    if (t <= 0) return false;
    if (t > 1) t = 1;
    const e = 1 - (1 - t) * (1 - t) * (1 - t);

    let x = (hx[i] + sx[i] * (1 - e)) * cell + ox[i];
    let y = (hy[i] + sy[i] * (1 - e)) * cell + oy[i];
    let size = e;
    if (D > 0) {
      const d = Math.min(1, Math.max(0, D * 1.5 - fade[i] * 0.5));
      x += driftX[i] * d * cssSize * 0.35;
      y += driftY[i] * d * cssSize * 0.6;
      size *= 1 - d;
    }
    if (size < 0.03) return false;

    const w = Math.max(1, (s - gap) * size);
    frame.x = Math.round(x * dpr + (s - w) / 2);
    frame.y = Math.round(y * dpr + (s - w) / 2);
    frame.w = Math.ceil(w);
    return true;
  };

  function draw() {
    if (!loaded || !cssSize) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const s = cell * dpr;
    const gap = cell >= 5 ? Math.max(1, dpr * 0.75) : 0;
    const I = state.intro;
    const D = state.dissolve;

    // Untinted cells: one path + one fill per colour group.
    for (const group of groups) {
      ctx.beginPath();
      let any = false;
      for (let k = 0; k < group.cells.length; k++) {
        const i = group.cells[k];
        if (tint[i] >= 0.02 || !place(i, s, gap, I, D)) continue;
        ctx.rect(frame.x, frame.y, frame.w, frame.w);
        any = true;
      }
      if (any) {
        ctx.fillStyle = group.color;
        ctx.fill();
      }
    }

    // Tinted cells (near the cursor / flickering) are few: draw them singly.
    for (let i = 0; i < n; i++) {
      if (tint[i] < 0.02 || !place(i, s, gap, I, D)) continue;
      ctx.fillStyle = colorFor(i);
      ctx.fillRect(frame.x, frame.y, frame.w, frame.w);
    }
  }

  const requestDraw = () => {
    if (ticking || drawQueued) return;
    drawQueued = requestAnimationFrame(() => {
      drawQueued = 0;
      draw();
    });
  };

  // ---------- physics ----------

  const step = () => {
    let moving = false;
    const R = Math.max(56, cssSize * 0.15);
    const R2 = R * R;
    const usePointer = pointer.inside && state.dissolve < 0.5;

    for (let i = 0; i < n; i++) {
      if (usePointer) {
        const dx = (hx[i] + 0.5) * cell + ox[i] - pointer.x;
        const dy = (hy[i] + 0.5) * cell + oy[i] - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * (1 - d / R);
          vx[i] += (dx / d) * f * 2.6;
          vy[i] += (dy / d) * f * 2.6;
          if (f > tint[i]) tint[i] = f;
        }
      }
      vx[i] = (vx[i] - ox[i] * 0.055) * 0.84;
      vy[i] = (vy[i] - oy[i] * 0.055) * 0.84;
      ox[i] += vx[i];
      oy[i] += vy[i];
      tint[i] *= 0.95;

      if (
        Math.abs(ox[i]) > 0.05 ||
        Math.abs(oy[i]) > 0.05 ||
        Math.abs(vx[i]) > 0.02 ||
        Math.abs(vy[i]) > 0.02 ||
        tint[i] > 0.02
      )
        moving = true;
    }
    return moving;
  };

  const tick = () => {
    const moving = step();
    draw();
    // A resting cursor exerts no new force, so idle as soon as things settle.
    const pointerActive = pointer.inside && performance.now() - pointer.lastMove < 120;
    if (!moving && !pointerActive && !tweening) stop();
  };

  function start() {
    if (ticking || destroyed || !visible || reduced || !loaded) return;
    ticking = true;
    gsap.ticker.add(tick);
  }
  function stop() {
    if (!ticking) return;
    ticking = false;
    gsap.ticker.remove(tick);
  }

  // ---------- interaction ----------

  const toLocal = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, r };
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const { x, y, r } = toLocal(e);
    const pad = 40;
    const inside = x > -pad && y > -pad && x < r.width + pad && y < r.height + pad;
    pointer.x = x;
    pointer.y = y;
    pointer.inside = inside;
    if (inside) {
      pointer.lastMove = performance.now();
      start();
    }
  };

  // Click / tap: a shockwave from that point.
  const onDown = (e: PointerEvent) => {
    const { x, y, r } = toLocal(e);
    if (x < 0 || y < 0 || x > r.width || y > r.height) return;
    const R = cssSize * 0.4;
    for (let i = 0; i < n; i++) {
      const dx = (hx[i] + 0.5) * cell - x;
      const dy = (hy[i] + 0.5) * cell - y;
      const d = Math.hypot(dx, dy) || 1;
      if (d > R) continue;
      const f = 1 - d / R;
      vx[i] += (dx / d) * f * 22;
      vy[i] += (dy / d) * f * 22;
      tint[i] = Math.max(tint[i], f);
    }
    start();
  };

  // Every few seconds a handful of pixels flicker, so it feels alive at rest.
  const glitch = gsap.delayedCall(2.6, function loop() {
    if (visible && loaded && state.intro >= 1 && state.dissolve < 0.2 && n) {
      const count = 6 + Math.floor(Math.random() * 8);
      for (let k = 0; k < count; k++) tint[Math.floor(Math.random() * n)] = 1;
      start();
    }
    glitch.restart(true);
  });
  if (reduced) glitch.kill();

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) stop();
    else if (tweening) start();
  });
  io.observe(wrap);

  const ro = new ResizeObserver(resize);
  ro.observe(wrap);

  window.addEventListener("pointermove", onMove, { passive: true });
  canvas.addEventListener("pointerdown", onDown);

  let st: ScrollTrigger | undefined;
  if (dissolveEl && !reduced) {
    st = ScrollTrigger.create({
      trigger: dissolveEl,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        state.dissolve = self.progress;
        requestDraw();
      },
    });
  }

  const img = new Image();
  img.decoding = "async";
  img.onload = () => {
    if (destroyed) return;
    sample(img);
    loaded = true;
    resize();
    if (wantIntro) runIntro();
  };
  img.src = src;

  function runIntro() {
    if (reduced) {
      state.intro = 1;
      draw();
      return;
    }
    tweening++;
    start();
    tweens.push(
      gsap.fromTo(
        state,
        { intro: 0 },
        {
          intro: 1,
          duration: 2.4,
          ease: "none",
          onComplete: () => {
            tweening--;
          },
        }
      )
    );
  }

  return {
    intro: () => {
      if (wantIntro) return;
      wantIntro = true;
      if (loaded) runIntro();
    },
    destroy: () => {
      destroyed = true;
      stop();
      cancelAnimationFrame(drawQueued);
      glitch.kill();
      tweens.forEach((t) => t.kill());
      st?.kill();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
    },
  };
}

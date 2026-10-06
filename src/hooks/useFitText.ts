import { useLayoutEffect, type RefObject } from "react";

/**
 * Scales an element's font-size so its text exactly fills its parent's width.
 * Measures once at a reference size, then derives the final size, so it costs
 * one layout per resize rather than a search loop.
 */
export function useFitText(ref: RefObject<HTMLElement | null>, max = Infinity) {
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      el.style.fontSize = "100px";
      const width = el.scrollWidth;
      const cs = getComputedStyle(parent);
      const available = parent.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      if (!width) return;
      el.style.fontSize = `${Math.min(max, (100 * available) / width)}px`;
    };

    fit();
    document.fonts?.ready.then(fit);
    // Only width matters; ignoring height changes avoids refitting in a loop.
    let lastWidth = parent.clientWidth;
    const ro = new ResizeObserver(() => {
      if (parent.clientWidth === lastWidth) return;
      lastWidth = parent.clientWidth;
      fit();
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, [ref, max]);
}

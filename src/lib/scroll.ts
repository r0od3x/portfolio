/** Smooth-scrolls to a selector, through Lenis when it's running. */
export function scrollToTarget(target: string | number) {
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6, offset: typeof target === "string" ? -20 : 0 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
}

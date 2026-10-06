import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

// SplitText and ScrambleText have been free (and bundled in the gsap
// package) since GSAP 3.13.
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin);

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;

export { gsap, ScrollTrigger, SplitText };

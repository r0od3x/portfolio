import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { CustomEase } from "gsap/CustomEase";

// SplitText, ScrambleText, DrawSVG and MotionPath have been free (and bundled
// in the gsap package) since GSAP 3.13.
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, MotionPathPlugin, CustomEase);

// House easing: a fast start that settles slowly, used for most reveals.
CustomEase.create("settle", "0.16, 1, 0.3, 1");
gsap.defaults({ ease: "settle", duration: 1 });

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isTouchDevice = () => window.matchMedia("(pointer: coarse)").matches;

export { gsap, ScrollTrigger, SplitText };

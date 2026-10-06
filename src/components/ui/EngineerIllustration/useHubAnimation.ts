import type { RefObject } from "react";
import * as THREE from "three";

export function animateHubs(
  hubs: RefObject<THREE.Points | null>,
  time: number
) {
  if (!hubs.current) return;

  const scale = 1 + Math.sin(time * 2.1) * 0.12;

  hubs.current.scale.set(scale, scale, scale);

  hubs.current.rotation.z =
    Math.sin(time * 0.4) * 0.04;
}
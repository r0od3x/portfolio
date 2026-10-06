import * as THREE from "three";
import type { Particle } from "./types";

const COUNT = 320;

export function createGraph(): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < COUNT; i++) {
    // Random position on a sphere
    const radius = 1.8 + Math.random() * 1.8;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const position = new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );

    particles.push({
      position,

      // Home position (particles always try to return here)
      base: position.clone(),

      // Small random velocity
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002,
        (Math.random() - 0.5) * 0.002
      ),
    });
  }

  return particles;
}
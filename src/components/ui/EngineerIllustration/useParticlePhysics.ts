import * as THREE from "three";
import type { Particle } from "./types";

const RETURN_FORCE = 0.025;
const MOUSE_RADIUS = 1.2;
const MOUSE_FORCE = 0.05;

export function updateParticles(
  particles: Particle[],
  mouse: THREE.Vector2,
  time: number
) {
  particles.forEach((p, i) => {
    // Drift
    p.position.add(p.velocity);

    // Return toward original position
    p.position.lerp(p.base, RETURN_FORCE);

    // Organic breathing
    p.position.x +=
      Math.sin(time + i * 0.21) * 0.0008;

    p.position.y +=
      Math.cos(time * 0.8 + i * 0.37) * 0.0008;

    // Mouse interaction
    const mx = mouse.x * 3;
    const my = mouse.y * 2;

    const dx = p.position.x - mx;
    const dy = p.position.y - my;

    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MOUSE_RADIUS) {
      const force =
        (MOUSE_RADIUS - dist) * MOUSE_FORCE;

      p.position.x += dx * force;
      p.position.y += dy * force;
    }

    // Soft boundary
    if (p.position.length() > 3.7) {
      p.velocity.multiplyScalar(-1);
    }

    // Damping
    p.velocity.multiplyScalar(0.9995);
  });
}
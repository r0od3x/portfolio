import * as THREE from "three";

export interface Particle {
  position: THREE.Vector3;

  // Original position
  base: THREE.Vector3;

  // Small drifting velocity
  velocity: THREE.Vector3;
}
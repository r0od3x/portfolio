import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { Particle } from "./types";

interface Props {
  particles: Particle[];
}

const MAX_DISTANCE = 0.75;

export function Connections({ particles }: Props) {
  const lines = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const maxConnections = particles.length * 12;

    const vertices = new Float32Array(maxConnections * 2 * 3);

    const geo = new THREE.BufferGeometry();

    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(vertices, 3)
    );

    geo.setDrawRange(0, 0);

    return geo;
  }, [particles]);

  useFrame((state) => {
    const attribute = geometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;

    const array = attribute.array as Float32Array;

    let ptr = 0;

    const time = state.clock.elapsedTime;

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];

        const d = a.position.distanceTo(b.position);

        if (d > MAX_DISTANCE) continue;

        array[ptr++] = a.position.x;
        array[ptr++] = a.position.y;
        array[ptr++] = a.position.z;

        array[ptr++] = b.position.x;
        array[ptr++] = b.position.y;
        array[ptr++] = b.position.z;
      }
    }

    attribute.needsUpdate = true;

    geometry.setDrawRange(0, ptr / 3);

    if (lines.current) {
      lines.current.rotation.y = time * 0.04;
      lines.current.rotation.x = Math.sin(time * 0.15) * 0.05;
    }
  });

  return (
    <lineSegments
      ref={lines}
      geometry={geometry}
    >
      <lineBasicMaterial
        color="#8B5CF6"
        transparent
        opacity={0.22}
      />
    </lineSegments>
  );
}
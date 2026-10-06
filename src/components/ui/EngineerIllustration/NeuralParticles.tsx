import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { Particle } from "./types";

import { useMouseField } from "./useMouseField";
import { updateParticles } from "./useParticlePhysics";
import { animateHubs } from "./useHubAnimation";

interface Props {
  particles: Particle[];
}

const HUB_COUNT = 18;

export function NeuralParticles({ particles }: Props) {
  const mouse = useMouseField();

  const points = useRef<THREE.Points>(null);
  const hubs = useRef<THREE.Points>(null);

  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const hubGeometryRef = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() => {
    const array = new Float32Array(particles.length * 3);

    particles.forEach((p, i) => {
      array[i * 3] = p.position.x;
      array[i * 3 + 1] = p.position.y;
      array[i * 3 + 2] = p.position.z;
    });

    return array;
  }, [particles]);

  const hubPositions = useMemo(() => {
    const array = new Float32Array(HUB_COUNT * 3);

    for (let i = 0; i < HUB_COUNT; i++) {
      const p = particles[(i * 17) % particles.length];

      array[i * 3] = p.position.x;
      array[i * 3 + 1] = p.position.y;
      array[i * 3 + 2] = p.position.z;
    }

    return array;
  }, [particles]);

  useFrame((state) => {
    if (!geometryRef.current || !hubGeometryRef.current) return;

    const attr = geometryRef.current.getAttribute(
      "position"
    ) as THREE.BufferAttribute;

    const hubAttr = hubGeometryRef.current.getAttribute(
      "position"
    ) as THREE.BufferAttribute;

    // Attributes are attached on mount; skip any frame that lands before that.
    if (!attr || !hubAttr) return;

    const array = attr.array as Float32Array;
    const hubArray = hubAttr.array as Float32Array;

    const time = state.clock.elapsedTime;

    // Physics
    updateParticles(
      particles,
      mouse.current,
      time
    );

    // Copy particle positions into GPU buffer
    particles.forEach((p, i) => {
      array[i * 3] = p.position.x;
      array[i * 3 + 1] = p.position.y;
      array[i * 3 + 2] = p.position.z;
    });

    // Update hub positions
    for (let i = 0; i < HUB_COUNT; i++) {
      const p = particles[(i * 17) % particles.length];

      hubArray[i * 3] = p.position.x;
      hubArray[i * 3 + 1] = p.position.y;
      hubArray[i * 3 + 2] = p.position.z;
    }

    attr.needsUpdate = true;
    hubAttr.needsUpdate = true;

    // Rotate particle cloud
    if (points.current) {
      points.current.rotation.y = time * 0.04;
      points.current.rotation.x = Math.sin(time * 0.15) * 0.05;
    }

    // Animate hubs
    animateHubs(hubs, time);
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry ref={geometryRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>

        <pointsMaterial
          color="#C4B5FD"
          size={0.05}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      <points ref={hubs}>
        <bufferGeometry ref={hubGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[hubPositions, 3]} />
        </bufferGeometry>

        <pointsMaterial
          color="#22D3EE"
          size={0.12}
          transparent
          opacity={1}
          depthWrite={false}
        />
      </points>
    </>
  );
}
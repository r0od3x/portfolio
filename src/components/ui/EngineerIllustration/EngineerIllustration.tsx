import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

import { createGraph } from "./NeuralGraph";
import { NeuralParticles } from "./NeuralParticles";
import { Connections } from "./Connections";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface Props {
  className?: string;
}

export function EngineerIllustration({ className = "" }: Props) {
  // Create the graph ONCE.
  const particles = useMemo(() => createGraph(), []);

  return (
    <div className={className}>
      <Canvas
        camera={{
          position: [0, 0, 8],
          fov: 45,
        }}
        gl={{
          alpha: true,
          antialias: true,
        }}
        dpr={[1, 2]}
      >
        {/* Lights */}
        <ambientLight intensity={0.8} />

        <pointLight
          position={[4, 3, 5]}
          intensity={2}
          color="#A78BFA"
        />

        <pointLight
          position={[-4, -2, 4]}
          intensity={0.8}
          color="#22D3EE"
        />

        <Float
          speed={1}
          rotationIntensity={0.12}
          floatIntensity={0.35}
        >
          <group>
            <Connections particles={particles} />
            <NeuralParticles particles={particles} />
          </group>
        </Float>

        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
import React, { useRef, useMemo } from 'react';
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three';

const FLOATING_PARTICLE_COUNT = 10000;
const SCENE_SIZE = 10;

const FloatingParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(FLOATING_PARTICLE_COUNT * 3);
    for (let i = 0; i < FLOATING_PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * SCENE_SIZE;
      pos[i * 3 + 1] = (Math.random() - 0.5) * SCENE_SIZE;
      pos[i * 3 + 2] = (Math.random() - 0.5) * SCENE_SIZE;
    }
    return pos;
  }, []);

  const velocities = useMemo(() => {
    return Array.from({ length: FLOATING_PARTICLE_COUNT }, () => new THREE.Vector3(
      (Math.random() - 0.5) * 0.005,
      (Math.random() - 0.5) * 0.005,
      (Math.random() - 0.5) * 0.005
    ));
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < FLOATING_PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        positions[i3] += velocities[i].x;
        positions[i3 + 1] += velocities[i].y;
        positions[i3 + 2] += velocities[i].z;

        // Boundary check and velocity reversal
        [i3, i3 + 1, i3 + 2].forEach((idx, axisIndex) => {
          if (Math.abs(positions[idx]) > SCENE_SIZE / 2) {
            positions[idx] = Math.sign(positions[idx]) * SCENE_SIZE / 2;
            velocities[i].setComponent(axisIndex, -velocities[i].getComponent(axisIndex));
          }
        });

        // Small random velocity change
        velocities[i].add(new THREE.Vector3(
          (Math.random() - 0.5) * 0.0001,
          (Math.random() - 0.5) * 0.0001,
          (Math.random() - 0.5) * 0.0001
        ));
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={FLOATING_PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="#ffffff" transparent opacity={0.3} />
    </points>
  );
};

export default FloatingParticles;
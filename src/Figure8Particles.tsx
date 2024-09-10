import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 10000; // Increased particle count for smoothness
const CURVE_SEGMENTS = 64;

const Figure8Particles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const [opacity, setOpacity] = useState(0); // Initial opacity

  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: CURVE_SEGMENTS }, (_, i) => {
        const t = i / CURVE_SEGMENTS;
        const x = Math.sin(t * Math.PI * 2) * 2;
        const y = Math.sin(t * Math.PI * 4);
        const z = Math.cos(t * Math.PI * 2) * 0.5; // Added depth
        return new THREE.Vector3(x, y, z);
      }),
      true
    );
    return curve.getPoints(PARTICLE_COUNT);
  }, []);

  useEffect(() => {
    // Gradually increase opacity over 2 seconds
    const interval = setInterval(() => {
      setOpacity((prev) => Math.min(prev + 0.01, 0.8)); // Cap at 0.8
    }, 20); // Adjust the interval for speed

    return () => clearInterval(interval);
  }, []);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();

      // Rotate the points around the Y-axis
      pointsRef.current.rotation.y += 0.005; // Adjust rotation speed here

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const t = (i + time * 2) % PARTICLE_COUNT; // Decreased speed multiplier
        const point = points[Math.floor(t / PARTICLE_COUNT * points.length)];

        // Add random offset to create a spread-out effect
        const spread = 0.6; // Adjusted spread for less density
        positions[i3] = point.x + (Math.random() - 0.3) * spread;
        positions[i3 + 1] = point.y + (Math.random() - 0.3) * spread + Math.sin(time + i) * 0.1; // Slight upward movement
        positions[i3 + 2] = point.z + (Math.random() - 0.3) * spread;
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={new Float32Array(PARTICLE_COUNT * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={opacity} />
    </points>
  );
};

export default Figure8Particles;
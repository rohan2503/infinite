import React from 'react';
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Figure8Particles from "./Figure8Particles";
import FloatingParticles from "./FloatingParticles";
import Overlay from "./Overlay";

const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["black"]} />
        <fog attach="fog" args={['#000000', 2, 6]} />
        <Figure8Particles />
        <FloatingParticles />
        <OrbitControls />
      </Canvas>
      <Overlay />
    </div>
  );
};

export default App;
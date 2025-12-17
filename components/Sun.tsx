import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const Sun = ({ onClick }: { onClick: () => void }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const glowRef = React.useRef<THREE.Mesh>(null);
  const coronaRef = React.useRef<THREE.Mesh>(null);
  const lightRef = React.useRef<THREE.PointLight>(null);
  const materialRef = React.useRef<any>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Dynamic pulsing effect
    // Increased frequency and amplitude for more activity
    const slowPulse = Math.sin(time * 1.5) * 0.2; 
    const fastFlicker = (Math.random() - 0.5) * 0.1; 
    const intensityFactor = 1 + slowPulse + fastFlicker;

    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.05;
    }
    
    // Animate material properties
    if (materialRef.current) {
        // Boosted base intensity from 2.5 to 3.5
        materialRef.current.emissiveIntensity = 3.5 * intensityFactor;
        // More turbulence
        materialRef.current.distort = 0.4 + (slowPulse * 0.1);
    }

    // Animate Inner Glow
    if (glowRef.current) {
        glowRef.current.scale.setScalar(1.2 + (slowPulse * 0.15));
        glowRef.current.rotation.z = time * 0.08;
    }

    // Animate Outer Corona
    if (coronaRef.current) {
        // Larger corona
        coronaRef.current.scale.setScalar(1.6 + (slowPulse * 0.1));
        coronaRef.current.rotation.z = -time * 0.04;
    }

    // Animate Light
    if (lightRef.current) {
        // Higher light intensity for better contrast on planets
        lightRef.current.intensity = 8 * intensityFactor;
    }
  });

  return (
    <group onClick={onClick} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
      {/* Core Sun */}
      <Sphere args={[4, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          ref={materialRef}
          color="#ff7b00" // Slightly more orange-red base
          emissive="#ffaa00" // Bright orange-yellow emission
          emissiveIntensity={3.5}
          roughness={0.1}
          distort={0.4}
          speed={2} // Faster animation speed
        />
      </Sphere>
      
      {/* Inner Glow (Intense) */}
      <Sphere args={[4.2, 32, 32]} ref={glowRef}>
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.3} />
      </Sphere>

      {/* Outer Corona (Soft, Large) */}
      <Sphere args={[6, 32, 32]} ref={coronaRef}>
        <meshBasicMaterial color="#ff4500" transparent opacity={0.1} />
      </Sphere>

      {/* Outer Volumetric Glow (Simulated by Light) */}
      <pointLight ref={lightRef} intensity={8} distance={150} decay={2} color="#fff7ed" />
      <ambientLight intensity={0.2} />
    </group>
  );
};
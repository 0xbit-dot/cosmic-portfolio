import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Octahedron, Icosahedron, Trail, Float } from '@react-three/drei';
import * as THREE from 'three';
import { InterstellarObjectData } from '../types';

interface Props {
  data: InterstellarObjectData;
  timeSpeed: number;
}

export const InterstellarObject: React.FC<Props> = ({ data, timeSpeed }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  
  // Calculate a hyperbolic or highly elliptical path
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.15 * timeSpeed;
    if (meshRef.current) {
        // Parametric equation for a complex path
        const x = Math.sin(t * 0.5) * data.trajectory.x * 2;
        const y = Math.cos(t * 0.3) * data.trajectory.y;
        const z = Math.cos(t * 0.5) * data.trajectory.z * 2;
        
        meshRef.current.position.set(x, y, z);
        meshRef.current.rotation.x += 0.02 * timeSpeed;
        meshRef.current.rotation.y += 0.03 * timeSpeed;
        
        // Face direction of movement approx
        meshRef.current.lookAt(new THREE.Vector3(0,0,0)); 
    }
  });

  const getGeometry = () => {
    if (data.id.includes("3iatlas")) {
      return (
        <group>
          <Icosahedron args={[0.8, 0]} ref={meshRef}>
            <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={2} wireframe />
          </Icosahedron>
          <Icosahedron args={[0.6, 0]} >
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </Icosahedron>
        </group>
      );
    }
    
    if (data.type === 'comet') {
      return (
        <Octahedron args={[0.5, 0]} ref={meshRef}>
           <meshStandardMaterial color="#60a5fa" emissive="#3b82f6" emissiveIntensity={2} />
        </Octahedron>
      );
    }

    return (
      <Cylinder args={[0.2, 0.2, 2, 8]} ref={meshRef}>
        <meshStandardMaterial color="#f472b6" emissive="#db2777" emissiveIntensity={1.5} />
      </Cylinder>
    );
  };

  const getTrailColor = () => {
    if (data.id.includes("3iatlas")) return "#22d3ee";
    if (data.type === 'comet') return "#3b82f6";
    return "#ec4899";
  };

  return (
    <group>
      <Trail
        width={1.5}
        length={12}
        color={getTrailColor()}
        attenuation={(t) => t * t}
      >
        <Float speed={5} rotationIntensity={2} floatIntensity={2}>
            {getGeometry()}
        </Float>
      </Trail>
    </group>
  );
};
import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Trail, Box, Cylinder, Octahedron } from '@react-three/drei';
import * as THREE from 'three';
import { ProjectData, PlanetData } from '../types';

interface ProbeProps {
  data: ProjectData;
  timeSpeed: number;
  planets: PlanetData[];
  onLaunch: () => void;
}

export const Probe: React.FC<ProbeProps> = ({ data, timeSpeed, planets, onLaunch }) => {
  const meshRef = React.useRef<any>(null);
  const [launching, setLaunching] = React.useState(false);
  
  // Use a ref for the current orbit angle to allow smooth speed changes (delta-based)
  // instead of absolute time (which jumps if speed multiplier changes)
  const angleRef = React.useRef(Math.random() * Math.PI * 2);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Boost speed when launching
    const speedMultiplier = launching ? 4 : 1;
    const currentSpeed = data.speed * 0.2 * timeSpeed * speedMultiplier;
    
    // Increment angle
    angleRef.current += delta * currentSpeed;
    const t = angleRef.current;
    
    // Simple elliptical orbit for stability
    const x = Math.cos(t) * data.distance;
    const z = Math.sin(t) * data.distance;
    // Add some inclination/verticality
    const y = Math.sin(t * 3) * 5; 

    meshRef.current.position.set(x, y, z);
    
    // Calculate velocity vector for orientation
    const nextT = t + 0.01;
    const nextX = Math.cos(nextT) * data.distance;
    const nextZ = Math.sin(nextT) * data.distance;
    const nextY = Math.sin(nextT * 3) * 5;
    
    meshRef.current.lookAt(nextX, nextY, nextZ);
  });

  const handleLaunch = (e: any) => {
    e.stopPropagation();
    if (launching) return;

    setLaunching(true);
    onLaunch(); // Trigger camera shake in parent
    
    // Reset launch state after 2 seconds
    setTimeout(() => {
        setLaunching(false);
    }, 2000);
  };

  return (
    <group 
        ref={meshRef} 
        onClick={handleLaunch}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <Trail
        width={launching ? 3 : 1}
        length={launching ? 12 : 8}
        color={launching ? "#f97316" : new THREE.Color(data.color)}
        attenuation={(t) => t * t}
      >
        <Float speed={launching ? 10 : 2} rotationIntensity={0.5} floatIntensity={0.5}>
          <group rotation={[0, Math.PI / 2, 0]}>
            {/* Main Body */}
            <Box args={[0.8, 0.3, 1.2]}>
              <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.8} />
            </Box>
            
            {/* Gold Foil Instrument Section */}
            <Box args={[0.7, 0.35, 0.6]} position={[0, 0.1, -0.2]}>
              <meshStandardMaterial color="#fbbf24" roughness={0.3} metalness={1} />
            </Box>

            {/* Solar Panels */}
            <Box args={[3, 0.05, 0.6]} position={[0, 0, 0.2]}>
              <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.9} />
            </Box>
            <Box args={[3.1, 0.06, 0.62]} position={[0, 0, 0.2]}>
              <meshBasicMaterial color="#334155" wireframe />
            </Box>

            {/* Antenna */}
            <Cylinder args={[0.02, 0.02, 1]} position={[0, 0.4, -0.4]}>
              <meshStandardMaterial color="#cbd5e1" metalness={1} />
            </Cylinder>
            <Octahedron args={[0.2, 0]} position={[0, 0.9, -0.4]}>
               <meshStandardMaterial color="#cbd5e1" metalness={1} wireframe />
            </Octahedron>

            {/* Engine */}
            <Cylinder args={[0.2, 0.3, 0.4]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.7]}>
              <meshStandardMaterial color="#475569" />
            </Cylinder>
            
            {/* Engine Glow */}
            <mesh position={[0, 0, -0.95]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[launching ? 0.3 : 0.15, 32]} />
              <meshBasicMaterial 
                color={launching ? "#f97316" : "#60a5fa"} 
                transparent 
                opacity={0.8} 
                side={THREE.DoubleSide} 
              />
            </mesh>
            <pointLight 
                position={[0, 0, -1]} 
                distance={launching ? 8 : 3} 
                intensity={launching ? 5 : 2} 
                color={launching ? "#f97316" : "#60a5fa"} 
            />
          </group>
        </Float>
      </Trail>
    </group>
  );
};
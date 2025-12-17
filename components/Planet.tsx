import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Text, Ring, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData } from '../types';

interface PlanetProps {
  data: PlanetData;
  timeSpeed: number;
  isSelected: boolean;
  onSelect: (data: PlanetData) => void;
  setRef?: (ref: THREE.Group) => void;
}

export const Planet: React.FC<PlanetProps> = ({ data, timeSpeed, isSelected, onSelect, setRef }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const groupRef = React.useRef<any>(null);
  const [hovered, setHover] = React.useState(false);

  // Random starting position offset
  const initialAngle = React.useMemo(() => Math.random() * Math.PI * 2, []);
  const rotationSpeed = React.useMemo(() => (Math.random() * 0.5 + 0.1) * (Math.random() > 0.5 ? 1 : -1), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * data.speed * 0.2 * timeSpeed + initialAngle;
    const x = Math.cos(t) * data.distance;
    const z = Math.sin(t) * data.distance;
    
    if (groupRef.current) {
      groupRef.current.position.set(x, 0, z);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * 0.02 * timeSpeed;
    }
  });

  // Expose ref to parent
  React.useLayoutEffect(() => {
    if (setRef && groupRef.current) {
      setRef(groupRef.current);
    }
  }, [setRef]);

  const handlePointerOver = () => {
    document.body.style.cursor = 'pointer';
    setHover(true);
  };
  
  const handlePointerOut = () => {
    document.body.style.cursor = 'auto';
    setHover(false);
  };

  const materialProps = React.useMemo(() => {
    // Determine base color with hover effect
    const baseColor = hovered ? new THREE.Color(data.color).multiplyScalar(1.2) : new THREE.Color(data.color);
    
    // Default properties
    const props: any = {
      color: baseColor,
      emissive: new THREE.Color(data.color),
    };

    switch (data.textureType) {
      case 'gas':
        // Gas giants: Smooth, slightly glowing, non-metallic
        props.roughness = 0.3;
        props.metalness = 0.1;
        props.emissiveIntensity = isSelected || hovered ? 0.6 : 0.2;
        break;
      case 'ice':
        // Ice planets: Shiny (low roughness), high reflectivity (high metalness sim), cool glow
        props.roughness = 0.05;
        props.metalness = 0.7;
        props.emissiveIntensity = isSelected || hovered ? 0.5 : 0.2;
        break;
      case 'rock':
        // Rocky planets: Matte (high roughness), low metalness, low emission
        props.roughness = 0.9;
        props.metalness = 0.1;
        props.emissiveIntensity = isSelected || hovered ? 0.3 : 0.05;
        break;
      case 'earth':
        // Earth-like: Balanced properties
        props.roughness = 0.5;
        props.metalness = 0.2;
        props.emissiveIntensity = isSelected || hovered ? 0.4 : 0.1;
        break;
      case 'sun':
        // Stars: Extremely bright
        props.roughness = 0.1;
        props.metalness = 0.0;
        props.emissiveIntensity = 2.0;
        break;
      default:
        props.roughness = 0.5;
        props.metalness = 0.5;
        props.emissiveIntensity = 0.1;
    }
    return props;
  }, [data.textureType, data.color, isSelected, hovered]);

  return (
    <>
      {/* Orbit Path */}
      <Ring args={[data.distance - 0.1, data.distance + 0.1, 128]} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#ffffff" opacity={0.08} transparent side={THREE.DoubleSide} />
      </Ring>

      <group ref={groupRef}>
        {/* Planet Group */}
        <group 
          onClick={(e) => { e.stopPropagation(); onSelect(data); }}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {/* Label */}
          <group position={[0, data.size + 1.5, 0]}>
            <Text
              fontSize={1.2}
              color={isSelected || hovered ? "#22d3ee" : "white"}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.05}
              outlineColor="#000000"
            >
              {data.name}
            </Text>
            {isSelected && (
              <Text
                position={[0, -0.8, 0]}
                fontSize={0.6}
                color="#a5f3fc"
                anchorX="center"
                anchorY="middle"
              >
                {data.description}
              </Text>
            )}
          </group>

          <Trail
            width={isSelected ? 2 : 0}
            length={12}
            color={new THREE.Color(data.color)}
            attenuation={(t) => t * t}
          >
            <Sphere 
              args={[data.size, 64, 64]} 
              ref={meshRef}
              userData={{ isPlanet: true, planetData: data }} // Vital for HandControls raycasting
            >
              <meshStandardMaterial {...materialProps} />
            </Sphere>
          </Trail>

          {/* Planet Ring (if applicable like Saturn) */}
          {data.ring && (
            <Ring args={[data.size * 1.4, data.size * 2.2, 64]} rotation={[-Math.PI / 2.5, 0, 0]}>
              <meshStandardMaterial 
                color={data.color} 
                opacity={0.6} 
                transparent 
                side={THREE.DoubleSide} 
                emissive={data.color}
                emissiveIntensity={0.2}
              />
            </Ring>
          )}
          
          {/* Selection Effect Ring */}
          {isSelected && (
            <mesh rotation={[-Math.PI/2, 0, 0]}>
              <ringGeometry args={[data.size * 1.5, data.size * 1.6, 64]} />
              <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} side={THREE.DoubleSide} />
            </mesh>
          )}
        </group>
      </group>
    </>
  );
};
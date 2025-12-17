import * as React from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Environment, Sparkles, CameraShake } from '@react-three/drei';
import { Planet } from './Planet';
import { Sun } from './Sun';
import { InterstellarObject } from './InterstellarObject';
import { HandControls } from './HandControls';
import { Nebula } from './Nebula';
import { Probe } from './Probe';
import { PLANETS, INTERSTELLAR_OBJECTS, PROJECTS } from '../constants';
import { PlanetData } from '../types';
import * as THREE from 'three';

interface SceneProps {
  onSelectPlanet: (planet: PlanetData) => void;
  selectedPlanet: PlanetData | null;
  timeSpeed: number;
}

const CameraController = ({ selectedPlanet, planetRefs }: { selectedPlanet: PlanetData | null, planetRefs: React.MutableRefObject<{[key: string]: THREE.Group}> }) => {
  const { controls } = useThree();
  
  useFrame((state, delta) => {
    const ctrl = controls as any;
    if (!ctrl) return;

    if (selectedPlanet && planetRefs.current[selectedPlanet.id]) {
      const targetPos = planetRefs.current[selectedPlanet.id].position;
      // Smoothly move target to planet
      ctrl.target.lerp(targetPos, 5 * delta);
      ctrl.update();
    } 
    // If no planet is selected, we do not force the target, allowing the user to pan freely.
  });

  return null;
}

const ParallaxBackground = ({ children }: { children: React.ReactNode }) => {
  const group = React.useRef<THREE.Group>(null);
  
  useFrame(({ camera }) => {
    if (group.current) {
      // Moves the background partially with the camera to create depth
      // 0.90 means it moves 90% of the camera's travel, making it appear very distant
      group.current.position.copy(camera.position).multiplyScalar(0.9);
    }
  });

  return <group ref={group}>{children}</group>;
};

export const SpaceScene: React.FC<SceneProps> = ({ onSelectPlanet, selectedPlanet, timeSpeed }) => {
  const controlsRef = React.useRef<any>(null);
  const planetRefs = React.useRef<{[key: string]: THREE.Group}>({});
  const [shakeIntensity, setShakeIntensity] = React.useState(0);

  const handleProbeLaunch = () => {
    setShakeIntensity(1);
    setTimeout(() => setShakeIntensity(0), 500);
  };

  return (
    <div className="absolute inset-0 z-0 bg-black">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, toneMapping: (THREE as any).ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
        <PerspectiveCamera makeDefault position={[0, 40, 90]} fov={50} />
        
        <OrbitControls 
          ref={controlsRef}
          enablePan={true} 
          minDistance={10} 
          maxDistance={300} 
          autoRotate={!selectedPlanet} 
          autoRotateSpeed={0.3} 
        />
        
        <CameraController selectedPlanet={selectedPlanet} planetRefs={planetRefs} />

        <CameraShake 
            maxYaw={0.05} 
            maxPitch={0.05} 
            maxRoll={0.05} 
            yawFrequency={2} 
            pitchFrequency={2} 
            rollFrequency={2} 
            intensity={shakeIntensity} 
            decay={false}
        />
        
        {/* Parallax Group for Infinite Depth Feel */}
        <ParallaxBackground>
          {/* Environment - Animated Nebula Background */}
          <Nebula />
          
          {/* Reduced Stars density to let Nebula show through */}
          <Stars radius={300} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          
          {/* Animated Dust Particles */}
          <Sparkles 
            count={2000} 
            scale={120} 
            size={2} 
            speed={0.2} 
            opacity={0.4} 
            color="#a5f3fc" // Subtle cyan tint
          />
        </ParallaxBackground>

        {/* Lighting */}
        <ambientLight intensity={0.1} />

        {/* Environment - purely for reflections */}
        <Environment preset="city" />

        {/* System Center */}
        <Sun onClick={() => {}} />

        {/* Planets */}
        {PLANETS.map((planet) => (
          <Planet
            key={planet.id}
            data={planet}
            timeSpeed={timeSpeed}
            isSelected={selectedPlanet?.id === planet.id}
            onSelect={onSelectPlanet}
            setRef={(ref) => { planetRefs.current[planet.id] = ref; }}
          />
        ))}

        {/* Interstellar Objects */}
        {INTERSTELLAR_OBJECTS.map((obj) => (
          <InterstellarObject key={obj.id} data={obj} timeSpeed={timeSpeed} />
        ))}

         {/* Projects / Probes */}
         {PROJECTS.map((project) => (
          <Probe 
            key={project.id} 
            data={project} 
            timeSpeed={timeSpeed} 
            planets={PLANETS}
            onLaunch={handleProbeLaunch}
          />
        ))}

        {/* Hand Gesture Controls */}
        <HandControls 
            onSelectPlanet={onSelectPlanet} 
            planets={PLANETS} 
            controlsRef={controlsRef} 
        />
      </Canvas>
    </div>
  );
};
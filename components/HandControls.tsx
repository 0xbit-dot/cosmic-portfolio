import * as React from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html, Ring, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { PlanetData, HandState } from '../types';
import { Scan } from 'lucide-react';

declare global {
  interface Window {
    Hands: any;
    Camera: any;
  }
}

interface HandControlsProps {
  onSelectPlanet: (planet: PlanetData) => void;
  planets: PlanetData[];
  controlsRef: React.MutableRefObject<any>;
}

export const HandControls: React.FC<HandControlsProps> = ({ onSelectPlanet, planets, controlsRef }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const handState = React.useRef<HandState>({ x: 0.5, y: 0.5, isPinching: false, isVisible: false });
  const cursorRef = React.useRef<THREE.Group>(null);
  const { camera, raycaster, scene } = useThree();
  const [isReady, setIsReady] = React.useState(false);
  const [hoveredPlanetName, setHoveredPlanetName] = React.useState<string | null>(null);
  const [isPinching, setIsPinching] = React.useState(false);
  
  // Interaction State
  const interactionRef = React.useRef({
    wasPinching: false,
    dragActive: false,
    startX: 0,
    startY: 0,
    startAzimuth: 0,
    startPolar: 0,
    potentialSelection: null as PlanetData | null
  });

  React.useEffect(() => {
    if (!videoRef.current || !window.Hands || !window.Camera) return;

    const hands = new window.Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    hands.onResults((results: any) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Use Index finger tip (8) for position
        const indexTip = landmarks[8];
        const thumbTip = landmarks[4];
        
        // Calculate Pinch (Distance between thumb and index)
        const distance = Math.hypot(indexTip.x - thumbTip.x, indexTip.y - thumbTip.y);
        const pinching = distance < 0.08; // Slightly generous threshold

        // Update Ref (Mirrored X for intuitive control)
        handState.current = {
          x: 1 - indexTip.x,
          y: indexTip.y,
          isPinching: pinching,
          isVisible: true
        };
      } else {
        handState.current.isVisible = false;
        // Reset interaction if hand lost
        interactionRef.current.dragActive = false;
        interactionRef.current.wasPinching = false;
      }
    });

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) {
            await hands.send({ image: videoRef.current });
        }
      },
      width: 640,
      height: 480
    });

    camera.start()
        .then(() => setIsReady(true))
        .catch((e: any) => console.error("Camera failed", e));
  }, []);

  useFrame(() => {
    if (!handState.current.isVisible || !cursorRef.current) {
        if (cursorRef.current) cursorRef.current.visible = false;
        if (isPinching) setIsPinching(false);
        return;
    }
    
    cursorRef.current.visible = true;

    // Sync pinch state to React state for visual updates (trail, color)
    if (handState.current.isPinching !== isPinching) {
        setIsPinching(handState.current.isPinching);
    }

    // --- 1. Update 3D Cursor Position ---
    const ndcX = (handState.current.x * 2) - 1;
    const ndcY = -(handState.current.y * 2) + 1;

    const vector = new (THREE as any).Vector3(ndcX, ndcY, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = 80;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));
    
    cursorRef.current.position.lerp(pos, 0.2);
    cursorRef.current.lookAt(camera.position);

    // --- 2. Raycasting & Hover Logic ---
    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Filter for planets
    const planetIntersect = intersects.find(hit => hit.object.userData?.isPlanet);
    
    if (planetIntersect) {
        const data = planetIntersect.object.userData.planetData as PlanetData;
        setHoveredPlanetName(data.name);
        document.body.style.cursor = 'pointer';
    } else {
        setHoveredPlanetName(null);
        document.body.style.cursor = 'auto';
    }

    // --- 3. Interaction Logic (Pinch to Drag / Select) ---
    const { x, y } = handState.current;
    const currentIsPinching = handState.current.isPinching;
    const state = interactionRef.current;
    const DRAG_THRESHOLD = 0.04; // Movement threshold (0-1 scale) to distinguish drag from click

    if (currentIsPinching && !state.wasPinching) {
        // Pinch Started
        state.wasPinching = true;
        state.startX = x;
        state.startY = y;
        
        // Capture initial camera state
        if (controlsRef.current) {
            state.startAzimuth = controlsRef.current.getAzimuthalAngle();
            state.startPolar = controlsRef.current.getPolarAngle();
        }

        if (planetIntersect) {
            // Potential Selection - Do not drag yet
            state.potentialSelection = planetIntersect.object.userData.planetData;
            state.dragActive = false;
        } else {
            // Empty space - Start Drag immediately
            state.dragActive = true;
            state.potentialSelection = null;
        }
    } else if (currentIsPinching && state.wasPinching) {
        // Pinch Sustained
        const deltaX = x - state.startX;
        const deltaY = y - state.startY;
        const moveDist = Math.hypot(deltaX, deltaY);

        // If we are holding a planet but move too much, switch to Drag
        if (!state.dragActive && state.potentialSelection && moveDist > DRAG_THRESHOLD) {
             state.potentialSelection = null; // Cancel selection
             state.dragActive = true;
             
             // Reset drag origin to current position so camera doesn't jump
             state.startX = x;
             state.startY = y;
             if (controlsRef.current) {
                state.startAzimuth = controlsRef.current.getAzimuthalAngle();
                state.startPolar = controlsRef.current.getPolarAngle();
             }
        }

        if (state.dragActive && controlsRef.current) {
            // Calculate delta based on current drag start point (which might have been reset above)
            const activeDeltaX = x - state.startX;
            const activeDeltaY = y - state.startY;
            
            // Sensitivity Factor
            const SENSITIVITY = 4;
            
            // Apply Rotation
            controlsRef.current.setAzimuthalAngle(state.startAzimuth - activeDeltaX * SENSITIVITY);
            controlsRef.current.setPolarAngle(Math.max(0.1, Math.min(Math.PI - 0.1, state.startPolar - activeDeltaY * SENSITIVITY)));
        }
    } else if (!currentIsPinching && state.wasPinching) {
        // Pinch Released
        if (state.potentialSelection && !state.dragActive) {
            // Valid Click (Selection)
            onSelectPlanet(state.potentialSelection);
        }
        
        // Reset
        state.wasPinching = false;
        state.dragActive = false;
        state.potentialSelection = null;
    }
  });

  // Visual feedback for pinch
  const cursorColor = isPinching ? "#22d3ee" : "#ffffff";
  const isTargeting = hoveredPlanetName !== null;

  return (
    <>
      <Html fullscreen style={{ pointerEvents: 'none', zIndex: 0 }}>
        <video 
            ref={videoRef} 
            className="hidden" 
            playsInline 
            style={{ display: 'none' }}
        />
        
        {isReady && (
            <div className="absolute bottom-6 right-6 w-48 h-36 bg-black/80 border border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                    <Scan size={12} className="text-cyan-400 animate-pulse" />
                    <span className="text-[10px] text-cyan-400 font-mono tracking-wider">OPTICAL SENSORS</span>
                </div>
                
                {/* Mirror the video for feedback */}
                <video 
                    ref={(node) => {
                        if (node && videoRef.current) {
                             node.srcObject = videoRef.current.srcObject;
                             node.play();
                        }
                    }}
                    className="w-full h-full object-cover opacity-60 scale-x-[-1]"
                    playsInline
                    muted
                />
                
                {/* HUD Overlay Lines */}
                <div className="absolute inset-0 border border-cyan-500/10 m-2 rounded pointer-events-none" />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border rounded-full pointer-events-none transition-colors duration-300 ${isPinching ? 'border-cyan-400 bg-cyan-500/20' : 'border-white/20'}`} />
                
                {/* Planet Hover Text */}
                {hoveredPlanetName && (
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-6 text-center w-full">
                        <span className="bg-cyan-900/80 text-cyan-100 text-[10px] px-2 py-0.5 rounded border border-cyan-500/50 whitespace-nowrap">
                            TARGET: {hoveredPlanetName.toUpperCase()}
                        </span>
                     </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/50 to-transparent pointer-events-none" />
                
                {/* Status Indicator */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 z-10">
                    <div className={`w-1.5 h-1.5 rounded-full ${handState.current.isVisible ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-red-500'} transition-colors`} />
                    <span className="text-[9px] text-white/70 font-mono">
                        {handState.current.isVisible ? 'ONLINE' : 'SEARCHING...'}
                    </span>
                </div>
            </div>
        )}
      </Html>

      {/* 3D Cursor */}
      <group ref={cursorRef} visible={false}>
         {/* Visual Trail - visible only when pinching */}
         {/* Fix: Keep length constant to avoid 'offset is out of bounds' RangeError. Use width to toggle visibility. */}
         <Trail
            width={isPinching ? 1.5 : 0} 
            length={8} 
            color={cursorColor}
            attenuation={(t) => t * t}
         >
             {/* Anchor mesh for trail */}
             <mesh position={[0,0,0]} visible={false}>
                <boxGeometry args={[0.05, 0.05, 0.05]} />
             </mesh>
         </Trail>

         {/* Main Ring */}
         <Ring args={[0.5, 0.6, 32]}>
            <meshBasicMaterial color={cursorColor} transparent opacity={0.8} side={THREE.DoubleSide} />
         </Ring>
         {/* Inner Ring (Active state) */}
         <Ring args={[0.2, isPinching ? 0.4 : 0.25, 32]}>
            <meshBasicMaterial color={cursorColor} transparent opacity={0.5} side={THREE.DoubleSide} />
         </Ring>
         
         {/* Targeting Reticle - Only visible when hovering a planet */}
         <group visible={isTargeting}>
            <mesh rotation={[0,0,0]}>
                <boxGeometry args={[3, 0.05, 0.05]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
            </mesh>
            <mesh rotation={[0,0,Math.PI/2]}>
                <boxGeometry args={[3, 0.05, 0.05]} />
                <meshBasicMaterial color="#ef4444" transparent opacity={0.5} />
            </mesh>
         </group>
      </group>
    </>
  );
};
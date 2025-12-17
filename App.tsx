import * as React from 'react';
import { SpaceScene } from './components/SpaceScene';
import { UIOverlay } from './components/UIOverlay';
import { PlanetData } from './types';
import { Loader } from 'lucide-react';

const LoadingScreen = () => (
  <div className="absolute inset-0 bg-black flex items-center justify-center text-cyan-500 z-50">
    <div className="flex flex-col items-center gap-4">
      <Loader className="animate-spin w-12 h-12" />
      <span className="font-display tracking-widest text-sm animate-pulse">INITIALIZING SYSTEM...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = React.useState<PlanetData | null>(null);
  const [timeSpeed, setTimeSpeed] = React.useState<number>(1);

  const handleSelectPlanet = (planet: PlanetData) => {
    setSelectedPlanet(planet);
    // Pause time or slow it down when reading
    setTimeSpeed(0.1);
  };

  const handleCloseCard = () => {
    setSelectedPlanet(null);
    setTimeSpeed(1);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      <React.Suspense fallback={<LoadingScreen />}>
        <SpaceScene 
          onSelectPlanet={handleSelectPlanet}
          selectedPlanet={selectedPlanet}
          timeSpeed={timeSpeed}
        />
      </React.Suspense>
      
      <UIOverlay
        selectedPlanet={selectedPlanet}
        onSelectPlanet={handleSelectPlanet}
        onCloseCard={handleCloseCard}
        timeSpeed={timeSpeed}
        onTimeSpeedChange={setTimeSpeed}
      />
    </main>
  );
};

export default App;
import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, X, ChevronRight, Globe, MousePointer2, Clock, LocateFixed, Zap,
  User, FileText, Briefcase, GraduationCap, Cpu, Award, Heart, Mail
} from 'lucide-react';
import { PLANETS, RESUME_DATA } from '../constants';
import { PlanetData, SectionType } from '../types';

interface UIOverlayProps {
  selectedPlanet: PlanetData | null;
  onCloseCard: () => void;
  onSelectPlanet: (planet: PlanetData) => void;
  timeSpeed: number;
  onTimeSpeedChange: (speed: number) => void;
}

const getPlanetIcon = (type: SectionType) => {
  switch (type) {
    case SectionType.SUMMARY: return <FileText size={20} />;
    case SectionType.SKILLS: return <Cpu size={20} />;
    case SectionType.EXPERIENCE: return <Briefcase size={20} />;
    case SectionType.VALUES: return <Heart size={20} />;
    case SectionType.EDUCATION: return <GraduationCap size={20} />;
    case SectionType.CERTIFICATIONS: return <Award size={20} />;
    case SectionType.CONTACT: return <Mail size={20} />;
    case SectionType.PROFILE: return <User size={20} />;
    default: return <Globe size={20} />;
  }
};

export const UIOverlay: React.FC<UIOverlayProps> = ({
  selectedPlanet,
  onCloseCard,
  onSelectPlanet,
  timeSpeed,
  onTimeSpeedChange
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between overflow-hidden">
      {/* Top Header / HUD */}
      <header className="p-6 flex justify-between items-start pointer-events-auto bg-gradient-to-b from-black/90 to-transparent">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            COSMIC ATLAS
          </h1>
          <p className="text-cyan-200/70 font-display text-sm tracking-[0.2em] mt-2 uppercase flex items-center gap-2">
             SYSTEM: {RESUME_DATA.name.toUpperCase()}
          </p>
          <p className="text-white/50 text-xs mt-1 font-mono tracking-wide">{RESUME_DATA.role}</p>
        </div>
        
        <div className="hidden md:flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono border border-cyan-500/30 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm shadow-[0_0_10px_rgba(6,182,212,0.1)]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse box-shadow-[0_0_8px_#22c55e]"></span>
            SYSTEM ONLINE
          </div>
          <div className="text-right text-xs text-white/40 font-mono">
            COORDS: {RESUME_DATA.location}
          </div>
        </div>
      </header>

      {/* Side Navigation (Planets) */}
      <nav className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 pointer-events-auto z-20">
        {PLANETS.map((planet) => {
          const isSelected = selectedPlanet?.id === planet.id;
          return (
            <button
              key={planet.id}
              onClick={() => onSelectPlanet(planet)}
              className="group flex items-center gap-4 text-left transition-all duration-300 relative"
            >
              {/* Icon Container with Gradient Effect */}
              <div className={`
                relative flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-500
                ${isSelected 
                  ? 'border-cyan-400 bg-black/50 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110' 
                  : 'border-white/10 bg-black/20 hover:border-cyan-500/30 hover:bg-cyan-950/30'
                }
              `}>
                {/* Gradient background for active state */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 animate-pulse" />
                )}
                
                <div className={`transition-colors duration-300 ${isSelected ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-200'}`}>
                  {getPlanetIcon(planet.id as SectionType)}
                </div>
              </div>

              {/* Label (Slide out on hover or select) */}
              <div className={`
                absolute left-full ml-4 px-4 py-2 rounded-lg backdrop-blur-md border border-cyan-500/20 bg-black/80
                transition-all duration-300 origin-left
                ${isSelected 
                  ? 'opacity-100 translate-x-0 scale-100' 
                  : 'opacity-0 -translate-x-4 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100'
                }
              `}>
                <span className="text-xs font-bold font-display tracking-widest text-cyan-100 whitespace-nowrap">
                  {planet.name.toUpperCase()}
                </span>
                {/* Decorative line */}
                <div className="w-full h-[1px] bg-gradient-to-r from-cyan-500 to-transparent mt-1" />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <footer className="p-6 flex flex-col md:flex-row justify-between items-end md:items-center pointer-events-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="flex flex-col gap-2 w-full md:w-64 mb-4 md:mb-0">
          <label className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-display uppercase tracking-wider">
            <Clock size={14} className="text-cyan-400" /> Time Dilation
          </label>
          <div className="relative w-full h-2">
            <div className="absolute inset-0 bg-white/10 rounded-full"></div>
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full shadow-[0_0_10px_#22d3ee]"
              style={{ width: `${(timeSpeed / 2) * 100}%` }}
            ></div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={timeSpeed}
              onChange={(e) => onTimeSpeedChange(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-6 text-xs text-white/40 font-mono">
          <div className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
            <MousePointer2 size={12} />
            <span className="tracking-wider">DRAG</span>
          </div>
          <div className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
            <LocateFixed size={12} />
            <span className="tracking-wider">ZOOM</span>
          </div>
          <div className="flex items-center gap-2 hover:text-cyan-300 transition-colors">
            <Globe size={12} />
            <span className="tracking-wider">SCAN</span>
          </div>
        </div>
      </footer>

      {/* Info Card Modal */}
      <AnimatePresence>
        {selectedPlanet && selectedPlanet.content && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 bottom-0 w-full md:w-[450px] bg-black/80 backdrop-blur-2xl border-l border-white/10 pointer-events-auto shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col z-50"
          >
            {/* Header Gradient Line */}
            <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>

            <div className="p-8 flex-1 overflow-y-auto relative">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200 mb-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                    {selectedPlanet.content.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_5px_#22d3ee]"></span>
                    <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest">
                      SECTOR: {selectedPlanet.name}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onCloseCard}
                  className="group p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                >
                  <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-950/40 to-black border border-cyan-900/30 relative overflow-hidden group shadow-[inset_0_0_20px_rgba(8,145,178,0.1)]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-500"></div>
                  
                  <h3 className="text-cyan-100 font-bold mb-4 flex items-center gap-2 font-display">
                    <Info size={16} className="text-cyan-400" /> DATA LOGS
                  </h3>
                  <ul className="space-y-4">
                    {selectedPlanet.content.items.map((item, i) => (
                      <li key={i} className="text-slate-300 text-sm leading-relaxed flex items-start gap-3 group/item">
                        <ChevronRight size={14} className="mt-1 text-cyan-500 shrink-0 group-hover/item:translate-x-1 transition-transform" />
                        <span className="group-hover/item:text-white transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedPlanet.content.details && (
                  <div className="p-6 rounded-xl bg-gradient-to-br from-violet-950/30 to-black border border-violet-900/30 shadow-[inset_0_0_20px_rgba(124,58,237,0.1)]">
                    <div className="flex gap-3">
                      <Zap size={16} className="text-violet-400 mt-0.5 shrink-0" />
                      <p className="text-violet-200/80 text-sm italic leading-relaxed">
                        "{selectedPlanet.content.details}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-md">
              <button 
                onClick={onCloseCard}
                className="w-full py-4 relative overflow-hidden group bg-white/5 hover:bg-cyan-900/20 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 rounded-lg"
              >
                <div className="absolute inset-0 w-0 bg-gradient-to-r from-cyan-500/10 to-transparent transition-all duration-500 ease-out group-hover:w-full"></div>
                <div className="relative flex items-center justify-center gap-2 text-white font-mono text-sm tracking-[0.2em]">
                  CLOSE TRANSMISSION
                  <ChevronRight size={16} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
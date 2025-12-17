
export enum SectionType {
  PROFILE = 'PROFILE',
  SUMMARY = 'SUMMARY',
  EXPERIENCE = 'EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILLS = 'SKILLS',
  CERTIFICATIONS = 'CERTIFICATIONS',
  VALUES = 'VALUES',
  CONTACT = 'CONTACT'
}

export interface PlanetData {
  id: SectionType;
  name: string;
  description: string;
  distance: number; // Distance from sun
  size: number; // Size relative to earth
  speed: number; // Orbit speed
  color: string;
  textureType: 'rock' | 'gas' | 'ice' | 'earth' | 'sun';
  ring?: boolean;
  content?: {
    title: string;
    items: string[];
    details?: string;
  };
}

export interface InterstellarObjectData {
  id: string;
  name: string;
  type: 'comet' | 'artifact';
  trajectory: {
    x: number;
    y: number;
    z: number;
  };
  details: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  distance: number;
  speed: number;
  color: string;
}

export interface HandState {
  x: number; // 0 to 1
  y: number; // 0 to 1
  isPinching: boolean;
  isVisible: boolean;
}

import { PlanetData, SectionType, InterstellarObjectData, ProjectData } from './types';

export const RESUME_DATA = {
  name: "Junaid Mirza",
  role: "Frontend Developer | React & Next.js Specialist",
  location: "Gilgit-Baltistan, Pakistan",
  email: "0xdavid211@gmail.com",
  linkedin: "linkedin.com/in/junaid-bro",
};

export const PLANETS: PlanetData[] = [
  {
    id: SectionType.SUMMARY,
    name: "Mercury (Summary)",
    description: "The core philosophy",
    distance: 10,
    size: 0.8,
    speed: 0.8,
    color: "#a1a1aa",
    textureType: 'rock',
    content: {
      title: "Professional Summary",
      items: [
        "Frontend Specialist: Over 2 years of deep involvement in frontend development.",
        "Evolution: Grew from basic HTML layouts to complex, dynamic web applications.",
        "Tech Stack: Specialized in JavaScript, React, and Next.js for fast, modern UX.",
        "Philosophy: Frontend is the crucial connection between business logic and user satisfaction.",
        "Problem Solver: Focusing on performance, flow, and converting rigid interfaces into fluid experiences."
      ]
    }
  },
  {
    id: SectionType.SKILLS,
    name: "Venus (Skills)",
    description: "Technical Arsenal",
    distance: 16,
    size: 1.2,
    speed: 0.6,
    color: "#fbbf24",
    textureType: 'gas',
    content: {
      title: "Top Skills",
      items: [
        "User Interface (UI) Design",
        "Front-End Web Development",
        "React.js & Next.js",
        "JavaScript (ES6+)",
        "HTML5 & CSS3 (In-depth)",
        "Tailwind CSS",
        "Version Control (Git)",
        "General Networking"
      ]
    }
  },
  {
    id: SectionType.EXPERIENCE,
    name: "Earth (Experience)",
    description: "Professional Journey",
    distance: 24,
    size: 1.5,
    speed: 0.4,
    color: "#3b82f6",
    textureType: 'earth',
    content: {
      title: "Work Experience",
      items: [
        "Role: Frontend Developer",
        "Company: Triangle Software Technologies",
        "Duration: June 2023 - Present (2 years 7 months)",
        "Location: Gilgit, Pakistan",
        "Impact: Built dependable technical foundations trusted by founders for critical digital products."
      ],
      details: "I don't just deliver code; I provide a scalable foundation that supports long-term growth."
    }
  },
  {
    id: SectionType.VALUES,
    name: "Mars (Values)",
    description: "Core Principles",
    distance: 32,
    size: 1.1,
    speed: 0.3,
    color: "#ef4444",
    textureType: 'rock',
    content: {
      title: "Development Values",
      items: [
        "Blazing Fast: Optimized with Next.js for rapid load times.",
        "Expertly Engineered: Clean, maintainable, and scalable code.",
        "User-Centered: Crafted with strong UX principles to guide users naturally."
      ]
    }
  },
  {
    id: SectionType.EDUCATION,
    name: "Jupiter (Education)",
    description: "Academic Foundation",
    distance: 45,
    size: 3.5,
    speed: 0.15,
    color: "#ea580c",
    textureType: 'gas',
    content: {
      title: "Education History",
      items: [
        "BS Computer Science: Karakoram International University Gilgit (2023 - 2027)",
        "Associate's Degree (ICS): The Learning Academy Gilgit (April 2019 - July 2023)"
      ]
    }
  },
  {
    id: SectionType.CERTIFICATIONS,
    name: "Saturn (Certs)",
    description: "Qualifications",
    distance: 60,
    size: 3.0,
    speed: 0.1,
    color: "#fcd34d",
    ring: true,
    textureType: 'gas',
    content: {
      title: "Certifications",
      items: [
        "Programming with JavaScript",
        "Introduction to Front-End Development",
        "Version Control",
        "HTML and CSS in depth"
      ]
    }
  },
  {
    id: SectionType.CONTACT,
    name: "Neptune (Contact)",
    description: "Get in Touch",
    distance: 75,
    size: 2.8,
    speed: 0.08,
    color: "#6366f1",
    textureType: 'ice',
    content: {
      title: "Contact Information",
      items: [
        "Email: 0xdavid211@gmail.com",
        "LinkedIn: linkedin.com/in/junaid-bro",
        "Location: Gilgit-Baltistan, Pakistan"
      ],
      details: "Let's turn your vision into a high-performing solution. Send me a message, and let's start building."
    }
  }
];

export const INTERSTELLAR_OBJECTS: InterstellarObjectData[] = [
  {
    id: "obj1",
    name: "Oumuamua (Innovation)",
    type: "artifact",
    trajectory: { x: 40, y: 20, z: -50 },
    details: "Representing unique problem-solving approaches."
  },
  {
    id: "obj2",
    name: "2I/Borisov (Speed)",
    type: "comet",
    trajectory: { x: -60, y: -30, z: 20 },
    details: "Symbolizing high-performance code execution."
  },
  {
    id: "3iatlas",
    name: "3iAtlas (Project)",
    type: "artifact",
    trajectory: { x: -30, y: 40, z: 40 },
    details: "A dimension-defying immersive spatial interface project."
  }
];

export const PROJECTS: ProjectData[] = [
  {
    id: "proj1",
    name: "Cosmic Portfolio",
    description: "A 3D interactive portfolio with R3F",
    technologies: ["React", "Three.js", "Fiber"],
    distance: 42,
    speed: 0.2,
    color: "#67e8f9"
  },
  {
    id: "proj2",
    name: "Nebula Dashboard",
    description: "Analytics dashboard with real-time data",
    technologies: ["Next.js", "Tremor", "Tailwind"],
    distance: 58,
    speed: 0.15,
    color: "#c4b5fd"
  },
  {
    id: "proj3",
    name: "Stellar Chat",
    description: "Real-time chat application",
    technologies: ["Socket.io", "Express", "React"],
    distance: 70,
    speed: 0.12,
    color: "#86efac"
  }
];
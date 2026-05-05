import { Project, Winner, TimelineEvent } from './types';

export const MOCK_PROJECTS: Project[] = [
  { title: "Zema Archive", category: "Web App", description: "Digitizing ancient Orthodox chants with high-fidelity indexing and AI-driven search capabilities.", team: "Alpha Team", tags: ["React", "Typescript", "Python"], status: "Completed", github_url: "https://github.com/agthub/zema-archive", live_url: "https://zema.agthub.org" },
  { title: "Kidusan Tracker", category: "Mobile", description: "Real-time tracking of liturgical calendars and saint commemorations with push notifications.", team: "Beta Devs", tags: ["Flutter", "Firebase"], status: "In Progress", github_url: "https://github.com/agthub/kidusan-tracker" },
  { title: "Hiyaw Qal Visualizer", category: "Design", description: "Minimalist semantic UI system for religious education platforms in Amharic and Ge'ez.", team: "Creative Duo", tags: ["Figma", "UI/UX"], status: "Planning", github_url: "https://github.com/agthub/hiyaw-qal" },
  { title: "Gibi Analytics", category: "Web App", description: "Management dashboard for student participation and resource allocation in local Gibi Gubaies.", team: "Nexus Team", tags: ["Next.js", "PostgreSQL"], status: "Completed", live_url: "https://analytics.agthub.org" },
  { title: "Ethiopic OCR", category: "Other", description: "High-accuracy optical character recognition for ancient manuscripts using specialized CNN models.", team: "Deep Vision", tags: ["PyTorch", "OpenCV"], status: "Completed", github_url: "https://github.com/agthub/ethiopic-ocr" }
];

export const MOCK_WINNERS: Winner[] = [
  { name: "Abebe Kebede", award: "Grand Prize Winner", quote: "Innovation is how we bridge our legacy with the global future. This bootcamp changed my perspective on engineering.", rank: "01", category: "Bootcamp #4", github_url: "https://github.com/", portfolio_url: "https://yafet-tesfaye-dev.vercel.app/", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" },
  { name: "Tseday Lemma", award: "Best Innovation", quote: "Building for my community gives me a sense of purpose that no corporate job can match.", rank: "02", category: "Hackathon 2023", github_url: "https://github.com/", portfolio_url: "https://yafet-tesfaye-dev.vercel.app/", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop" },
  { name: "Yonas Biru", award: "Technical Excellence", quote: "Code is a language of service. I am grateful for the mentorship at AGT Hub.", rank: "03", category: "Design Contest", github_url: "https://github.com/", portfolio_url: "https://yafet-tesfaye-dev.vercel.app/", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" }
];

export const MOCK_EVENTS: TimelineEvent[] = [
  { date: "Oct 2024", title: "Genesis Bootcamp", type: "Training", description: "30 students launched their first full-stack projects." },
  { date: "Aug 2023", title: "Harvest Hackathon", type: "Contest", description: "Focused on community-driven charity tech solutions." },
  { date: "Jan 2023", title: "The Inauguration", type: "Event", description: "AGT Hub was officially founded at ASTU Gibi Gubaie." }
];

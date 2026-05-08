export interface Project {
  title: string;
  category: string;
  description: string;
  team: string;
  tags: string[];
  status: string;
  github_url?: string;
  live_url?: string;
}

export interface Winner {
  name: string;
  award: string;
  quote: string;
  rank: string;
  category: string;
  github_url: string;
  portfolio_url: string;
  image: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  type: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  contributions: string[];
  skills: string[];
  availability: 'Available' | 'Employed' | 'Freelance';
  contact: string;
  image?: string;
  github_url?: string;
  portfolio_url?: string;
}

export interface AuthorizedUser {
  email: string;
}

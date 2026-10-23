
export interface Project {
  id: string;
  title: string;
  description: string;
  /** What the developer personally did on the project. */
  contribution?: string;
  tags: string[];
  /** Omitted for confidential client work so no logo is displayed. */
  imageUrl?: string;
  link: string;
}

export interface ProjectGroup {
  /** Public-facing label. Confidential groups use a sector label, not the real client name. */
  companyName: string;
  /** Hides client identity, logo and public links for the whole group. */
  confidential?: boolean;
  projects: Project[];
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
  category: 'Frontend' | 'Backend' | 'Design' | 'Cybersecurity' | 'Dev-Ops';
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description?: string;
  achievements?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

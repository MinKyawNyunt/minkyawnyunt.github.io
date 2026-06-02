
export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  link: string;
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

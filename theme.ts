export interface SectionTheme {
  id: string;
  label: string;
  index: string;
  accent: string;
  secondary: string;
}

/**
 * Single source of truth for the scroll journey.
 * The order here drives the nav, section dots and the 3D background palette.
 */
export const SECTIONS: SectionTheme[] = [
  { id: 'home', label: 'HOME', index: '01', accent: '#00f3ff', secondary: '#ff2bd6' },
  { id: 'projects', label: 'PROJECTS', index: '02', accent: '#8b5cf6', secondary: '#22d3ee' },
  { id: 'skills', label: 'SKILLS', index: '03', accent: '#22d3ee', secondary: '#34d399' },
  { id: 'experience', label: 'EXPERIENCE', index: '04', accent: '#f59e0b', secondary: '#ec4899' },
  { id: 'education', label: 'EDUCATION', index: '05', accent: '#ec4899', secondary: '#8b5cf6' },
  { id: 'ai', label: 'NEURAL AI', index: '06', accent: '#22d3ee', secondary: '#3b82f6' },
];

export const getSection = (id: string): SectionTheme =>
  SECTIONS.find((section) => section.id === id) ?? SECTIONS[0];

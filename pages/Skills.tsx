import React from 'react';
import {
  Cloud,
  Layout,
  PenTool,
  Server,
  type LucideIcon,
} from 'lucide-react';
import { SKILLS } from '../constants';
import { CyberCard } from '../components/CyberCard';
import { Reveal } from '../components/Reveal';
import { SectionShell } from '../components/SectionShell';
import { useInView } from '../hooks/useInView';

const CATEGORY_META: Record<
  string,
  { accent: string; icon: LucideIcon; code: string }
> = {
  Frontend: { accent: '#22d3ee', icon: Layout, code: 'FE' },
  Backend: { accent: '#ec4899', icon: Server, code: 'BE' },
  Design: { accent: '#8b5cf6', icon: PenTool, code: 'DS' },
  'Dev-Ops': { accent: '#34d399', icon: Cloud, code: 'OP' },
};

interface SkillBarProps {
  name: string;
  level: number;
  accent: string;
  delay: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level, accent, delay }) => {
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <div ref={ref}>
      <div className="mb-2 flex items-end justify-between gap-4">
        <span className="font-rajdhani text-[15px] font-semibold tracking-wide text-gray-200">
          {name}
        </span>
        <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: accent }}>
          {level}%
        </span>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden bg-white/[0.05]">
        <div
          className="relative h-full"
          style={{
            width: inView ? `${level}%` : '0%',
            background: `linear-gradient(90deg, ${accent}44, ${accent})`,
            boxShadow: `0 0 14px ${accent}55`,
            transition: `width 1.3s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
          }}
        >
          <span
            className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45"
            style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
          />
        </div>
      </div>
    </div>
  );
};

const EXPLORING = ['Three.js', 'WebGL', 'AI Agents', 'Rust', 'Kubernetes'];

export const Skills: React.FC = () => {
  const categories = Array.from(new Set(SKILLS.map((skill) => skill.category)));

  return (
    <SectionShell
      id="skills"
      kicker="TECHNICAL COMPETENCY ANALYSIS"
      title="Core"
      accentWord="Stack"
      description="A full-stack toolkit sharpened across nine years of shipping production software — frontend interfaces, backend architecture, data layers and deployment pipelines."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categories.map((category, categoryIndex) => {
          const meta = CATEGORY_META[category] ?? {
            accent: '#22d3ee',
            icon: Layout,
            code: '//',
          };
          const Icon = meta.icon;
          const skills = SKILLS.filter((skill) => skill.category === category);

          return (
            <Reveal key={category} delay={categoryIndex * 80} className="h-full">
              <CyberCard
                title={`${meta.code} // ${category.toUpperCase()}`}
                accent={meta.accent}
                className="h-full"
              >
                <div className="flex h-full flex-col">
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <h3 className="font-orbitron text-xl font-bold uppercase tracking-wide text-white">
                        {category}
                      </h3>
                      <p className="mt-1 font-mono text-[9px] tracking-[0.2em] text-gray-600">
                        {skills.length} TRACKED MODULES
                      </p>
                    </div>
                    <span
                      className="flex h-10 w-10 items-center justify-center border"
                      style={{
                        borderColor: `${meta.accent}44`,
                        backgroundColor: `${meta.accent}0f`,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: meta.accent }} />
                    </span>
                  </div>

                  <div className="space-y-5">
                    {skills.map((skill, skillIndex) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        accent={meta.accent}
                        delay={skillIndex * 80}
                      />
                    ))}
                  </div>
                </div>
              </CyberCard>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={120}>
        <div className="mt-8 flex flex-col gap-5 border border-white/[0.08] bg-[#070a12]/80 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.24em] text-gray-500">
              // CURRENTLY EXPLORING
            </p>
            <p className="mt-1 font-rajdhani text-sm text-gray-400">
              Continuous learning protocol active — expanding into real-time 3D and AI-assisted systems.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {EXPLORING.map((item) => (
              <span
                key={item}
                className="border border-cyan-400/20 bg-cyan-400/[0.04] px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-cyan-200/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
};

import React from 'react';
import { Building2, CircleDot } from 'lucide-react';
import { EXPERIENCES } from '../constants';
import { Reveal } from '../components/Reveal';
import { SectionShell } from '../components/SectionShell';

const ACCENTS = ['#f59e0b', '#ec4899', '#22d3ee', '#8b5cf6'];

export const ExperiencePage: React.FC = () => {
  return (
    <SectionShell
      id="experience"
      kicker="CAREER TIMELINE // 2014 — PRESENT"
      title="Career"
      accentWord="Timeline"
      description="A decade of building and leading — from data operations to solution architecture, with teams and systems spanning fintech, government and enterprise."
    >
      <div className="relative">
        <span className="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-amber-400/70 via-pink-500/30 to-transparent md:left-[15px]" />

        {EXPERIENCES.map((experience, index) => {
          const accent = ACCENTS[index % ACCENTS.length];

          return (
            <Reveal key={`${experience.company}-${experience.period}`} delay={index * 70}>
              <div className="relative pb-10 pl-10 last:pb-0 md:pl-16">
                <span
                  className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center border bg-[#05060c] md:h-8 md:w-8"
                  style={{
                    borderColor: `${accent}88`,
                    boxShadow: `0 0 18px ${accent}33`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}` }}
                  />
                </span>

                <div className="group relative overflow-hidden border border-white/[0.08] bg-[#070a12]/80 p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#0b0f1a]/90 md:p-8">
                  <span className="pointer-events-none absolute -right-2 -top-6 select-none font-orbitron text-[7rem] font-bold leading-none text-white/[0.025]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="pointer-events-none absolute bottom-0 left-0 top-0 w-px opacity-60 transition-opacity group-hover:opacity-100"
                    style={{ backgroundColor: accent }}
                  />

                  <div className="relative z-10">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        {index === 0 && (
                          <span
                            className="mb-2 inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[8px] tracking-[0.2em]"
                            style={{
                              borderColor: `${accent}55`,
                              color: accent,
                              backgroundColor: `${accent}10`,
                            }}
                          >
                            <CircleDot className="h-2.5 w-2.5" />
                            LATEST ROLE
                          </span>
                        )}
                        <h3 className="font-orbitron text-lg font-bold leading-snug text-white md:text-xl">
                          {experience.role}
                        </h3>
                        <p
                          className="mt-2 flex items-center gap-2 font-rajdhani text-sm font-semibold uppercase tracking-[0.18em]"
                          style={{ color: accent }}
                        >
                          <Building2 className="h-3.5 w-3.5" />
                          {experience.company}
                        </p>
                      </div>

                      <span
                        className="shrink-0 self-start border px-3 py-1 font-mono text-[10px] tracking-[0.12em]"
                        style={{
                          borderColor: `${accent}44`,
                          backgroundColor: `${accent}0d`,
                          color: accent,
                        }}
                      >
                        {experience.period}
                      </span>
                    </div>

                    <p className="mt-5 max-w-3xl font-rajdhani text-[15px] leading-relaxed text-gray-400">
                      {experience.description}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
};

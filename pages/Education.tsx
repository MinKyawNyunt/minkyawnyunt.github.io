import React from 'react';
import { Award, GraduationCap } from 'lucide-react';
import { EDUCATION } from '../constants';
import { CyberCard } from '../components/CyberCard';
import { Reveal } from '../components/Reveal';
import { SectionShell } from '../components/SectionShell';

const ACCENTS = ['#ec4899', '#8b5cf6', '#22d3ee'];

export const EducationPage: React.FC = () => {
  return (
    <SectionShell
      id="education"
      kicker="EDUCATIONAL ARCHIVES // 03 RECORDS"
      title="Knowledge"
      accentWord="Bank"
      description="Formal training in computing, psychology and web development — a foundation that blends technical depth with an understanding of how people actually use software."
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {EDUCATION.map((education, index) => {
          const accent = ACCENTS[index % ACCENTS.length];

          return (
            <Reveal key={`${education.institution}-${education.degree}`} delay={index * 90} className="h-full">
              <CyberCard
                title={`CREDENTIAL-${String(index + 1).padStart(2, '0')}`}
                accent={accent}
                className="h-full"
              >
                <article className="flex h-full min-h-[300px] flex-col">
                  <div className="flex items-start justify-between">
                    <span
                      className="flex h-11 w-11 items-center justify-center border"
                      style={{
                        borderColor: `${accent}44`,
                        backgroundColor: `${accent}0f`,
                        color: accent,
                      }}
                    >
                      <GraduationCap className="h-5 w-5" />
                    </span>
                    <span className="font-orbitron text-4xl font-bold text-white/[0.06]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="mt-6 font-orbitron text-base font-bold uppercase leading-snug tracking-wide text-white">
                    {education.degree}
                  </h3>

                  <p
                    className="mt-3 font-rajdhani text-base font-semibold tracking-[0.08em]"
                    style={{ color: accent }}
                  >
                    {education.institution}
                  </p>

                  <span
                    className="mt-4 inline-flex w-fit border px-2.5 py-0.5 font-mono text-[9px] tracking-[0.16em]"
                    style={{
                      borderColor: `${accent}40`,
                      backgroundColor: `${accent}0d`,
                      color: accent,
                    }}
                  >
                    {education.period}
                  </span>

                  {education.description && (
                    <p className="mt-4 font-rajdhani text-sm leading-relaxed text-gray-400">
                      {education.description}
                    </p>
                  )}

                  {education.achievements && education.achievements.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-white/[0.08] pt-4">
                      {education.achievements.map((achievement) => (
                        <span
                          key={achievement}
                          className="border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[9px] text-gray-400"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center gap-2 border-t border-white/[0.08] pt-4">
                    <Award className="h-3.5 w-3.5" style={{ color: accent }} />
                    <span className="font-mono text-[9px] tracking-[0.2em] text-gray-500">
                      ARCHIVED // VERIFIED
                    </span>
                  </div>
                </article>
              </CyberCard>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={140}>
        <p className="mt-8 max-w-2xl border-l border-fuchsia-500/40 pl-5 font-rajdhani text-base leading-relaxed text-gray-500">
          Education never stops at the certificate. Every production system, failed deploy
          and late-night refactor has been part of the curriculum.
        </p>
      </Reveal>
    </SectionShell>
  );
};

import React from 'react';
import { ArrowUpRight, Box, ExternalLink } from 'lucide-react';
import { PROJECT_GROUPS, PROJECTS } from '../constants';
import { CyberCard } from '../components/CyberCard';
import { Reveal } from '../components/Reveal';
import { SectionShell } from '../components/SectionShell';

const GROUP_ACCENTS = ['#8b5cf6', '#22d3ee', '#ec4899', '#34d399'];

export const Projects: React.FC = () => {
  return (
    <SectionShell
      id="projects"
      kicker={`DEPLOYED OPERATIONS // ${PROJECTS.length} RECORDS`}
      title="Mission"
      accentWord="Archive"
      description="Production systems built for government, fintech and private clients — from nationwide exam platforms to in-house ERPs serving hundreds of thousands of users."
    >
      {PROJECT_GROUPS.map((group, groupIndex) => {
        const accent = GROUP_ACCENTS[groupIndex % GROUP_ACCENTS.length];

        return (
          <div key={group.companyName} className={groupIndex === 0 ? '' : 'mt-20'}>
            <Reveal>
              <div className="mb-8 flex flex-wrap items-center gap-4">
                <span
                  className="font-mono text-[10px] tracking-[0.22em]"
                  style={{ color: accent }}
                >
                  {String(groupIndex + 1).padStart(2, '0')}
                </span>
                <h3 className="font-orbitron text-lg font-bold uppercase tracking-[0.08em] text-white md:text-xl">
                  {group.companyName}
                </h3>
                <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
                <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-gray-500">
                  <Box className="h-3.5 w-3.5" style={{ color: accent }} />
                  {group.projects.length} OPS
                </span>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {group.projects.map((project, index) => (
                <Reveal
                  key={project.id}
                  delay={(index % 3) * 90}
                  className="h-full"
                >
                  <CyberCard
                    title={`OP-${project.id}`}
                    accent={accent}
                    className="h-full"
                  >
                    <article className="flex h-full min-h-[480px] flex-col">
                      <div className="group/img relative mb-5 overflow-hidden border border-white/[0.07] bg-[#eef2f8]">
                        <div className="aspect-[16/10] w-full">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-contain p-3 grayscale transition-all duration-700 group-hover/img:scale-105 group-hover/img:grayscale-0"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060810]/60 via-transparent to-transparent opacity-60" />
                        <span className="absolute right-2 top-2 border border-white/20 bg-black/70 px-2 py-0.5 font-mono text-[8px] tracking-[0.18em] text-white">
                          {project.link ? 'LIVE' : 'INTERNAL'}
                        </span>
                      </div>

                      <h4 className="font-orbitron text-base font-bold leading-snug text-white transition-colors duration-300 group-hover:text-cyan-200">
                        {project.title}
                      </h4>

                      <p className="mt-3 line-clamp-4 font-rajdhani text-[15px] leading-relaxed text-gray-400">
                        {project.description}
                      </p>

                      <div className="mt-auto pt-5">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="border border-white/[0.08] bg-white/[0.035] px-2 py-0.5 font-mono text-[9px] tracking-[0.08em] text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 border-t border-white/[0.08] pt-4">
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-gray-300 transition-colors hover:text-white"
                              style={{ color: accent }}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              VIEW DEPLOYMENT
                              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                          ) : (
                            <span className="inline-flex cursor-not-allowed items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-gray-600">
                              <ExternalLink className="h-3.5 w-3.5" />
                              NO PUBLIC LINK
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  </CyberCard>
                </Reveal>
              ))}
            </div>
          </div>
        );
      })}
    </SectionShell>
  );
};

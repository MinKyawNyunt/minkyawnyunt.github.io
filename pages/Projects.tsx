
import React from 'react';
import { ExternalLink, Github, Box } from 'lucide-react';
import { PROJECTS } from '../constants';
import { CyberCard } from '../components/CyberCard';

export const Projects = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-12 flex items-end justify-between border-b border-cyan-500/30 pb-4">
        <div>
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white uppercase">Mission Archive</h2>
          <p className="font-mono text-cyan-400 mt-2">DEPLOYED OPERATIONS // {PROJECTS.length} RECORDS</p>
        </div>
        <Box className="w-12 h-12 text-cyan-500/20" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project) => (
          <CyberCard key={project.id} title={`OP-${project.id}`} link={project.link}> 
            <div className="flex flex-col h-full min-h-[420px]">
              <div>
                <div className="relative h-48 mb-4 overflow-hidden group bg-white flex items-center justify-center">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-contain bg-white p-2 grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-2xl font-orbitron font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-5 font-rajdhani">{project.description}</p>
              </div>
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                  {project.link ? (
                    <a
                      href={project.link}
                      className="flex items-center gap-2 text-xs font-orbitron text-cyan-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-3 h-3" /> LINK
                    </a>
                  ) : (
                    <span
                      className="flex items-center gap-2 text-xs font-orbitron text-gray-500 cursor-not-allowed opacity-50"
                      title="No deployment link available"
                    >
                      <ExternalLink className="w-3 h-3" /> LINK
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};


import React from 'react';
import { SKILLS } from '../constants';
import { CyberCard } from '../components/CyberCard';

export const Skills = () => {
  const categories = Array.from(new Set(SKILLS.map(s => s.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-12">
        <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white uppercase">Core Tech</h2>
        <p className="font-mono text-cyan-400 mt-2">TECHNICAL COMPETENCY ANALYSIS </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map(cat => (
          <CyberCard key={cat} title={cat.toUpperCase()} className="h-full">
            <div className="space-y-6">
              {SKILLS.filter(s => s.category === cat).map(skill => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-rajdhani font-bold text-lg text-white">{skill.name}</span>
                    <span className="font-mono text-xs text-cyan-400">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 border border-white/10 overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    >
                      <div className="absolute top-0 right-0 w-1 h-full bg-white animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CyberCard>
        ))}
      </div>

      {/* <div className="mt-12 p-8 border border-pink-500/20 bg-pink-500/5 backdrop-blur-md rounded-lg">
        <h4 className="font-orbitron text-pink-400 mb-2">SYSTEM NOTES</h4>
        <p className="text-gray-400 font-rajdhani leading-relaxed">
          The above metrics represent quantified aptitude across various dimensions of modern software architecture.
          Performance values are periodically updated via neural synchronization cycles. Continuous learning protocols active.
        </p>
      </div> */}
    </div>
  );
};

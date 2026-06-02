
import React from 'react';
import { EXPERIENCES } from '../constants';
import { History } from 'lucide-react';

export const ExperiencePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-12 flex items-center gap-6">
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30">
          <History className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-4xl md:text-6xl font-orbitron font-bold text-white uppercase">History Log</h2>
          <p className="font-mono text-cyan-400 mt-2">CAREER TIMELINE</p>
        </div>
      </div>

      <div className="space-y-12">
        {EXPERIENCES.map((exp, i) => (
          <div key={i} className="relative pl-12 before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-[-48px] before:w-[1px] before:bg-gradient-to-b before:from-cyan-500 before:to-transparent last:before:hidden">
            <div className="absolute left-0 top-1 w-8 h-8 rounded-full border border-cyan-500 bg-black flex items-center justify-center z-10 shadow-[0_0_10px_#00f3ff]">
              <div className="w-2 h-2 bg-cyan-400" />
            </div>
            
            <div className="p-8 border border-white/5 bg-white/5 hover:border-cyan-500/20 transition-all rounded-lg backdrop-blur-md group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <h3 className="text-2xl font-orbitron font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {exp.role}
                </h3>
                <span className="font-mono text-cyan-500 bg-cyan-500/10 px-3 py-1 text-sm border border-cyan-500/30">
                  {exp.period}
                </span>
              </div>
              
              <h4 className="text-pink-400 font-rajdhani text-lg font-bold mb-4 tracking-widest">{exp.company}</h4>
              
              <p className="text-gray-400 leading-relaxed font-rajdhani max-w-3xl">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

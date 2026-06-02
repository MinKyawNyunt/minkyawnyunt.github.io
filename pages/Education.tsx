
import React from 'react';
import { EDUCATION } from '../constants';
import { GraduationCap } from 'lucide-react';

export const EducationPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
      <div className="mb-12 flex items-center gap-6">
        <div className="p-4 bg-pink-500/10 border border-pink-500/30">
          <GraduationCap className="w-8 h-8 text-pink-400" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-6xl font-orbitron font-bold text-white uppercase">Knowledge Bank</h2>
          <p className="font-mono text-pink-400 mt-2">EDUCATIONAL ARCHIVES</p>
        </div>
      </div>

      <div className="space-y-12">
        {EDUCATION.map((edu, i) => (
          <div key={i} className="relative pl-12 before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-[-48px] before:w-[1px] before:bg-gradient-to-b before:from-pink-500 before:to-transparent last:before:hidden">
            <div className="absolute left-0 top-1 w-8 h-8 rounded-full border border-pink-500 bg-black flex items-center justify-center z-10 shadow-[0_0_10px_#ec4899]">
              <div className="w-2 h-2 bg-pink-400" />
            </div>
            
            <div className="p-8 border border-white/5 bg-white/5 hover:border-pink-500/20 transition-all rounded-lg backdrop-blur-md group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <h3 className="text-2xl font-rajdhani font-bold text-white group-hover:text-pink-400 transition-colors tracking-widest">
                  {edu.degree}
                </h3>
                <span className="font-mono text-pink-500 bg-pink-500/10 px-3 py-1 text-sm border border-pink-500/30">
                  {edu.period}
                </span>
              </div>
              
              <h4 className="text-cyan-400 font-rajdhani text-lg font-bold mb-4 tracking-widest">{edu.institution}</h4>
              
              {edu.description && (
                <p className="text-gray-400 leading-relaxed font-rajdhani max-w-3xl mb-4">
                  {edu.description}
                </p>
              )}

              {edu.achievements && edu.achievements.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h5 className="font-mono text-xs text-pink-400 mb-3 uppercase tracking-wider">// Achievements Unlocked</h5>
                  <div className="flex flex-wrap gap-2">
                    {edu.achievements.map((achievement, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 text-sm font-rajdhani bg-pink-500/10 text-pink-300 border border-pink-500/20 rounded"
                      >
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* <div className="mt-12 p-8 border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-md rounded-lg">
        <h4 className="font-orbitron text-cyan-400 mb-2">// SYSTEM LOG</h4>
        <p className="text-gray-400 font-rajdhani leading-relaxed">
          Knowledge acquisition protocols complete. Neural pathways optimized through structured learning modules.
          Continuous education subroutines remain active for lifetime enhancement cycles.
        </p>
      </div> */}
    </div>
  );
};

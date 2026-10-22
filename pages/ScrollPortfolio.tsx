import React from 'react';
import { ArrowUp, ArrowUpRight, Cpu, Github, Linkedin } from 'lucide-react';
import { SECTIONS } from '../theme';
import { Reveal } from '../components/Reveal';
import { Home } from './Home';
import { Projects } from './Projects';
import { Skills } from './Skills';
import { ExperiencePage } from './Experience';
import { EducationPage } from './Education';
import { NeuralInterface } from './NeuralInterface';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 px-4 pb-10 pt-10">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="relative overflow-hidden border border-white/[0.09] bg-[#070a12]/85 p-8 md:p-14">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.14),transparent_68%)]" />
            <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.12),transparent_68%)]" />
            <div className="pointer-events-none absolute inset-0 cyber-grid opacity-30" />

            <div className="relative z-10 max-w-3xl">
              <p className="eyebrow text-cyan-300/70">OPEN CHANNEL // NEXT MISSION</p>
              <h2 className="mt-5 font-orbitron text-[clamp(2rem,5vw,4rem)] font-bold uppercase leading-[0.95] text-white">
                Let&apos;s build
                <br />
                <span className="gradient-text">the next system.</span>
              </h2>
              <p className="mt-5 max-w-xl font-rajdhani text-lg leading-relaxed text-gray-400">
                Available for ambitious full-stack projects, system architecture and
                teams that need someone who ships. The channel is open.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://www.linkedin.com/in/min-kyaw-nyunt/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-cyan-400 px-6 py-3.5 font-orbitron text-[11px] font-bold tracking-[0.16em] text-black transition-all hover:bg-white hover:shadow-[0_0_40px_-8px_#00f3ff]"
                >
                  START A CONVERSATION
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a
                  href="https://github.com/MinKyawNyunt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border border-white/15 px-6 py-3.5 font-orbitron text-[11px] font-bold tracking-[0.16em] text-white transition-all hover:border-white/30 hover:bg-white/[0.05]"
                >
                  <Github className="h-4 w-4" />
                  VIEW GITHUB
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-6 border-t border-white/[0.07] pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center border border-cyan-400/25 bg-cyan-400/[0.05]">
              <Cpu className="h-3.5 w-3.5 text-cyan-300" />
            </span>
            <div>
              <p className="font-orbitron text-[11px] font-bold tracking-[0.16em] text-white">
                MK//ARCHIVE
              </p>
              <p className="mt-0.5 font-mono text-[8px] tracking-[0.16em] text-gray-600">
                © {new Date().getFullYear()} MIN KYAW NYUNT
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="font-mono text-[9px] tracking-[0.16em] text-gray-600 transition-colors hover:text-cyan-300"
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/MinKyawNyunt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-500 transition-colors hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/min-kyaw-nyunt/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-500 transition-colors hover:text-white"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="#home"
              aria-label="Back to top"
              className="flex h-8 w-8 items-center justify-center border border-white/10 text-gray-400 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const ScrollPortfolio: React.FC = () => {
  return (
    <>
      <Home />
      <Projects />
      <Skills />
      <ExperiencePage />
      <EducationPage />
      <NeuralInterface />
      <Footer />
    </>
  );
};

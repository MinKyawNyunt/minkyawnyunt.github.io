import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  Cloud,
  Code2,
  Cpu,
  Database,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { BIO_NAME, BIO_SUMMARY, BIO_TAGLINE, PROJECTS } from '../constants';
import { Reveal } from '../components/Reveal';

const yearsOfExperience = new Date().getFullYear() - 2017;

const STATS = [
  { value: `${yearsOfExperience}+`, label: 'YEARS SHIPPING' },
  { value: `${PROJECTS.length}`, label: 'SYSTEMS DEPLOYED' },
  { value: '300K+', label: 'USERS IMPACTED' },
];

const STACK = ['REACT', 'NODE.JS', 'LARAVEL', 'TYPESCRIPT', 'AWS', 'DOCKER'];

const CUBE_FACES = [
  { modifier: 'front', icon: Code2, label: 'FRONTEND' },
  { modifier: 'right', icon: Database, label: 'BACKEND' },
  { modifier: 'back', icon: Cloud, label: 'CLOUD' },
  { modifier: 'left', icon: Layers, label: 'SYSTEMS' },
  { modifier: 'top', icon: Cpu, label: 'CORE' },
  { modifier: 'bottom', icon: Terminal, label: 'DEVOPS' },
];

export const Home: React.FC = () => {
  const [firstName, ...restName] = BIO_NAME.split(' ');
  const lastName = restName.join(' ');

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden px-4 pb-24 pt-28"
      style={
        {
          '--accent': '#00f3ff',
          '--accent-2': '#ff2bd6',
        } as React.CSSProperties
      }
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-12">
        {/* Copy */}
        <div className="lg:col-span-7">
          <Reveal>
            <div className="inline-flex items-center gap-3 border border-cyan-400/20 bg-[#050810]/70 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <span className="font-mono text-[10px] tracking-[0.24em] text-cyan-200/80">
                SYSTEM ONLINE // PORTFOLIO v3.0
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-8 font-mono text-[11px] tracking-[0.4em] text-gray-500">
              HELLO, I AM
            </p>
            <h1 className="mt-3 font-orbitron text-[clamp(2.9rem,8.6vw,7.2rem)] font-bold uppercase leading-[0.86] tracking-[-0.03em]">
              <span className="gradient-text text-glow block">{firstName}</span>
              <span className="hero-outline block" data-text={lastName}>{lastName}</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-7 flex items-center gap-4">
              <span className="h-px w-10 bg-cyan-400/70" />
              <p className="font-rajdhani text-lg font-semibold uppercase tracking-[0.28em] text-cyan-100/90 md:text-xl">
                {BIO_TAGLINE}
              </p>
            </div>
            <p className="mt-5 max-w-xl font-rajdhani text-lg leading-relaxed text-gray-400">
              {BIO_SUMMARY}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 bg-cyan-400 px-7 py-3.5 font-orbitron text-[11px] font-bold tracking-[0.18em] text-black transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_-8px_#00f3ff]"
                style={{
                  clipPath:
                    'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                }}
              >
                EXPLORE ARCHIVE
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#ai"
                className="group inline-flex items-center gap-3 border border-white/15 px-7 py-3.5 font-orbitron text-[11px] font-bold tracking-[0.18em] text-white transition-all duration-300 hover:border-fuchsia-400/60 hover:bg-fuchsia-500/[0.08] hover:text-fuchsia-200"
              >
                <Sparkles className="h-4 w-4 text-fuchsia-400" />
                NEURAL CHAT
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/[0.08] pt-7">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-orbitron text-2xl font-bold text-white md:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-mono text-[9px] tracking-[0.18em] text-gray-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Hologram panel */}
        <div className="hidden justify-center lg:col-span-5 lg:flex">
          <Reveal delay={280} className="relative w-full max-w-sm">
            <div className="relative flex flex-col items-center py-6">
              <div
                className="orbit-ring -translate-x-1/2 -translate-y-1/2"
                style={{ width: 300, height: 300 }}
              />
              <div
                className="orbit-ring -translate-x-1/2 -translate-y-1/2"
                style={{ width: 390, height: 390, opacity: 0.55 }}
              />

              <div className="scene-3d animate-float py-14">
                <div className="holo-cube">
                  {CUBE_FACES.map(({ modifier, icon: Icon, label }) => (
                    <div key={modifier} className={`holo-face holo-face--${modifier}`}>
                      <Icon className="h-7 w-7" strokeWidth={1.4} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass hud-corner w-full p-5">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                  <span className="font-mono text-[9px] tracking-[0.22em] text-gray-500">
                    IDENTITY NODE
                  </span>
                  <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.18em] text-emerald-300">
                    <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse-dot" />
                    ACTIVE
                  </span>
                </div>

                <dl className="mt-4 space-y-2.5">
                  {[
                    ['ROLE', BIO_TAGLINE.toUpperCase()],
                    ['DOMAIN', 'FINTECH / GOVT / ERP'],
                    ['STATUS', 'OPEN TO COLLAB'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <dt className="font-mono text-[9px] tracking-[0.2em] text-gray-600">
                        {label}
                      </dt>
                      <dd className="font-rajdhani text-xs font-semibold tracking-[0.12em] text-gray-200">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/[0.08] pt-4">
                  {STACK.map((item) => (
                    <span
                      key={item}
                      className="border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 font-mono text-[8px] tracking-[0.14em] text-gray-400"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#projects"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        aria-label="Scroll to projects"
      >
        <span className="font-mono text-[9px] tracking-[0.32em] text-gray-600">
          SCROLL TO EXPLORE
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <span className="absolute inset-0 origin-top bg-cyan-400 animate-[scroll-line_2.4s_ease-in-out_infinite]" />
        </span>
        <ArrowDown className="h-3.5 w-3.5 text-cyan-400/70" />
      </a>
    </section>
  );
};

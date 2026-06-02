
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { BIO_NAME, BIO_TAGLINE, BIO_SUMMARY } from '../constants';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { type Container, type ISourceOptions, MoveDirection, OutMode, type Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const initParticles = async (engine: Engine) => {
  await loadSlim(engine);
};

export const Home = () => {
  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const options: ISourceOptions = {
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#06b6d4",
      },
      links: {
        color: "#ec4899",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.out,
        },
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 200,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 3, max: 5 },
      },
    },
    detectRetina: true,
  };

  return (
    <ParticlesProvider init={initParticles}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] p-4 md:p-8 relative">
        <div className="absolute inset-0 -z-10 bg-transparent">
          <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            options={options}
            className="w-full h-full"
          />
        </div>
        <div className="max-w-4xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* <div className="inline-block px-4 py-1 border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 font-mono text-xs mb-4">
          SYSTEM STATUS: OPTIMIZED // AUTHENTICATED
        </div> */}

        <h1 className="text-5xl md:text-7xl font-orbitron font-bold tracking-tighter leading-none mb-4">
          {/* <span className="text-white">I AM</span><br /> */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            {BIO_NAME}
          </span>
        </h1>

        <p className="text-xl md:text-2xl font-rajdhani font-medium text-cyan-100/80 tracking-wide uppercase">
          {BIO_TAGLINE}
        </p>

        <p className="max-w-2xl mx-auto text-gray-400 font-rajdhani text-lg leading-relaxed">
          {BIO_SUMMARY}
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link 
            to="/projects" 
            className="group relative px-8 py-3 bg-cyan-500 text-black font-orbitron font-bold overflow-hidden transition-all hover:bg-cyan-400"
          >
            <div className="" />
            <span className="relative flex items-center gap-2">
              VIEW ARCHIVES <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link 
            to="/ai" 
            className="px-8 py-3 border border-cyan-500/50 text-cyan-400 font-orbitron font-bold hover:bg-cyan-500/10 transition-colors"
          >
            NEURAL CHAT
          </Link>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            { icon: <Zap className="text-yellow-400" />, label: 'HIGH LATENCY', val: 'RESISTANT' },
            { icon: <Shield className="text-cyan-400" />, label: 'SECURITY', val: 'REINFORCED' },
            { icon: <Globe className="text-pink-500" />, label: 'CONNECTIVITY', val: 'DECENTRALIZED' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-4 border border-white/5 bg-white/5 backdrop-blur-sm rounded-lg hover:border-cyan-500/30 transition-all">
              {item.icon}
              <span className="text-[10px] font-mono text-gray-500 tracking-tighter">{item.label}</span>
              <span className="text-sm font-orbitron text-white">{item.val}</span>
            </div>
          ))}
        </div> */}
      </div>
      </div>
    </ParticlesProvider>
  );
};


import React from 'react';
import { HashRouter as Router, Link, useLocation } from 'react-router-dom';
import { Menu, X, Cpu, Github, Linkedin, Terminal } from 'lucide-react';

// Fixed NavLink: changed children to optional to resolve TS error at usage sites where children were incorrectly reported as missing
const NavLink = ({ to, children }: { to: string; children?: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`relative px-4 py-2 font-orbitron text-sm transition-all duration-300 hover:text-cyan-400 ${isActive ? 'text-cyan-400' : 'text-gray-400'}`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 h-[2px] w-full bg-cyan-400 shadow-[0_0_10px_#00f3ff]" />
      )}
    </Link>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col cyber-grid">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-pink-500/10 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-orbitron text-xl font-bold text-cyan-400 tracking-tighter">
            <Cpu className="w-6 h-6 animate-pulse" />
            <span>MIN-PORTFOLIO</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/">HOME</NavLink>
            <NavLink to="/projects">MISSION</NavLink>
            <NavLink to="/skills">CORE</NavLink>
            <NavLink to="/experience">HISTORY</NavLink>
            <NavLink to="/education">KNOWLEDGE</NavLink>
            <NavLink to="/ai">NEURAL</NavLink>
          </div>

          <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-cyan-400">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/95 pt-20 px-6 flex flex-col gap-6 font-orbitron">
           <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-cyan-400"><X /></button>
           <Link onClick={() => setIsMenuOpen(false)} to="/" className="text-2xl text-gray-300">HOME</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/projects" className="text-2xl text-gray-300">MISSIONS</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/skills" className="text-2xl text-gray-300">CORE</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/experience" className="text-2xl text-gray-300">HISTORY</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/education" className="text-2xl text-gray-300">KNOWLEDGE</Link>
           <Link onClick={() => setIsMenuOpen(false)} to="/ai" className="text-2xl text-cyan-400">AI ASSISTANT</Link>
        </div>
      )}

      <main className="flex-grow relative z-10">
        {children}
      </main>

      {/* <footer className="border-t border-white/10 py-8 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-gray-500">
          <p>© 2077 ARCHITECT NEURAL ARCHIVE // ALL BYTES RESERVED</p>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-500" />
            <span>LATENCY: 12ms</span>
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
            <span>ONLINE</span>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

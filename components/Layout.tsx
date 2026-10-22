import React, { Suspense, useEffect, useState } from 'react';
import { Cpu, Github, Linkedin, Menu, X, ArrowUpRight } from 'lucide-react';
import { SECTIONS } from '../theme';
import { useActiveSection } from '../hooks/useActiveSection';
import { ScrollProgress } from './ScrollProgress';

// Three.js is a large dependency; load it after the page shell paints.
const NeuralBackground = React.lazy(() =>
  import('./NeuralBackground').then((module) => ({ default: module.NeuralBackground }))
);

const SECTION_IDS = SECTIONS.map((section) => section.id);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const activeTheme = SECTIONS[active] ?? SECTIONS[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Suspense fallback={null}>
        <NeuralBackground />
      </Suspense>

      {/* Reactive color atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {SECTIONS.map((section, index) => (
          <div
            key={section.id}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-out"
            style={{
              opacity: active === index ? 1 : 0,
              background: `radial-gradient(90% 70% at 16% 18%, ${section.accent}20, transparent 62%), radial-gradient(80% 70% at 84% 80%, ${section.secondary}16, transparent 62%)`,
            }}
          />
        ))}
        <div className="absolute inset-0 cyber-grid opacity-60" />
        <div className="absolute inset-0 noise-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_22%,#04040a_94%)]" />
      </div>

      <ScrollProgress />

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/[0.07] bg-[#04040a]/95'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <a href="#home" className="group flex items-center gap-3" aria-label="Back to top">
            <span className="relative flex h-9 w-9 items-center justify-center border border-cyan-400/30 bg-cyan-400/[0.06]">
              <Cpu className="h-4 w-4 text-cyan-300" />
              <span className="absolute inset-0 border border-cyan-400/20 animate-ping opacity-20" />
            </span>
            <span className="font-orbitron text-sm font-bold tracking-[0.18em] text-white">
              MK<span className="text-cyan-400">//</span>ARCHIVE
            </span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {SECTIONS.map((section, index) => {
              const isActive = active === index;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative px-3 py-2 font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200'
                  }`}
                >
                  {section.label}
                  <span
                    className="absolute bottom-0 left-1/2 h-px -translate-x-1/2 transition-all duration-300"
                    style={{
                      width: isActive ? '80%' : '0%',
                      backgroundColor: section.accent,
                      boxShadow: isActive ? `0 0 8px ${section.accent}` : 'none',
                    }}
                  />
                </a>
              );
            })}
          </div>

          <div className="hidden items-center gap-4 border-l border-white/10 pl-5 md:flex">
            <a
              href="https://github.com/MinKyawNyunt"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-gray-400 transition-colors hover:text-cyan-300"
            >
              <Github className="h-[18px] w-[18px]" />
            </a>
            <a
              href="https://www.linkedin.com/in/min-kyaw-nyunt/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 transition-colors hover:text-cyan-300"
            >
              <Linkedin className="h-[18px] w-[18px]" />
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center border border-white/10 text-cyan-300 transition-colors hover:border-cyan-400/40 lg:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#04040a]/[0.98] transition-all duration-500 lg:hidden ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-24">
          <div className="space-y-1">
            {SECTIONS.map((section, index) => {
              const isActive = active === index;
              return (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center justify-between border-b border-white/[0.06] py-5"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-gray-600">
                      {section.index}
                    </span>
                    <span
                      className="font-orbitron text-2xl uppercase tracking-wide transition-colors"
                      style={{ color: isActive ? section.accent : '#e7e9f3' }}
                    >
                      {section.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-gray-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: isActive ? section.accent : undefined }}
                  />
                </a>
              );
            })}
          </div>

          <div className="space-y-5">
            <p className="eyebrow text-gray-600">CONNECT // OPEN CHANNEL</p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/MinKyawNyunt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-xs text-gray-300 transition-colors hover:text-cyan-300"
              >
                <Github className="h-4 w-4" /> GITHUB
              </a>
              <a
                href="https://www.linkedin.com/in/min-kyaw-nyunt/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 font-mono text-xs text-gray-300 transition-colors hover:text-cyan-300"
              >
                <Linkedin className="h-4 w-4" /> LINKEDIN
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop section dots */}
      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex">
        {SECTIONS.map((section, index) => {
          const isActive = active === index;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-label={`Go to ${section.label}`}
              className="group flex items-center gap-3"
            >
              <span
                className={`font-mono text-[9px] tracking-[0.2em] transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                style={{ color: section.accent }}
              >
                {section.label}
              </span>
              <span
                className={`h-px transition-all duration-300 ${
                  isActive ? 'w-7' : 'w-3 group-hover:w-5'
                }`}
                style={{
                  backgroundColor: isActive ? section.accent : 'rgba(255,255,255,0.25)',
                }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive ? section.accent : '#475569',
                  boxShadow: isActive ? `0 0 10px ${section.accent}` : 'none',
                }}
              />
            </a>
          );
        })}
      </div>


      <main className="relative z-10">{children}</main>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 bg-gradient-to-t from-[#04040a] to-transparent"
        style={{ opacity: scrolled ? 1 : 0, transition: 'opacity 600ms ease' }}
      />
      <span className="sr-only">
        Current section: {activeTheme.label}
      </span>
    </div>
  );
};

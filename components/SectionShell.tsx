import React from 'react';
import { Reveal } from './Reveal';
import { getSection } from '../theme';

interface SectionShellProps {
  id: string;
  kicker: string;
  title: string;
  accentWord?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionShell: React.FC<SectionShellProps> = ({
  id,
  kicker,
  title,
  accentWord,
  description,
  children,
  className = '',
}) => {
  const theme = getSection(id);

  return (
    <section
      id={id}
      className={`relative px-4 py-24 md:py-32 ${className}`}
      style={
        {
          '--accent': theme.accent,
          '--accent-2': theme.secondary,
        } as React.CSSProperties
      }
    >
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <span
              className="font-mono text-[11px] tracking-[0.3em]"
              style={{ color: theme.accent }}
            >
              {theme.index} //
            </span>
            <span
              className="h-px w-12"
              style={{
                background: `linear-gradient(90deg, ${theme.accent}, transparent)`,
              }}
            />
            <span className="eyebrow text-gray-500">{kicker}</span>
          </div>

          <h2 className="mt-5 font-orbitron text-[clamp(2.1rem,5.4vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-white">
            {title}{' '}
            {accentWord && <span className="gradient-text">{accentWord}</span>}
          </h2>

          {description && (
            <p className="mt-5 max-w-2xl font-rajdhani text-lg leading-relaxed text-gray-400">
              {description}
            </p>
          )}
        </Reveal>

        <div className="mt-14">{children}</div>
      </div>
    </section>
  );
};

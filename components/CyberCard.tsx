import React, { useRef } from 'react';

interface CyberCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  accent?: string;
}

/**
 * Glass card with a pointer-driven 3D tilt, accent glow and HUD corners.
 */
export const CyberCard: React.FC<CyberCardProps> = ({
  children,
  title,
  className = '',
  accent = '#00f3ff',
}) => {
  const innerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const node = innerRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    node.style.setProperty('--rx', `${(0.5 - y) * 9}deg`);
    node.style.setProperty('--ry', `${(x - 0.5) * 11}deg`);
    node.style.setProperty('--mx', `${x * 100}%`);
    node.style.setProperty('--my', `${y * 100}%`);
  };

  const handleLeave = () => {
    const node = innerRef.current;
    if (!node) return;
    node.style.setProperty('--rx', '0deg');
    node.style.setProperty('--ry', '0deg');
    node.style.setProperty('--mx', '50%');
    node.style.setProperty('--my', '50%');
  };

  return (
    <div
      className={`cyber-card ${className}`}
      style={{ '--card-accent': accent } as React.CSSProperties}
    >
      <div
        ref={innerRef}
        className="cyber-card-inner"
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <div className="cyber-card-shine" />
        <div className="cyber-card-glare" />

        <span
          className="pointer-events-none absolute -top-px -left-px z-20 h-5 w-5 border-t-2 border-l-2"
          style={{ borderColor: accent }}
        />
        <span
          className="pointer-events-none absolute -right-px -bottom-px z-20 h-5 w-5 border-r-2 border-b-2"
          style={{ borderColor: accent }}
        />

        <div className="relative z-10 flex h-full flex-col p-6">
          {title && (
            <div className="mb-5 flex items-center gap-2.5">
              <span
                className="h-1.5 w-1.5 shrink-0"
                style={{ backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
              />
              <h3 className="font-mono text-[11px] uppercase tracking-[0.24em] text-gray-300">
                {title}
              </h3>
              <span className="ml-auto h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>
          )}
          <div className="flex flex-1 flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
};

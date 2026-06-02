
import React from 'react';

interface CyberCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  link?: string;
}

export const CyberCard: React.FC<CyberCardProps> = ({ children, title, className = "", link }) => {
  const Wrapper = (props: { children: React.ReactNode }) => {
    if (link && link.trim() !== "") {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full w-full cursor-pointer">
          {props.children}
        </a>
      );
    }
    return <>{props.children}</>;
  };
  return (
    <Wrapper>
      <div className={`relative group h-full ${className}`}>
        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500 z-10 transition-all duration-300 group-hover:w-6 group-hover:h-6" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-pink-500 z-10 transition-all duration-300 group-hover:w-6 group-hover:h-6" />
        
        <div className="bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-sm p-6 overflow-hidden relative h-full flex flex-col">
          {title && (
            <div className="mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-500" />
              <h3 className="font-orbitron text-sm uppercase tracking-widest text-cyan-400">{title}</h3>
            </div>
          )}
          <div className="flex-1 flex flex-col">{children}</div>
          {/* Hover Gradient Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>
    </Wrapper>
  );
};

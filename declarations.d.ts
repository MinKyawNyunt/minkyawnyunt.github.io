declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

declare module 'particlesjs' {
  interface ParticlesOptions {
    selector: string;
    maxParticles?: number;
    sizeVariations?: number;
    speed?: number;
    color?: string | string[];
    minDistance?: number;
    connectParticles?: boolean;
    responsive?: Array<{ breakpoint: number; options: Partial<ParticlesOptions> }>;
  }
  interface ParticlesStatic {
    init(options: ParticlesOptions): void;
    destroy(): void;
    pauseAnimation(): void;
    resumeAnimation(): void;
  }
  const Particles: ParticlesStatic;
  export default Particles;
}

declare module '*.webp' {
  const value: string;
  export default value;
}
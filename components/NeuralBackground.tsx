import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SECTIONS } from '../theme';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute float aScale;
  attribute float aPhase;

  varying float vMix;
  varying float vTwinkle;

  void main() {
    vec3 p = position;

    p.x += sin(uTime * 0.16 + aPhase) * 0.45;
    p.y += cos(uTime * 0.13 + aPhase * 1.7) * 0.45;
    p.z += sin(uTime * 0.11 + aPhase * 0.6) * 0.35;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = uSize * aScale * uPixelRatio * (30.0 / max(-mvPosition.z, 0.001));

    vMix = clamp((p.y + 20.0) / 40.0, 0.0, 1.0);
    vTwinkle = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * 1.4 + aPhase * 6.2831));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;

  varying float vMix;
  varying float vTwinkle;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;

    float core = smoothstep(0.5, 0.04, dist);
    float halo = smoothstep(0.5, 0.18, dist);
    vec3 color = mix(uColorA, uColorB, vMix);

    gl_FragColor = vec4(color * (0.65 + core * 0.65), (core * 0.5 + halo * 0.22) * vTwinkle);
  }
`;

const PALETTE = SECTIONS.map((section) => ({
  a: new THREE.Color(section.accent),
  b: new THREE.Color(section.secondary),
}));

const samplePalette = (progress: number, outA: THREE.Color, outB: THREE.Color) => {
  const scaled = Math.min(Math.max(progress, 0), 1) * (PALETTE.length - 1);
  const index = Math.min(Math.floor(scaled), PALETTE.length - 2);
  const t = scaled - index;

  outA.copy(PALETTE[index].a).lerp(PALETTE[index + 1].a, t);
  outB.copy(PALETTE[index].b).lerp(PALETTE[index + 1].b, t);
};

export const NeuralBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      160
    );
    camera.position.set(0, 1, 25);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    /* ------------------------------------------------------------ */
    /*  Particle nebula                                              */
    /* ------------------------------------------------------------ */

    const count = isMobile ? 1000 : 1800;
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const radius = 5 + Math.pow(Math.random(), 0.62) * 23;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) * 0.72;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      scales[i] = 0.45 + Math.random() * 1.65;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    particleGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const particleUniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uSize: { value: isMobile ? 4.6 : 4.0 },
      uColorA: { value: new THREE.Color(SECTIONS[0].accent) },
      uColorB: { value: new THREE.Color(SECTIONS[0].secondary) },
    };

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: particleUniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    root.add(particles);

    /* ------------------------------------------------------------ */
    /*  Neural connections between a subset of nodes                 */
    /* ------------------------------------------------------------ */

    const nodeCount = isMobile ? 48 : 84;
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i += 1) {
      const radius = 6 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nodePositions.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi) * 0.75,
          radius * Math.sin(phi) * Math.sin(theta)
        )
      );
    }

    const segments: number[] = [];
    const maxDistance = isMobile ? 5.2 : 5.8;

    for (let i = 0; i < nodePositions.length; i += 1) {
      for (let j = i + 1; j < nodePositions.length; j += 1) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < maxDistance) {
          segments.push(
            nodePositions[i].x,
            nodePositions[i].y,
            nodePositions[i].z,
            nodePositions[j].x,
            nodePositions[j].y,
            nodePositions[j].z
          );
        }
      }
    }

    const connectionGeometry = new THREE.BufferGeometry();
    connectionGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(segments), 3)
    );

    const connectionMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(SECTIONS[0].accent),
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const connections = new THREE.LineSegments(connectionGeometry, connectionMaterial);
    root.add(connections);

    /* ------------------------------------------------------------ */
    /*  Faint orbital rings                                          */
    /* ------------------------------------------------------------ */

    const ringMaterials: THREE.LineBasicMaterial[] = [];
    const rings = new THREE.Group();

    [
      { radius: 9.5, tilt: 1.15, spin: 0.18, opacity: 0.2 },
      { radius: 14, tilt: -0.7, spin: -0.12, opacity: 0.12 },
    ].forEach((ring) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 180; i += 1) {
        const angle = (i / 180) * Math.PI * 2;
        points.push(
          new THREE.Vector3(Math.cos(angle) * ring.radius, 0, Math.sin(angle) * ring.radius)
        );
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: new THREE.Color(SECTIONS[0].accent),
        transparent: true,
        opacity: ring.opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const line = new THREE.LineLoop(geometry, material);
      line.rotation.x = ring.tilt;
      line.userData.spin = ring.spin;
      ringMaterials.push(material);
      rings.add(line);
    });

    root.add(rings);

    /* ------------------------------------------------------------ */
    /*  Scroll + pointer state                                       */
    /* ------------------------------------------------------------ */

    let targetScroll = 0;
    let smoothScroll = 0;
    const pointer = { x: 0, y: 0 };
    const smoothPointer = { x: 0, y: 0 };

    let sectionAnchors: number[] = [];
    let anchorOffset = window.innerHeight * 0.35;

    /*
     * Section offsets are cached and only recomputed on resize / font load.
     * The render loop then reads scrollY directly, which removes the layout
     * thrash caused by querying every section on every scroll event.
     */
    const measureAnchors = () => {
      anchorOffset = window.innerHeight * 0.35;
      sectionAnchors = SECTIONS.map((section) => {
        const el = document.getElementById(section.id);
        if (!el) return Number.NaN;
        return el.getBoundingClientRect().top + window.scrollY - anchorOffset;
      });
    };

    const updateScrollTarget = () => {
      const scrollY = window.scrollY;

      if (sectionAnchors.length !== SECTIONS.length || !sectionAnchors.every(Number.isFinite)) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        targetScroll = max > 0 ? Math.min(Math.max(scrollY / max, 0), 1) : 0;
        return;
      }

      let index = 0;
      for (let i = 0; i < sectionAnchors.length; i += 1) {
        if (sectionAnchors[i] <= scrollY) index = i;
      }

      if (index >= sectionAnchors.length - 1) {
        targetScroll = 1;
        return;
      }

      const start = sectionAnchors[index];
      const end = sectionAnchors[index + 1];
      const local = Math.min(Math.max((scrollY - start) / Math.max(end - start, 1), 0), 1);
      targetScroll = (index + local) / (sectionAnchors.length - 1);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      particleUniforms.uPixelRatio.value = renderer.getPixelRatio();
      measureAnchors();
    };

    measureAnchors();
    updateScrollTarget();
    smoothScroll = targetScroll;

    const onLoad = () => measureAnchors();
    const lateMeasure = window.setTimeout(measureAnchors, 1600);

    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('load', onLoad);
    document.fonts?.ready.then(measureAnchors).catch(() => undefined);

    /* ------------------------------------------------------------ */
    /*  Animation loop                                               */
    /* ------------------------------------------------------------ */

    const clock = new THREE.Clock();
    const colorA = new THREE.Color();
    const colorB = new THREE.Color();
    const frameInterval = 1000 / 60;
    let lastFrame = 0;
    let frame = 0;

    const render = (time = 0) => {
      frame = requestAnimationFrame(render);

      // Keep a steady 60fps cadence on high-refresh displays without
      // dropping to a juddery 45fps on 90Hz panels.
      const sinceLast = time - lastFrame;
      if (sinceLast < frameInterval * 0.9) return;
      lastFrame = time - (sinceLast % frameInterval);

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;

      updateScrollTarget();
      smoothScroll += (targetScroll - smoothScroll) * 0.055;
      smoothPointer.x += (pointer.x - smoothPointer.x) * 0.045;
      smoothPointer.y += (pointer.y - smoothPointer.y) * 0.045;

      samplePalette(smoothScroll, colorA, colorB);

      particleUniforms.uTime.value = elapsed;
      particleUniforms.uColorA.value.lerp(colorA, 0.08);
      particleUniforms.uColorB.value.lerp(colorB, 0.08);
      connectionMaterial.color.lerp(colorA, 0.08);
      ringMaterials[0]?.color.lerp(colorA, 0.06);
      ringMaterials[1]?.color.lerp(colorB, 0.06);

      if (!reduceMotion) {
        root.rotation.y = elapsed * 0.02 + smoothPointer.x * 0.22;
        root.rotation.x = -0.08 + smoothPointer.y * 0.12;
        root.rotation.z = smoothScroll * 0.3;

        rings.children.forEach((ring) => {
          ring.rotation.z += delta * (ring.userData.spin as number);
        });

        camera.position.x = smoothPointer.x * 1.9;
        camera.position.y = 1.2 - smoothPointer.y * 1.3 + smoothScroll * 3;
        camera.position.z = 25 - smoothScroll * 7.5;
      }

      camera.lookAt(0, smoothScroll * 1.6, 0);
      renderer.render(scene, camera);
    };

    frame = requestAnimationFrame(render);

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (!frame) {
        clock.getDelta();
        lastFrame = 0;
        frame = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(lateMeasure);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('load', onLoad);

      particleGeometry.dispose();
      particleMaterial.dispose();
      connectionGeometry.dispose();
      connectionMaterial.dispose();
      rings.children.forEach((ring) => {
        const line = ring as THREE.Line;
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};

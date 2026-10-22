import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently closest to the viewport's focus line.
 * Section offsets are cached so scrolling never forces a layout read.
 */
export const useActiveSection = (ids: string[]): number => {
  const [active, setActive] = useState(0);
  const key = ids.join('|');

  useEffect(() => {
    let frame = 0;
    let tops: number[] = [];
    let docHeight = document.documentElement.scrollHeight;

    const measure = () => {
      tops = ids.map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : Number.NaN;
      });
      docHeight = document.documentElement.scrollHeight;
    };

    const update = () => {
      frame = 0;

      if (tops.length !== ids.length || !tops.every(Number.isFinite)) {
        measure();
      }

      const probe = window.scrollY + window.innerHeight * 0.4;
      let next = 0;

      tops.forEach((top, index) => {
        if (top <= probe) next = index;
      });

      if (window.innerHeight + window.scrollY >= docHeight - 8) {
        next = ids.length - 1;
      }

      setActive((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    update();

    const lateMeasure = window.setTimeout(() => {
      measure();
      update();
    }, 1600);
    document.fonts?.ready.then(() => {
      measure();
      update();
    }).catch(() => undefined);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(lateMeasure);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
};

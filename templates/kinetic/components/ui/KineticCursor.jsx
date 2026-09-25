'use client';

import { useRef } from 'react';
import {
  canHoverFine,
  getGsap,
  prefersReducedMotion,
  registerKineticGsap,
  useGSAP,
} from '../gsapSetup';

registerKineticGsap();

/**
 * Desktop custom cursor that tracks pointer and scales smoothly on interactive targets.
 * Optimized with quickTo and event boundary checks to eliminate DOM class thrashing.
 */
export default function KineticCursor() {
  const rootRef = useRef(null);
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      if (!canHoverFine() || prefersReducedMotion()) return undefined;

      const { gsap } = getGsap();
      if (!gsap || !ringRef.current || !dotRef.current) return undefined;

      const root = rootRef.current;
      root?.classList.add('is-active');

      const xRing = gsap.quickTo(ringRef.current, 'x', { duration: 0.28, ease: 'power3.out' });
      const yRing = gsap.quickTo(ringRef.current, 'y', { duration: 0.28, ease: 'power3.out' });
      const xDot = gsap.quickTo(dotRef.current, 'x', { duration: 0.08, ease: 'power3.out' });
      const yDot = gsap.quickTo(dotRef.current, 'y', { duration: 0.08, ease: 'power3.out' });

      const onMove = contextSafe((event) => {
        xRing(event.clientX);
        yRing(event.clientY);
        xDot(event.clientX);
        yDot(event.clientY);
      });

      const interactiveSelector = 'a, button, [data-kinetic-magnet], .kinetic-invert, .kinetic-card, .kinetic-skill-card, .kinetic-chip';

      const onOver = contextSafe((event) => {
        const hit = event.target.closest(interactiveSelector);
        if (hit && !root?.classList.contains('is-hot')) {
          root?.classList.add('is-hot');
        }
      });

      const onOut = contextSafe((event) => {
        const hit = event.target.closest(interactiveSelector);
        if (hit && (!event.relatedTarget || !hit.contains(event.relatedTarget))) {
          root?.classList.remove('is-hot');
        }
      });

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerout', onOut, { passive: true });

      return () => {
        window.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.removeEventListener('pointerout', onOut);
        root?.classList.remove('is-active', 'is-hot');
      };
    },
    { scope: rootRef },
  );

  return (
    <div className="kinetic-cursor" ref={rootRef} aria-hidden="true">
      <span className="kinetic-cursor-ring" ref={ringRef} />
      <span className="kinetic-cursor-dot" ref={dotRef} />
    </div>
  );
}

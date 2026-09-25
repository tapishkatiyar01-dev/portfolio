'use client';

import { useRef } from 'react';
import {
  canHoverFine,
  getGsap,
  prefersReducedMotion,
  registerStageGsap,
  useGSAP,
} from '../gsapSetup';

registerStageGsap();

/**
 * Desktop custom cursor that tracks pointer and scales on interactive targets.
 * Hidden on coarse pointers / touch-primary devices.
 */
export default function StageCursor() {
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

      const xRing = gsap.quickTo(ringRef.current, 'x', { duration: 0.35, ease: 'power3.out' });
      const yRing = gsap.quickTo(ringRef.current, 'y', { duration: 0.35, ease: 'power3.out' });
      const xDot = gsap.quickTo(dotRef.current, 'x', { duration: 0.12, ease: 'power3.out' });
      const yDot = gsap.quickTo(dotRef.current, 'y', { duration: 0.12, ease: 'power3.out' });

      const onMove = contextSafe((event) => {
        xRing(event.clientX);
        yRing(event.clientY);
        xDot(event.clientX);
        yDot(event.clientY);
      });

      const onOver = contextSafe((event) => {
        const hit = event.target.closest('a, button, [data-ks-magnet], .kineticstage-invert');
        if (hit) root?.classList.add('is-hot');
      });

      const onOut = contextSafe((event) => {
        const hit = event.target.closest('a, button, [data-ks-magnet], .kineticstage-invert');
        if (hit) root?.classList.remove('is-hot');
      });

      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver);
      document.addEventListener('pointerout', onOut);

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
    <div className="kineticstage-cursor" ref={rootRef} aria-hidden="true">
      <span className="kineticstage-cursor-ring" ref={ringRef} />
      <span className="kineticstage-cursor-dot" ref={dotRef} />
    </div>
  );
}

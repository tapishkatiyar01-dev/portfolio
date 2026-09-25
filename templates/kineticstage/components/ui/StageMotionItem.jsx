'use client';

import { useRef } from 'react';
import {
  getGsap,
  lightTap,
  prefersReducedMotion,
  registerStageGsap,
  useGSAP,
} from '../gsapSetup';

registerStageGsap();

/**
 * Reliable hover + touch motion for section items.
 * Uses pointer events (works for mouse, pen, and touch) via useGSAP + contextSafe.
 */
export default function StageMotionItem({
  as: Tag = 'article',
  className = '',
  children,
  lift = -10,
  scale = 1.025,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      const el = ref.current;
      const { gsap } = getGsap();
      if (!el || !gsap || prefersReducedMotion()) return undefined;

      gsap.set(el, { transformOrigin: '50% 50%' });

      const toHot = contextSafe(() => {
        gsap.to(el, {
          y: lift,
          scale,
          duration: 0.32,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        el.classList.add('is-hot');
      });

      const toRest = contextSafe(() => {
        gsap.to(el, {
          y: 0,
          scale: 1,
          duration: 0.28,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        el.classList.remove('is-hot', 'is-pressed');
      });

      const toPress = contextSafe(() => {
        lightTap();
        gsap.to(el, {
          y: lift * 0.35,
          scale: Math.min(scale, 0.985),
          duration: 0.14,
          ease: 'power2.out',
          overwrite: 'auto',
        });
        el.classList.add('is-pressed');
      });

      const onUp = contextSafe((event) => {
        el.classList.remove('is-pressed');
        // Keep lift if pointer is still over the card (desktop); reset on touch end
        if (event.pointerType === 'touch' || event.pointerType === 'pen') {
          toRest();
          return;
        }
        if (el.matches(':hover')) toHot();
        else toRest();
      });

      el.addEventListener('pointerenter', toHot);
      el.addEventListener('pointerleave', toRest);
      el.addEventListener('pointerdown', toPress);
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', toRest);

      return () => {
        el.removeEventListener('pointerenter', toHot);
        el.removeEventListener('pointerleave', toRest);
        el.removeEventListener('pointerdown', toPress);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointercancel', toRest);
        el.classList.remove('is-hot', 'is-pressed');
        gsap.set(el, { y: 0, scale: 1 });
      };
    },
    { scope: ref, dependencies: [lift, scale] },
  );

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

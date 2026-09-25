'use client';

import { useRef } from 'react';
import {
  getGsap,
  prefersReducedMotion,
  registerStageGsap,
  useGSAP,
} from '../gsapSetup';

registerStageGsap();

/** Infinite horizontal marquee — pauses on pointer/touch hold. */
export default function StageMarquee({ items = [], speed = 28, label = 'Marquee' }) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const list = items.filter(Boolean);
  const doubled = list.length ? [...list, ...list] : [];
  const depKey = list.join('|');

  useGSAP(
    (context, contextSafe) => {
      const track = trackRef.current;
      const { gsap } = getGsap();
      if (!track || !gsap || prefersReducedMotion() || !list.length) return undefined;

      const half = track.scrollWidth / 2;
      if (!half) return undefined;

      const tween = gsap.to(track, {
        x: -half,
        duration: speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize((value) => parseFloat(value) % half),
        },
      });

      const pause = contextSafe(() => tween.pause());
      const play = contextSafe(() => tween.play());

      const root = rootRef.current;
      root?.addEventListener('pointerdown', pause);
      root?.addEventListener('pointerup', play);
      root?.addEventListener('pointerleave', play);
      root?.addEventListener('pointercancel', play);

      return () => {
        root?.removeEventListener('pointerdown', pause);
        root?.removeEventListener('pointerup', play);
        root?.removeEventListener('pointerleave', play);
        root?.removeEventListener('pointercancel', play);
        tween.kill();
      };
    },
    { scope: rootRef, dependencies: [depKey, speed] },
  );

  if (!list.length) return null;

  return (
    <div className="kineticstage-marquee" ref={rootRef} aria-label={label}>
      <div className="kineticstage-marquee-track" ref={trackRef}>
        {doubled.map((item, index) => (
          <span key={`${item}-${index}`} className="kineticstage-marquee-item">
            {item}
            <i aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}

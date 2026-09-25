'use client';

import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import {
  getGsap,
  prefersReducedMotion,
  registerStageGsap,
  revealItems,
  useGSAP,
} from '../gsapSetup';
import StageMotionItem from '../ui/StageMotionItem';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

registerStageGsap();

export default function TimelineLayout({ items, dataType, itemType }) {
  const rootRef = useRef(null);
  const isMinimal = isMinimalDataType(dataType);

  useGSAP(
    () => {
      const root = rootRef.current;
      const { gsap } = getGsap();
      if (!root) return undefined;

      const batch = revealItems(root, '.kineticstage-timeline-node', {
        y: 28,
        x: -10,
        stagger: 0.06,
        scale: 0.985,
        start: 'top 92%',
        duration: 0.55,
        ease: 'power2.out',
      });

      if (gsap && !prefersReducedMotion()) {
        const track = root.querySelector('.kineticstage-timeline-track');
        if (track) {
          gsap.fromTo(
            track,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top 80%',
                end: 'bottom 30%',
                scrub: 0.85,
              },
            },
          );
        }
      }

      return () => batch?.kill();
    },
    { scope: rootRef, dependencies: [items.length], revertOnUpdate: true },
  );

  return (
    <div
      className={`kineticstage-timeline${isMinimal ? ' is-minimal' : ''}`}
      ref={rootRef}
      data-ks-items
    >
      <div className="kineticstage-timeline-track" aria-hidden="true" />
      {items.map((item, index) => {
        const fields = getRecordFields(item, dataType, itemType);
        return (
          <article
            className={`kineticstage-timeline-node${isMinimal ? ' is-minimal' : ''}`}
            key={`${fields.title}-${index}`}
          >
            <div className="kineticstage-timeline-marker">
              <span className="kineticstage-timeline-dot" />
              <span>{String(index + 1).padStart(2, '0')}</span>
            </div>
            {!isMinimal && fields.date && (
              <time className="kineticstage-timeline-date">{fields.date}</time>
            )}
            <StageMotionItem className="kineticstage-timeline-card" lift={-8} scale={1.02}>
              {fields.image && (
                <div className="kineticstage-thumb">
                  <img src={fields.image} alt={fields.title} loading="lazy" />
                </div>
              )}
              {fields.subtitle && <small>{fields.subtitle}</small>}
              <h3>{fields.title}</h3>
              <DescriptionDisclosure description={fields.summary} />
              {(fields.tags.length > 0 || fields.links.length > 0) && (
                <div className="kineticstage-card-foot">
                  {fields.tags.length > 0 && <span>{fields.tags.join(' · ')}</span>}
                  {fields.links.map((link) => (
                    <a key={link.label || link.href} href={link.href}>
                      {link.label || 'Open'} ↗
                    </a>
                  ))}
                </div>
              )}
            </StageMotionItem>
          </article>
        );
      })}
    </div>
  );
}

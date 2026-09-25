'use client';

import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import {
  registerStageGsap,
  revealItems,
  useGSAP,
} from '../gsapSetup';
import StageMotionItem from '../ui/StageMotionItem';
import { getRecordFields } from './layoutUtils';

registerStageGsap();

export default function GridLayout({ items, dataType, itemType }) {
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return undefined;
      const batch = revealItems(grid, '.kineticstage-card', {
        y: 28,
        scale: 0.985,
        stagger: 0.06,
        start: 'top 92%',
        duration: 0.55,
        ease: 'power2.out',
        batchMax: 4,
      });
      return () => batch?.kill();
    },
    { scope: gridRef, dependencies: [items.length], revertOnUpdate: true },
  );

  return (
    <div className="kineticstage-records">
      <div className="kineticstage-grid-cards" ref={gridRef} data-ks-items>
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);
          return (
            <StageMotionItem
              key={`${fields.title}-${index}`}
              className="kineticstage-card"
              lift={-12}
              scale={1.03}
            >
              <div className="kineticstage-card-top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                {fields.date && <time>{fields.date}</time>}
              </div>
              {fields.image && (
                <div className="kineticstage-thumb">
                  <img src={fields.image} alt={fields.title} loading="lazy" />
                </div>
              )}
              {fields.subtitle && <small>{fields.subtitle}</small>}
              <h3>{fields.title}</h3>
              <DescriptionDisclosure description={fields.summary} />
              <div className="kineticstage-card-foot">
                {fields.tags.length > 0 && (
                  <div className="kineticstage-tags">
                    {fields.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                {fields.links.length > 0 && (
                  <div className="kineticstage-links">
                    {fields.links.map((link) => (
                      <a key={link.label || link.href} href={link.href}>
                        {link.label || 'Open'} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </StageMotionItem>
          );
        })}
      </div>
    </div>
  );
}

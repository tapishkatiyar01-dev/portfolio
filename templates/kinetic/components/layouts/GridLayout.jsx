'use client';

import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import {
  registerKineticGsap,
  revealItems,
  useGSAP,
} from '../gsapSetup';
import KineticMotionItem from '../ui/KineticMotionItem';
import { getRecordFields } from './layoutUtils';

registerKineticGsap();

export default function GridLayout({ items, dataType, itemType }) {
  const gridRef = useRef(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return undefined;
      const batch = revealItems(grid, '.kinetic-card', {
        y: 34,
        scale: 0.97,
        stagger: 0.07,
        start: 'top 90%',
        duration: 0.6,
        ease: 'power3.out',
        batchMax: 3,
      });
      return () => batch?.kill();
    },
    { scope: gridRef, dependencies: [items.length], revertOnUpdate: true },
  );

  return (
    <div className="kinetic-records">
      <div className="kinetic-grid-cards" ref={gridRef} data-kinetic-items>
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);
          return (
            <KineticMotionItem
              key={`${fields.title}-${index}`}
              className="kinetic-card"
              lift={-12}
              scale={1.03}
            >
              <div className="kinetic-card-top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                {fields.date && <time>{fields.date}</time>}
              </div>
              {fields.image && (
                <div className="kinetic-thumb">
                  <img src={fields.image} alt={fields.title} loading="lazy" />
                </div>
              )}
              {fields.subtitle && <small>{fields.subtitle}</small>}
              <h3>{fields.title}</h3>
              <DescriptionDisclosure description={fields.summary} />
              <div className="kinetic-card-foot">
                {fields.tags.length > 0 && (
                  <div className="kinetic-tags">
                    {fields.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                {fields.links.length > 0 && (
                  <div className="kinetic-links">
                    {fields.links.map((link) => (
                      <a key={link.label || link.href} href={link.href}>
                        {link.label || 'Open'} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </KineticMotionItem>
          );
        })}
      </div>
    </div>
  );
}

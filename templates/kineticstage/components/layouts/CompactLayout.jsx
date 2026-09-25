'use client';

import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import {
  registerStageGsap,
  revealItems,
  useGSAP,
} from '../gsapSetup';
import StageMotionItem from '../ui/StageMotionItem';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

registerStageGsap();

export default function CompactLayout({ items, dataType, itemType }) {
  const rootRef = useRef(null);
  const isMinimal = isMinimalDataType(dataType);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return undefined;
      const batch = revealItems(root, '.kineticstage-compact-slot', {
        y: 22,
        x: -6,
        stagger: 0.05,
        scale: 0.985,
        start: 'top 92%',
        duration: 0.5,
        ease: 'power2.out',
      });
      return () => batch?.kill();
    },
    { scope: rootRef, dependencies: [items.length], revertOnUpdate: true },
  );

  return (
    <div
      className={`kineticstage-compact${isMinimal ? ' is-minimal' : ''}`}
      ref={rootRef}
      data-ks-items
    >
      {items.map((item, index) => {
        const fields = getRecordFields(item, dataType, itemType);
        return (
          <StageMotionItem
            key={`${fields.title}-${index}`}
            className="kineticstage-compact-slot"
            lift={-7}
            scale={1.02}
          >
            <span className="kineticstage-slot-index">{String(index + 1).padStart(2, '0')}</span>
            <div className="kineticstage-slot-body">
              {fields.image && <img src={fields.image} alt={fields.title} loading="lazy" />}
              <h3>{fields.title}</h3>
              {fields.subtitle && <p>{fields.subtitle}</p>}
              <DescriptionDisclosure description={fields.summary} />
              {fields.tags.length > 0 && <small>{fields.tags.join(' · ')}</small>}
            </div>
            {!isMinimal && fields.date && <time>{fields.date}</time>}
            {!isMinimal && fields.links.length > 0 && (
              <div className="kineticstage-slot-links">
                {fields.links.map((link) => (
                  <a key={link.label || link.href} href={link.href}>
                    {link.label || 'Open'} ↗
                  </a>
                ))}
              </div>
            )}
          </StageMotionItem>
        );
      })}
    </div>
  );
}

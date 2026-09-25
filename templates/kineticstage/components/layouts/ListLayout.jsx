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

export default function ListLayout({ items, dataType, itemType }) {
  const listRef = useRef(null);
  const isMinimal = isMinimalDataType(dataType);
  const hasImages = !isMinimal && items.some((item) => getRecordFields(item, dataType, itemType).image);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return undefined;
      const batch = revealItems(list, '.kineticstage-list-row', {
        y: 22,
        x: -8,
        stagger: 0.05,
        scale: 0.985,
        start: 'top 92%',
        duration: 0.5,
        ease: 'power2.out',
      });
      return () => batch?.kill();
    },
    { scope: listRef, dependencies: [items.length], revertOnUpdate: true },
  );

  return (
    <div className={`kineticstage-list${isMinimal ? ' is-minimal' : ''}${hasImages ? ' has-images' : ' no-images'}`}>
      <div className="kineticstage-list-head" aria-hidden="true">
        <span>#</span>
        <span>Entry</span>
        <span>Details</span>
        {!isMinimal && <span>Period</span>}
        {!isMinimal && <span>Links</span>}
      </div>
      <div className="kineticstage-list-body" ref={listRef} data-ks-items>
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);
          return (
            <StageMotionItem
              key={`${fields.title}-${index}`}
              className={`kineticstage-list-row ${fields.image ? 'has-image' : 'no-image'}`}
              lift={-6}
              scale={1.015}
            >
              <span className="kineticstage-rank">{String(index + 1).padStart(2, '0')}</span>
              <div className="kineticstage-list-title">
                {fields.image && <img src={fields.image} alt="" loading="lazy" />}
                <strong>{fields.title}</strong>
                {fields.subtitle && <small>{fields.subtitle}</small>}
              </div>
              <div className="kineticstage-list-detail">
                <DescriptionDisclosure description={fields.summary} />
                {fields.tags.length > 0 && (
                  <span className="kineticstage-list-tags">{fields.tags.join(' · ')}</span>
                )}
              </div>
              {!isMinimal && fields.date && <time>{fields.date}</time>}
              {!isMinimal && fields.links.length > 0 && (
                <div className="kineticstage-list-links">
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
    </div>
  );
}

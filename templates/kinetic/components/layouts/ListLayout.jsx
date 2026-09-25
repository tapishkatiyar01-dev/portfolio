'use client';

import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import {
  registerKineticGsap,
  revealItems,
  useGSAP,
} from '../gsapSetup';
import KineticMotionItem from '../ui/KineticMotionItem';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

registerKineticGsap();

export default function ListLayout({ items, dataType, itemType }) {
  const listRef = useRef(null);
  const isMinimal = isMinimalDataType(dataType);

  useGSAP(
    () => {
      const list = listRef.current;
      if (!list) return undefined;
      const batch = revealItems(list, '.kinetic-list-row', {
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
    <div className={`kinetic-list${isMinimal ? ' is-minimal' : ''}`}>
      <div className="kinetic-list-head" aria-hidden="true">
        <span>#</span>
        <span>Entry</span>
        <span>Details</span>
        {!isMinimal && <span>Period</span>}
        {!isMinimal && <span>Links</span>}
      </div>
      <div className="kinetic-list-body" ref={listRef} data-kinetic-items>
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);
          return (
            <KineticMotionItem
              key={`${fields.title}-${index}`}
              className="kinetic-list-row"
              lift={-6}
              scale={1.015}
            >
              <span className="kinetic-rank">{String(index + 1).padStart(2, '0')}</span>
              <div className="kinetic-list-title">
                {fields.image && <img src={fields.image} alt="" loading="lazy" />}
                <strong>{fields.title}</strong>
                {fields.subtitle && <small>{fields.subtitle}</small>}
              </div>
              <div className="kinetic-list-detail">
                <DescriptionDisclosure description={fields.summary} />
                {fields.tags.length > 0 && (
                  <span className="kinetic-list-tags">{fields.tags.join(' · ')}</span>
                )}
              </div>
              {!isMinimal && fields.date && <time>{fields.date}</time>}
              {!isMinimal && fields.links.length > 0 && (
                <div className="kinetic-list-links">
                  {fields.links.map((link) => (
                    <a key={link.label || link.href} href={link.href}>
                      {link.label || 'Open'} ↗
                    </a>
                  ))}
                </div>
              )}
            </KineticMotionItem>
          );
        })}
      </div>
    </div>
  );
}

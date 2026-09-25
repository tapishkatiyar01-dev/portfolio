'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import Badge from '@/templates/asthetic/components/ui/Badge';
import { aestheticCardMotion, aestheticStagger, aestheticStaggerItem } from '../motionConfig';
import LayoutFrame from './LayoutFrame';
import { getItemKind, getRecordFields, isMinimalDataType } from './layoutUtils';

export default function GridLayout({ items, dataType, itemType = dataType, sectionName = '' }) {
  const reduced = useReducedMotion();
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.02, margin: '0px 0px -8% 0px' });

  return (
    <LayoutFrame title={sectionName || 'Selected work'}>
      <motion.div
        ref={gridRef}
        className="aesthetic-layout-grid"
        variants={aestheticStagger}
        initial={reduced ? false : 'hidden'}
        animate={reduced || inView ? 'visible' : 'hidden'}
      >
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);
          const isMinimal = isMinimalDataType(dataType);

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              className="aesthetic-grid-card"
              variants={aestheticStaggerItem}
              {...aestheticCardMotion(reduced)}
            >
              {fields.image ? (
                <div className="aesthetic-card-image">
                  <img src={fields.image} alt={fields.title} loading="lazy" />
                  <div className="aesthetic-avatar-scan" aria-hidden="true" />
                </div>
              ) : (
                !isMinimal && <div className="aesthetic-card-icon" aria-hidden="true">✦</div>
              )}

              <div className="aesthetic-card-body">
                <p className="aesthetic-card-kicker">{getItemKind(itemType)}</p>
                {fields.title && <h3>{fields.title}</h3>}
                {!isMinimal && fields.subtitle && (
                  <p className="aesthetic-card-subtitle">{fields.subtitle}</p>
                )}
                <DescriptionDisclosure
                  className="aesthetic-card-summary"
                  description={fields.summary}
                />
                {fields.tags.length > 0 && (
                  <div className="aesthetic-tag-row">
                    {fields.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
                {!isMinimal && (fields.date || fields.links.length > 0) && (
                  <div className="aesthetic-link-row">
                    {fields.date && <span className="aesthetic-date-chip">{fields.date}</span>}
                    {fields.links.map((link) => (
                      <a key={link.label} href={link.href} className="aesthetic-mini-link">
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </LayoutFrame>
  );
}

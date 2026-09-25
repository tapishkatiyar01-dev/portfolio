'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import Badge from '@/templates/asthetic/components/ui/Badge';
import { aestheticSlideIn, aestheticTimelineMotion } from '../motionConfig';
import LayoutFrame from './LayoutFrame';
import { getItemKind, getRecordFields, isMinimalDataType } from './layoutUtils';

export default function TimelineLayout({ items, dataType, itemType = dataType, sectionName = '' }) {
  const reduced = useReducedMotion();
  const isMinimal = isMinimalDataType(dataType);

  return (
    <LayoutFrame title={sectionName || 'Timeline'}>
      <div className={`aesthetic-timeline${isMinimal ? ' aesthetic-timeline-minimal' : ''}`}>
        <div className="aesthetic-timeline-rail" aria-hidden="true" />

        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              className="aesthetic-timeline-item"
              custom={index}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.05, margin: '0px 0px -12% 0px' }}
              variants={aestheticSlideIn}
              {...aestheticTimelineMotion(reduced)}
            >
              <div className="aesthetic-timeline-marker">
                <span className="aesthetic-timeline-dot" />
              </div>

              {!isMinimal && fields.date && (
                <div className="aesthetic-timeline-date">
                  <span>{fields.date}</span>
                  <span className="aesthetic-data-kind">{getItemKind(itemType)}</span>
                </div>
              )}

              <div className="aesthetic-timeline-card">
                {fields.image && (
                  <div className="aesthetic-card-image aesthetic-timeline-image">
                    <img src={fields.image} alt={fields.title} loading="lazy" />
                    <div className="aesthetic-avatar-scan" aria-hidden="true" />
                  </div>
                )}
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
                {!isMinimal && fields.links.length > 0 && (
                  <div className="aesthetic-link-row">
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
      </div>
    </LayoutFrame>
  );
}

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { arcadeSlideIn, arcadeTimelineMotion } from '../motionConfig';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

export default function TimelineLayout({ items, dataType, itemType }) {
  const reduced = useReducedMotion();
  const isMinimal = isMinimalDataType(dataType);

  return (
    <section className="arcade-panel arcade-records">
      <div className="arcade-panel-label">
        <span>STAGE</span>
        <i aria-hidden="true" />
        <span>WORLD MAP</span>
      </div>

      <div className={`arcade-timeline${isMinimal ? ' arcade-timeline-minimal' : ''}`}>
        <div className="arcade-timeline-track" aria-hidden="true" />

        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              className={`arcade-timeline-node${isMinimal ? ' arcade-timeline-node-minimal' : ''}`}
              custom={index}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.05, margin: '0px 0px -12% 0px' }}
              variants={arcadeSlideIn}
              {...arcadeTimelineMotion(reduced)}
            >
              <div className="arcade-timeline-marker">
                <motion.span
                  className="arcade-timeline-dot"
                  animate={reduced ? undefined : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
                <span className="arcade-timeline-level">{String(index + 1).padStart(2, '0')}</span>
              </div>

              {!isMinimal && fields.date && (
                <time className="arcade-timeline-date">{fields.date}</time>
              )}

              <div className="arcade-timeline-card">
                {fields.image && (
                  <div className="arcade-record-thumb arcade-timeline-thumb">
                    <img src={fields.image} alt={fields.title} loading="lazy" />
                    <span className="arcade-record-scanline" aria-hidden="true" />
                  </div>
                )}
                {fields.subtitle && <small>{fields.subtitle}</small>}
                <h3>{fields.title}</h3>
                <DescriptionDisclosure description={fields.summary} />
                {(fields.tags.length > 0 || fields.links.length > 0) && (
                  <div className="arcade-record-bottom">
                    {fields.tags.length > 0 && (
                      <span>{fields.tags.join(' · ')}</span>
                    )}
                    {fields.links.map((link) => (
                      <a key={link.label || link.href} href={link.href}>
                        {link.label || 'Open'} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

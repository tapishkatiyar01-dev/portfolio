'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { arcadeSlideIn, arcadeTimelineMotion } from '../motionConfig';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

export default function CompactLayout({ items, dataType, itemType }) {
  const reduced = useReducedMotion();
  const isMinimal = isMinimalDataType(dataType);

  return (
    <section className="arcade-panel arcade-records">
      <div className="arcade-panel-label">
        <span>STAGE</span>
        <i aria-hidden="true" />
        <span>INVENTORY</span>
      </div>

      <div className={`arcade-compact${isMinimal ? ' arcade-compact-minimal' : ''}`}>
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              className="arcade-compact-slot"
              custom={index}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.05, margin: '0px 0px -12% 0px' }}
              variants={arcadeSlideIn}
              {...arcadeTimelineMotion(reduced)}
            >
              <span className="arcade-slot-index">{String(index + 1).padStart(2, '0')}</span>

              <div className="arcade-slot-body">
                {fields.image && (
                  <img
                    className="arcade-compact-thumb"
                    src={fields.image}
                    alt={fields.title}
                    loading="lazy"
                  />
                )}
                <h3>{fields.title}</h3>
                {fields.subtitle && <p>{fields.subtitle}</p>}
                <DescriptionDisclosure description={fields.summary} />
                {fields.tags.length > 0 && (
                  <small>{fields.tags.join(' · ')}</small>
                )}
              </div>

              {!isMinimal && fields.date && <time>{fields.date}</time>}

              {!isMinimal && fields.links.length > 0 && (
                <div className="arcade-slot-links">
                  {fields.links.map((link) => (
                    <a key={link.label || link.href} href={link.href}>
                      {link.label || 'Open'} ↗
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

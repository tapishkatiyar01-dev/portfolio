'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { arcadeCardMotion, arcadeStagger, arcadeStaggerItem, arcadeTimelineMotion } from '../motionConfig';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

export default function ListLayout({ items, dataType, itemType }) {
  const reduced = useReducedMotion();
  const isMinimal = isMinimalDataType(dataType);
  const listRef = useRef(null);
  const inView = useInView(listRef, { once: true, amount: 0.02, margin: '0px 0px -8% 0px' });

  return (
    <section className="arcade-panel arcade-records">
      <div className="arcade-panel-label">
        <span>STAGE</span>
        <i aria-hidden="true" />
        <span>HIGH SCORES</span>
      </div>

      <div className={`arcade-leaderboard${isMinimal ? ' arcade-leaderboard-minimal' : ''}`}>
        <div className="arcade-leaderboard-head" aria-hidden="true">
          <span>#</span>
          <span>Entry</span>
          <span>Details</span>
          {!isMinimal && <span>Period</span>}
          {!isMinimal && <span>Links</span>}
        </div>

        <motion.div
          ref={listRef}
          className="arcade-leaderboard-body"
          variants={arcadeStagger}
          initial={reduced ? false : 'hidden'}
          animate={reduced || inView ? 'visible' : 'hidden'}
        >
          {items.map((item, index) => {
            const fields = getRecordFields(item, dataType, itemType);

            return (
              <motion.article
                key={`${fields.title}-${index}`}
                className="arcade-leaderboard-row"
                variants={arcadeStaggerItem}
                {...arcadeTimelineMotion(reduced)}
              >
                <span className="arcade-rank">
                  {index === 0 ? '★' : String(index + 1).padStart(2, '0')}
                </span>

                <div className="arcade-leaderboard-title">
                  {fields.image && (
                    <img
                      className="arcade-list-thumb"
                      src={fields.image}
                      alt=""
                      loading="lazy"
                    />
                  )}
                  <strong>{fields.title}</strong>
                  {fields.subtitle && <small>{fields.subtitle}</small>}
                </div>

                <div className="arcade-leaderboard-detail">
                  <DescriptionDisclosure description={fields.summary} />
                  {fields.tags.length > 0 && (
                    <span className="arcade-leaderboard-tags">
                      {fields.tags.join(' · ')}
                    </span>
                  )}
                </div>

                {!isMinimal && fields.date && <time>{fields.date}</time>}

                {!isMinimal && fields.links.length > 0 && (
                  <div className="arcade-leaderboard-links">
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
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { arcadeCardMotion, arcadeStagger, arcadeStaggerItem } from '../motionConfig';
import { getRecordFields } from './layoutUtils';

export default function GridLayout({ items, dataType, itemType }) {
  const reduced = useReducedMotion();
  const gridRef = useRef(null);
  const inView = useInView(gridRef, { once: true, amount: 0.02, margin: '0px 0px -8% 0px' });

  return (
    <section className="arcade-panel arcade-records">
      <div className="arcade-panel-label">
        <span>STAGE</span>
        <i aria-hidden="true" />
        <span>CARTRIDGE VAULT</span>
      </div>

      <motion.div
        ref={gridRef}
        className="arcade-grid-cards"
        variants={arcadeStagger}
        initial={reduced ? false : 'hidden'}
        animate={reduced || inView ? 'visible' : 'hidden'}
      >
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              className="arcade-record-card"
              variants={arcadeStaggerItem}
              {...arcadeCardMotion(reduced)}
            >
              <div className="arcade-record-top">
                <span className="arcade-level-badge">LV {String(index + 1).padStart(2, '0')}</span>
                {fields.date && <time>{fields.date}</time>}
              </div>

              {fields.image && (
                <div className="arcade-record-thumb">
                  <img src={fields.image} alt={fields.title} loading="lazy" />
                  <span className="arcade-record-scanline" aria-hidden="true" />
                </div>
              )}

              {fields.subtitle && <small>{fields.subtitle}</small>}

              <h3>{fields.title}</h3>
              <DescriptionDisclosure description={fields.summary} />

              <div className="arcade-record-bottom">
                {fields.tags.length > 0 && (
                  <div className="arcade-tag-row">
                    {fields.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
                {fields.links.length > 0 && (
                  <div className="arcade-link-row">
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
      </motion.div>
    </section>
  );
}

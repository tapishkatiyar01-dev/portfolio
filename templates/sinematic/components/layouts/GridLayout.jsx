'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { sinematicCardMotion, sinematicPanelVariants, useSinematicReveal } from '../motionConfig';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

export default function GridLayout({ items, dataType, itemType, sectionName = '' }) {
  const { ref, isInView } = useSinematicReveal();
  const reduced = useReducedMotion();
  const isMinimal = isMinimalDataType(dataType);

  return (
    <motion.section
      ref={ref}
      className={`sinematic-panel sinematic-records${isMinimal ? ' data-minimal' : ''}`}
      initial={reduced ? false : 'hidden'}
      animate={reduced || isInView ? 'visible' : 'hidden'}
      variants={sinematicPanelVariants}
    >
      {sectionName && <div className="sinematic-panel-number">{sectionName}</div>}

      <div className="sinematic-grid">
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);

          return (
            <motion.article
              className="sinematic-card"
              key={`${fields.title}-${index}`}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.06, duration: 0.55 }}
              {...sinematicCardMotion(reduced)}
            >
              <div className="sinematic-card-top">
                <span>{String(index + 1).padStart(2, '0')}</span>
                {!isMinimal && fields.date && <time>{fields.date}</time>}
              </div>
              {fields.image && (
                <img src={fields.image} alt={fields.title} loading="lazy" />
              )}
              {!isMinimal && fields.subtitle && (
                <p className="sinematic-card-kind">{fields.subtitle}</p>
              )}
              <h3>{fields.title}</h3>
              <DescriptionDisclosure description={fields.summary} />
              <div className="sinematic-card-bottom">
                {fields.tags.length > 0 && <span>{fields.tags.join(' · ')}</span>}
                {fields.links.map((link) => (
                  <a key={link.label || link.href} href={link.href}>
                    {link.label || 'View'} ↗
                  </a>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

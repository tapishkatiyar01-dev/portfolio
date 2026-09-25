'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { sinematicCardMotion, sinematicPanelVariants, sinematicSlideIn, useSinematicReveal } from '../motionConfig';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

export default function TimelineLayout({ items, dataType, itemType, sectionName = '' }) {
  const { ref, isInView } = useSinematicReveal();
  const reduced = useReducedMotion();
  const isMinimal = isMinimalDataType(dataType);

  return (
    <motion.section
      ref={ref}
      className={`sinematic-panel sinematic-records sinematic-timeline-panel${isMinimal ? ' data-minimal' : ''}`}
      initial={reduced ? false : 'hidden'}
      animate={reduced || isInView ? 'visible' : 'hidden'}
      variants={sinematicPanelVariants}
    >
      {sectionName && <div className="sinematic-panel-number">{sectionName}</div>}

      <div className={`sinematic-timeline${isMinimal ? ' sinematic-timeline-minimal' : ''}`}>
        <div className="sinematic-timeline-track" aria-hidden="true" />

        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              className="sinematic-timeline-item"
              custom={index}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.2 }}
              variants={sinematicSlideIn}
            >
              <div className="sinematic-timeline-marker" aria-hidden="true">
                <span className="sinematic-timeline-mark" />
              </div>

              {!isMinimal && fields.date ? (
                <time className="sinematic-timeline-date">{fields.date}</time>
              ) : null}

              <motion.div
                className="sinematic-timeline-card"
                {...sinematicCardMotion(reduced)}
              >
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
              </motion.div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

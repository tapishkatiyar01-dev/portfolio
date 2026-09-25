'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { sinematicPanelVariants, sinematicSlideIn, useSinematicReveal } from '../motionConfig';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

export default function CompactLayout({ items, dataType, itemType, sectionName = '' }) {
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

      <div className="sinematic-compact-list">
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              custom={index}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.15 }}
              variants={sinematicSlideIn}
              whileHover={reduced ? undefined : { x: 8 }}
              whileTap={reduced ? undefined : { scale: 0.985, x: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{fields.title}</h3>
                {!isMinimal && fields.subtitle && <p>{fields.subtitle}</p>}
                <DescriptionDisclosure description={fields.summary} />
              </div>
              {!isMinimal && fields.date && <time>{fields.date}</time>}
              {fields.tags.length > 0 && <small>{fields.tags.join(' · ')}</small>}
              {fields.links.map((link) => (
                <a key={link.label || link.href} href={link.href}>
                  {link.label || 'View'} ↗
                </a>
              ))}
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

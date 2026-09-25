'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { sinematicPanelVariants, useSinematicReveal } from '../motionConfig';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

/**
 * Stickynote-style list rows:
 * optional thumb (only when image exists) + body stack.
 * Same structure for desktop/mobile, with or without image.
 */
export default function ListLayout({ items, dataType, itemType, sectionName = '' }) {
  const { ref, isInView } = useSinematicReveal();
  const reduced = useReducedMotion();
  const isMinimal = isMinimalDataType(dataType);
  const hasImages = !isMinimal && items.some((item) => getRecordFields(item, dataType, itemType).image);
  const tapMotion = reduced
    ? {}
    : { whileTap: { scale: 0.99 }, transition: { duration: 0.14 } };

  return (
    <motion.section
      ref={ref}
      className="sinematic-panel sinematic-records"
      initial={reduced ? false : 'hidden'}
      animate={reduced || isInView ? 'visible' : 'hidden'}
      variants={sinematicPanelVariants}
    >
      {sectionName && <div className="sinematic-panel-number">{sectionName}</div>}

      <div
        className={`sinematic-list data-${dataType}${isMinimal ? ' data-minimal' : ''}${hasImages ? ' has-images' : ' no-images'}`}
        data-data-type={dataType}
      >
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);
          const image = !isMinimal ? fields.image : '';

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              className={`sinematic-list-entry${image ? ' has-image' : ' no-image'}`}
              initial={reduced ? false : { opacity: 0, x: -12 }}
              whileInView={reduced ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ delay: index * 0.04, duration: 0.45 }}
              {...tapMotion}
            >
              {image ? (
                <img
                  className="sinematic-list-image"
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              ) : null}

              <div className="sinematic-list-body">
                <div className="sinematic-list-heading">
                  <h3>{fields.title}</h3>
                  {!isMinimal && fields.date ? <time>{fields.date}</time> : null}
                </div>

                {!isMinimal && fields.subtitle ? (
                  <p className="sinematic-list-subtitle">{fields.subtitle}</p>
                ) : null}

                {fields.summary ? (
                  <DescriptionDisclosure description={fields.summary} />
                ) : null}

                {fields.tags.length > 0 && (
                  <div className="sinematic-list-tags">
                    {fields.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                )}

                {!isMinimal && fields.links.length > 0 && (
                  <div className="sinematic-list-actions">
                    {fields.links.map((link) => (
                      <a
                        key={link.label || link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {link.label || 'View'} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

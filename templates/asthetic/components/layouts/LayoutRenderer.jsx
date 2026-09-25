'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import Badge from '@/templates/asthetic/components/ui/Badge';
import { usePaginatedSection } from '@/lib/usePaginatedSection';
import { aestheticSlideIn, aestheticTimelineMotion } from '../motionConfig';
import GridLayout from './GridLayout';
import LayoutFrame from './LayoutFrame';
import ListLayout from './ListLayout';
import TimelineLayout from './TimelineLayout';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

export default function LayoutRenderer({
  sectionData = { items: [], total: 0, hasMore: false },
  sectionId,
  layoutType,
  dataType,
  itemType = dataType,
  sectionName = '',
}) {
  const { items, total, hasMore, loading, fetchMore } = usePaginatedSection({
    sectionData,
    sectionId,
  });

  useEffect(() => {
    const onMore = () => {
      if (hasMore && !loading) fetchMore();
    };
    window.addEventListener('asthetic:more', onMore);
    return () => window.removeEventListener('asthetic:more', onMore);
  }, [hasMore, loading, fetchMore]);

  const shared = { items, dataType, itemType, sectionName };

  let layout;
  switch (layoutType) {
    case 'timeline':
      layout = <TimelineLayout {...shared} />;
      break;
    case 'grid':
      layout = <GridLayout {...shared} />;
      break;
    case 'list':
      layout = <ListLayout {...shared} />;
      break;
    case 'compact':
      layout = <CompactLayout {...shared} />;
      break;
    default:
      layout = <ListLayout {...shared} />;
  }

  return (
    <div>
      {layout}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '1.2rem' }}>
          <button
            type="button"
            className="aesthetic-mini-link"
            onClick={fetchMore}
            disabled={loading}
            style={{
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              border: '1px solid var(--a-brass)',
              background: 'transparent',
              color: 'var(--a-brass)',
              fontFamily: 'var(--a-sans)',
              fontSize: '0.75rem',
            }}
          >
            {loading ? 'Loading…' : `Show more · ${total - items.length} remaining`}
          </button>
        </div>
      )}
    </div>
  );
}

function CompactLayout({ items, dataType, itemType, sectionName }) {
  const reduced = useReducedMotion();
  const isMinimal = isMinimalDataType(dataType);

  return (
    <LayoutFrame title={sectionName || 'Records'}>
      <div className="aesthetic-compact-list">
        {items.map((item, index) => {
          const fields = getRecordFields(item, dataType, itemType);

          return (
            <motion.article
              key={`${fields.title}-${index}`}
              className="aesthetic-compact-row"
              custom={index}
              initial={reduced ? false : 'hidden'}
              whileInView={reduced ? undefined : 'visible'}
              viewport={{ once: true, amount: 0.15 }}
              variants={aestheticSlideIn}
              {...aestheticTimelineMotion(reduced)}
            >
              {fields.image && (
                <div className="aesthetic-compact-media">
                  <img
                    className="aesthetic-compact-image"
                    src={fields.image}
                    alt={fields.title}
                    loading="lazy"
                  />
                  <div className="aesthetic-avatar-scan" aria-hidden="true" />
                </div>
              )}

              <div className="aesthetic-compact-main">
                {fields.title && <h3>{fields.title}</h3>}
                {!isMinimal && fields.subtitle && (
                  <p className="aesthetic-card-subtitle">{fields.subtitle}</p>
                )}
                <DescriptionDisclosure
                  className="aesthetic-card-summary"
                  description={fields.summary}
                />
              </div>

              <div className="aesthetic-compact-meta">
                {!isMinimal && fields.date && <span>{fields.date}</span>}
                {fields.tags.length > 0 && (
                  <div className="aesthetic-tag-row">
                    {fields.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {!isMinimal && fields.links.length > 0 && (
                <div className="aesthetic-link-row aesthetic-compact-links">
                  {fields.links.map((link) => (
                    <a key={link.label} href={link.href} className="aesthetic-mini-link">
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </LayoutFrame>
  );
}

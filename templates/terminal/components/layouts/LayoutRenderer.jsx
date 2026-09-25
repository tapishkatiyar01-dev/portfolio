'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { usePaginatedSection } from '@/lib/usePaginatedSection';
import GridLayout from './GridLayout';
import ListLayout from './ListLayout';
import TimelineLayout from './TimelineLayout';
import { terminalWindowVariants, useTerminalWindowMotion } from '../motionConfig';
import { getRecordFields, isMinimalDataType } from './layoutUtils';

export default function LayoutRenderer({
  sectionData = { items: [], total: 0, hasMore: false },
  sectionId,
  layoutType,
  dataType,
  itemType = dataType,
}) {
  const { items, total, hasMore, loading, fetchMore } = usePaginatedSection({
    sectionData,
    sectionId,
  });

  const props = { items, dataType, itemType };

  let layout;
  switch (layoutType) {
    case 'timeline':
      layout = <TimelineLayout {...props} />;
      break;
    case 'grid':
      layout = <GridLayout {...props} />;
      break;
    case 'list':
      layout = <ListLayout {...props} />;
      break;
    case 'compact':
      layout = <CompactLayout {...props} />;
      break;
    default:
      layout = <ListLayout {...props} />;
  }

  return (
    <div>
      {layout}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            className="terminal-mini-link"
            onClick={fetchMore}
            disabled={loading}
            style={{ cursor: 'pointer', padding: '0.5rem 1rem', border: '1px solid var(--terminal-green-dim)', background: 'transparent', color: 'var(--terminal-green)', fontFamily: 'var(--terminal-mono)', fontSize: '0.72rem', textTransform: 'uppercase' }}
          >
            {loading ? '> loading...' : `> show more (${total - items.length} remaining)`}
          </button>
        </div>
      )}
    </div>
  );
}

function CompactLayout({ items, dataType, itemType }) {
  const { ref: windowRef, isInView } = useTerminalWindowMotion();
  const reduced = useReducedMotion();

  return (
    <motion.section
      className="terminal-window"
      variants={terminalWindowVariants}
      ref={windowRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="terminal-title-bar">
        <div className="terminal-dots"><span /><span /><span /></div>
        <div className="terminal-title">{dataType}.compact</div>
        <div className="terminal-actions">_ [] x</div>
      </div>

      <div className="terminal-content">
        <div className="terminal-compact-list">
          {items.map((item, index) => (
            <CompactRow
              key={`${getRecordFields(item, dataType, itemType).title}-${index}`}
              item={item}
              dataType={dataType}
              itemType={itemType}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function CompactRow({ item, dataType, itemType, reduced }) {
  const fields = getRecordFields(item, dataType, itemType);
  const isMinimal = isMinimalDataType(dataType);

  return (
    <motion.article
      className="terminal-compact-row"
      layout="position"
      whileHover={reduced ? undefined : { y: -3 }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
    >
      {fields.image && (
        <>
          <img className="terminal-avatar-image terminal-compact-image" src={fields.image} alt={fields.title} />
          <div className="terminal-avatar-scan" />
        </>
      )}

      <div>
        <h3>{fields.title}</h3>
        {!isMinimal && fields.subtitle && <p>{fields.subtitle}</p>}
      </div>

      <div className="terminal-compact-meta">
        {!isMinimal && fields.date && <span>{fields.date}</span>}
        <span>{fields.tags.join(' / ') || dataType}</span>
      </div>

      <DescriptionDisclosure description={fields.summary} />

      {fields.links.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fields.links.map((link) => (
            <a key={link.label} href={link.href} className="terminal-mini-link">
              &gt; {link.label}
            </a>
          ))}
        </div>
      )}
    </motion.article>
  );
}

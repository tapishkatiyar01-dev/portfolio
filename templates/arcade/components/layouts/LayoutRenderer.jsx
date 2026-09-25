'use client';

import { useEffect } from 'react';
import { usePaginatedSection } from '@/lib/usePaginatedSection';
import GridLayout from './GridLayout';
import TimelineLayout from './TimelineLayout';
import CompactLayout from './CompactLayout';
import ListLayout from './ListLayout';

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

  useEffect(() => {
    const onLives = () => {
      if (hasMore && !loading) fetchMore();
    };
    window.addEventListener('arcade:lives-up', onLives);
    return () => window.removeEventListener('arcade:lives-up', onLives);
  }, [hasMore, loading, fetchMore]);

  if (!items.length) {
    return (
      <section className="arcade-panel arcade-empty">
        <p className="arcade-kicker">No records unlocked</p>
        <p>This mission is ready for its next entry.</p>
      </section>
    );
  }

  const props = { items, dataType, itemType, layoutType };
  let layout = <GridLayout {...props} />;
  if (layoutType === 'timeline') layout = <TimelineLayout {...props} />;
  else if (layoutType === 'compact') layout = <CompactLayout {...props} />;
  else if (layoutType === 'list') layout = <ListLayout {...props} />;

  return (
    <div>
      {layout}
      {hasMore ? (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            className="arcade-button"
            onClick={fetchMore}
            disabled={loading}
          >
            {loading ? 'Loading…' : `Show more · ${total - items.length} remaining`}
          </button>
        </div>
      ) : null}
    </div>
  );
}

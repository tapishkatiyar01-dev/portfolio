'use client';

import { useEffect } from 'react';
import { usePaginatedSection } from '@/lib/usePaginatedSection';
import CompactLayout from './CompactLayout';
import GridLayout from './GridLayout';
import ListLayout from './ListLayout';
import TimelineLayout from './TimelineLayout';

export default function LayoutRenderer({
  sectionData = { items: [], total: 0, hasMore: false },
  sectionId,
  layoutType = 'grid',
  dataType = 'full',
}) {
  const { items, total, hasMore, loading, fetchMore } = usePaginatedSection({
    sectionData,
    sectionId,
  });

  useEffect(() => {
    const onMore = () => {
      if (hasMore && !loading) fetchMore();
    };
    window.addEventListener('stickynote:more', onMore);
    return () => window.removeEventListener('stickynote:more', onMore);
  }, [hasMore, loading, fetchMore]);

  if (!items.length) {
    return (
      <div className="stickynote-empty" role="status">
        No entries yet.
      </div>
    );
  }

  const props = { items, dataType };
  let layout;
  if (layoutType === 'timeline') layout = <TimelineLayout {...props} />;
  else if (layoutType === 'compact') layout = <CompactLayout {...props} />;
  else if (layoutType === 'list') layout = <ListLayout {...props} />;
  else layout = <GridLayout {...props} />;

  return (
    <div>
      {layout}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            type="button"
            className="stickynote-button button-yellow"
            onClick={fetchMore}
            disabled={loading}
          >
            {loading ? 'Loading…' : `Show more · ${total - items.length} remaining`}
          </button>
        </div>
      )}
    </div>
  );
}

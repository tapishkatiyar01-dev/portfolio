'use client';

import { useEffect } from 'react';
import { useHybridPaginatedSection } from '@/lib/usePaginatedSection';
import GridLayout from './GridLayout';
import TimelineLayout from './TimelineLayout';
import ListLayout from './ListLayout';
import CompactLayout from './CompactLayout';

export default function LayoutRenderer({
  sectionData = { items: [], total: 0, hasMore: false },
  sectionId,
  layoutType,
  dataType,
  itemType = dataType,
  sectionName = '',
}) {
  const {
    visibleItems,
    total,
    loading,
    allVisible,
    needsToggle,
    nextBatch,
    showMore,
    showLess,
  } = useHybridPaginatedSection({ sectionData, sectionId });

  useEffect(() => {
    const onRoll = () => {
      if (!allVisible && !loading) showMore();
    };
    window.addEventListener('sinematic:roll', onRoll);
    return () => window.removeEventListener('sinematic:roll', onRoll);
  }, [allVisible, loading, showMore]);

  const props = { items: visibleItems, dataType, itemType, sectionName };

  if (!visibleItems.length && total === 0) {
    return (
      <section className="sinematic-panel sinematic-empty">
        <p className="sinematic-kicker">Empty section</p>
      </section>
    );
  }

  let layout = <GridLayout {...props} />;
  if (layoutType === 'timeline') layout = <TimelineLayout {...props} />;
  else if (layoutType === 'compact') layout = <CompactLayout {...props} />;
  else if (layoutType === 'list') layout = <ListLayout {...props} />;

  return (
    <div className="sinematic-layout-stack">
      {layout}
      {needsToggle ? (
        <div className="sinematic-show-more-wrap">
          {allVisible ? (
            <button
              type="button"
              className="sinematic-button sinematic-show-more"
              onClick={showLess}
              aria-expanded="true"
            >
              Show less <span aria-hidden="true">−</span>
            </button>
          ) : (
            <button
              type="button"
              className="sinematic-button sinematic-show-more"
              onClick={showMore}
              disabled={loading}
              aria-expanded="false"
            >
              {loading ? 'Loading…' : `Show more · ${nextBatch} more`}{' '}
              <span aria-hidden="true">+</span>
            </button>
          )}
          <span className="sinematic-show-more-meta">
            Showing {visibleItems.length} of {total}
          </span>
        </div>
      ) : null}
    </div>
  );
}

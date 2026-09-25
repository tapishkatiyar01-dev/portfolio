'use client';

import { useEffect, useRef } from 'react';
import { useHybridPaginatedSection } from '@/lib/usePaginatedSection';
import {
  attachHoverLift,
  lightTap,
  refreshScroll,
  registerKineticGsap,
  useGSAP,
} from '../gsapSetup';
import CompactLayout from './CompactLayout';
import GridLayout from './GridLayout';
import ListLayout from './ListLayout';
import TimelineLayout from './TimelineLayout';

registerKineticGsap();

export default function LayoutRenderer({
  sectionData = { items: [], total: 0, hasMore: false },
  sectionId,
  layoutType,
  dataType,
  itemType = dataType,
}) {
  const moreRef = useRef(null);
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
    refreshScroll();
  }, [visibleItems.length]);

  useGSAP(
    (context, contextSafe) => {
      const btn = moreRef.current;
      if (!btn) return undefined;
      const detach = attachHoverLift(btn, { y: -4, scale: 1.03 });
      const onDown = contextSafe(() => lightTap());
      btn.addEventListener('pointerdown', onDown);
      return () => {
        detach();
        btn.removeEventListener('pointerdown', onDown);
      };
    },
    { dependencies: [needsToggle, allVisible], revertOnUpdate: true },
  );

  if (!visibleItems.length) {
    return (
      <div className="kinetic-empty">
        <p>This section has no records yet.</p>
      </div>
    );
  }

  const props = { items: visibleItems, dataType, itemType };
  let layout = <GridLayout {...props} />;
  if (layoutType === 'timeline') layout = <TimelineLayout {...props} />;
  else if (layoutType === 'compact') layout = <CompactLayout {...props} />;
  else if (layoutType === 'list') layout = <ListLayout {...props} />;

  return (
    <div>
      {layout}
      {needsToggle ? (
        <div className="kinetic-more">
          {allVisible ? (
            <button
              ref={moreRef}
              type="button"
              className="kinetic-btn"
              onClick={() => {
                showLess();
                refreshScroll();
              }}
              aria-expanded="true"
            >
              Show less
            </button>
          ) : (
            <button
              ref={moreRef}
              type="button"
              className="kinetic-btn"
              onClick={async () => {
                await showMore();
                refreshScroll();
              }}
              disabled={loading}
              aria-expanded="false"
            >
              {loading ? 'Loading…' : `Show more · ${nextBatch} more`}
            </button>
          )}
          <p className="kinetic-more-meta">
            Showing {visibleItems.length} of {total}
          </p>
        </div>
      ) : null}
    </div>
  );
}

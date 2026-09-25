'use client';

import { useEffect, useRef } from 'react';
import { usePaginatedSection } from '@/lib/usePaginatedSection';
import {
  attachHoverLift,
  lightTap,
  refreshScroll,
  registerStageGsap,
  useGSAP,
} from '../gsapSetup';
import CompactLayout from './CompactLayout';
import GridLayout from './GridLayout';
import ListLayout from './ListLayout';
import TimelineLayout from './TimelineLayout';

registerStageGsap();

export default function LayoutRenderer({
  sectionData = { items: [], total: 0, hasMore: false },
  sectionId,
  layoutType,
  dataType,
  itemType = dataType,
}) {
  const moreRef = useRef(null);
  const { items, total, hasMore, loading, fetchMore } = usePaginatedSection({
    sectionData,
    sectionId,
  });

  useEffect(() => {
    refreshScroll();
  }, [items.length]);

  useGSAP(
    (context, contextSafe) => {
      const btn = moreRef.current;
      if (!btn) return undefined;
      const detach = attachHoverLift(btn, { y: -4, scale: 1.03, duration: 0.18 });
      const onDown = contextSafe(() => lightTap());
      btn.addEventListener('pointerdown', onDown);
      return () => {
        detach();
        btn.removeEventListener('pointerdown', onDown);
      };
    },
    { dependencies: [hasMore, loading], revertOnUpdate: true },
  );

  if (!items.length) {
    return (
      <div className="kineticstage-empty">
        <p>This section has no records yet.</p>
      </div>
    );
  }

  const props = { items, dataType, itemType };
  let layout = <GridLayout {...props} />;
  if (layoutType === 'timeline') layout = <TimelineLayout {...props} />;
  else if (layoutType === 'compact') layout = <CompactLayout {...props} />;
  else if (layoutType === 'list') layout = <ListLayout {...props} />;

  return (
    <div>
      {layout}
      {hasMore ? (
        <div className="kineticstage-more">
          <button
            ref={moreRef}
            type="button"
            className="kineticstage-btn"
            onClick={async () => {
              await fetchMore();
              refreshScroll();
            }}
            disabled={loading}
            aria-expanded="false"
          >
            {loading
              ? 'Loading…'
              : `Show more · ${Math.max(0, total - items.length)} remaining`}
          </button>
          <p className="kineticstage-more-meta">
            Showing {items.length} of {total}
          </p>
        </div>
      ) : null}
    </div>
  );
}

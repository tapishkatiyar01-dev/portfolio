'use client';

import { useState, useCallback, useEffect } from 'react';

export const SERVER_PAGE_SIZE = 10;
export const CLIENT_REVEAL_START = 4;
export const CLIENT_REVEAL_STEP = 3;

function normalizeSectionData(sectionData) {
  if (!sectionData) return { items: [], total: 0, hasMore: false };
  if (Array.isArray(sectionData)) {
    return { items: sectionData, total: sectionData.length, hasMore: false };
  }
  return {
    items: sectionData.items || [],
    total: sectionData.total ?? (sectionData.items || []).length,
    hasMore: sectionData.hasMore ?? false,
  };
}

/**
 * Server-side pagination: show all loaded items; "Show more" fetches next page from API.
 */
export function usePaginatedSection({
  sectionData,
  initialItems,
  total: totalProp,
  hasMore: hasMoreProp,
  sectionId,
}) {
  const initial = sectionData
    ? normalizeSectionData(sectionData)
    : {
        items: initialItems || [],
        total: totalProp ?? (initialItems || []).length,
        hasMore: hasMoreProp ?? false,
      };

  const [items, setItems] = useState(initial.items);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [loading, setLoading] = useState(false);
  const total = initial.total;
  const seedKey = `${sectionId || ''}:${initial.total}:${initial.items.length}:${initial.hasMore ? 1 : 0}`;

  useEffect(() => {
    setItems(initial.items);
    setHasMore(initial.hasMore);
    setLoading(false);
  }, [seedKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore || !sectionId) return;
    setLoading(true);
    try {
      const page = Math.floor(items.length / SERVER_PAGE_SIZE) + 1;
      const res = await fetch(
        `/api/sections/${sectionId}/items?page=${page}&limit=${SERVER_PAGE_SIZE}`,
      );
      if (res.ok) {
        const data = await res.json();
        setItems((prev) => [...prev, ...(data.items || [])]);
        setHasMore(Boolean(data.hasMore));
      }
    } finally {
      setLoading(false);
    }
  }, [items.length, sectionId, loading, hasMore]);

  return { items, total, hasMore, loading, fetchMore };
}

/**
 * Hybrid pagination for premium + sinematic + kinetic:
 * - UI starts at CLIENT_REVEAL_START (6), reveals CLIENT_REVEAL_STEP (3) at a time
 * - When client runs out of loaded items, fetches next SERVER_PAGE_SIZE (10) from API
 * - When everything is shown, button becomes "Show less"
 */
export function useHybridPaginatedSection({
  sectionData,
  sectionId,
  revealStart = CLIENT_REVEAL_START,
  revealStep = CLIENT_REVEAL_STEP,
}) {
  const initial = normalizeSectionData(sectionData);
  const [items, setItems] = useState(initial.items);
  const [hasMore, setHasMore] = useState(initial.hasMore);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(
    Math.min(revealStart, initial.items.length || revealStart),
  );
  const total = initial.total;
  const seedKey = `${sectionId || ''}:${initial.total}:${initial.items.length}:${initial.hasMore ? 1 : 0}`;

  useEffect(() => {
    setItems(initial.items);
    setHasMore(initial.hasMore);
    setLoading(false);
    setVisibleCount(Math.min(revealStart, initial.items.length || revealStart));
  }, [seedKey, revealStart]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore || !sectionId) return items;
    setLoading(true);
    try {
      const page = Math.floor(items.length / SERVER_PAGE_SIZE) + 1;
      const res = await fetch(
        `/api/sections/${sectionId}/items?page=${page}&limit=${SERVER_PAGE_SIZE}`,
      );
      if (res.ok) {
        const data = await res.json();
        const nextItems = [...items, ...(data.items || [])];
        setItems(nextItems);
        setHasMore(Boolean(data.hasMore));
        return nextItems;
      }
    } finally {
      setLoading(false);
    }
    return items;
  }, [items, sectionId, loading, hasMore]);

  const showMore = useCallback(async () => {
    const nextVisible = visibleCount + revealStep;
    let loaded = items;
    if (nextVisible > loaded.length && hasMore) {
      loaded = await fetchMore();
    }
    setVisibleCount((v) => Math.min(v + revealStep, Math.max(loaded.length, total)));
  }, [visibleCount, items, hasMore, fetchMore, revealStep, total]);

  const showLess = useCallback(() => {
    setVisibleCount(Math.min(revealStart, items.length));
  }, [revealStart, items.length]);

  const visibleItems = items.slice(0, Math.min(visibleCount, items.length));
  const allVisible = visibleCount >= total && !hasMore;
  const needsToggle = total > revealStart;
  const remaining = Math.max(0, total - visibleItems.length);
  const nextBatch = Math.min(revealStep, remaining);

  return {
    items,
    visibleItems,
    total,
    hasMore,
    loading,
    allVisible,
    needsToggle,
    remaining,
    nextBatch,
    showMore,
    showLess,
  };
}

/**
 * Frontend-only reveal for fully loaded lists (skills).
 * No API fetch — used by scroll-view themes (premium, sinematic, kinetic).
 */
export function useClientRevealList(items = [], {
  revealStart = CLIENT_REVEAL_START,
  revealStep = CLIENT_REVEAL_STEP,
} = {}) {
  const list = Array.isArray(items) ? items : [];
  const total = list.length;
  const listKey = list
    .map((item) => (typeof item === 'string' ? item : item?.name) || '')
    .join('|');
  const [visibleCount, setVisibleCount] = useState(() => Math.min(revealStart, total));

  useEffect(() => {
    setVisibleCount(Math.min(revealStart, total));
  }, [listKey, total, revealStart]);

  const showMore = useCallback(() => {
    setVisibleCount((count) => Math.min(count + revealStep, total));
  }, [revealStep, total]);

  const showLess = useCallback(() => {
    setVisibleCount(Math.min(revealStart, total));
  }, [revealStart, total]);

  const visibleItems = list.slice(0, Math.min(visibleCount, total));
  const allVisible = total === 0 || visibleCount >= total;
  const needsToggle = total > revealStart;
  const nextBatch = Math.min(revealStep, Math.max(0, total - visibleItems.length));

  return {
    visibleItems,
    total,
    allVisible,
    needsToggle,
    nextBatch,
    showMore,
    showLess,
  };
}

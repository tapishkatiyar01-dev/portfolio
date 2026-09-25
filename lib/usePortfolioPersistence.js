'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getPersistedColorTheme,
  getPersistedSectionId,
  normalizeColorTheme,
  resolveSectionId,
  setPersistedColorTheme,
  setPersistedSectionId,
  setPersistedTemplate,
} from '@/lib/portfolioCookies';

/**
 * Persist light/dark color theme in cookies (SSR-friendly via initialValue).
 */
export function usePersistedColorTheme(template, {
  initialValue = null,
  fallback = 'light',
} = {}) {
  const [theme, setThemeState] = useState(() =>
    normalizeColorTheme(initialValue, fallback),
  );

  useEffect(() => {
    setPersistedTemplate(template);
    if (initialValue === 'light' || initialValue === 'dark') return;
    const saved = getPersistedColorTheme(template, fallback);
    setThemeState(saved);
  }, [template, fallback, initialValue]);

  const setTheme = useCallback(
    (next) => {
      const value = typeof next === 'function' ? next(theme) : next;
      const normalized = setPersistedColorTheme(template, value);
      setThemeState(normalized);
    },
    [template, theme],
  );

  useEffect(() => {
    setPersistedColorTheme(template, theme);
  }, [template, theme]);

  return [theme, setTheme];
}

/**
 * Persist active section / tab id in cookies.
 */
export function usePersistedSectionId(template, validIds, {
  initialValue = null,
  fallback = 'about',
} = {}) {
  const idsKey = validIds.join('|');
  const [sectionId, setSectionIdState] = useState(() =>
    resolveSectionId(initialValue, validIds, fallback),
  );

  useEffect(() => {
    setPersistedTemplate(template);
    const next = resolveSectionId(
      initialValue || getPersistedSectionId(template, validIds, fallback),
      validIds,
      fallback,
    );
    setSectionIdState(next);
  }, [template, idsKey, initialValue, fallback]); // eslint-disable-line react-hooks/exhaustive-deps

  const setSectionId = useCallback(
    (next) => {
      const value = typeof next === 'function' ? next(sectionId) : next;
      const resolved = resolveSectionId(value, validIds, fallback);
      setPersistedSectionId(template, resolved);
      setSectionIdState(resolved);
    },
    [template, validIds, fallback, sectionId],
  );

  useEffect(() => {
    if (sectionId) setPersistedSectionId(template, sectionId);
  }, [template, sectionId]);

  return [sectionId, setSectionId];
}

/**
 * For scroll-stack themes: remember the active section in a cookie (no jump on refresh).
 */
export function usePersistedSectionScroll(template, sectionIds, {
  initialValue = null,
  fallback = null,
} = {}) {
  const [sectionId, setSectionId] = usePersistedSectionId(template, sectionIds, {
    initialValue,
    fallback: fallback || sectionIds[0] || 'home',
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !sectionIds.length) return undefined;

    const nodes = sectionIds
      .map((id) => document.getElementById(id) || document.querySelector(`[data-scene="${id}"]`))
      .filter(Boolean);

    if (!nodes.length) return undefined;

    const ratios = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id || entry.target.getAttribute('data-scene');
          if (!id) return;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        if ((window.scrollY || document.documentElement.scrollTop || 0) <= 80) {
          if (sectionIds.includes('home')) {
            setSectionId('home');
          }
          return;
        }
        let bestId = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId && bestRatio >= 0.2) {
          setSectionId(bestId);
        }
      },
      { threshold: [0.2, 0.35, 0.5, 0.65], rootMargin: '-20% 0px -35% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [template, sectionIds, setSectionId]);

  return [sectionId, setSectionId];
}

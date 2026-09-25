'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Static film grain overlay — skipped on mobile / lite mode for scroll perf.
 */
export default function FilmGrain() {
  const reduced = useReducedMotion();
  const [lite, setLite] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)');
    const sync = () => setLite(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  if (reduced || lite) return null;

  return <div className="sinematic-film-grain" aria-hidden="true" />;
}

'use client';

import { useReducedMotion } from 'framer-motion';

export default function FilmGrain() {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return <div className="sinematic-film-grain" aria-hidden="true" />;
}

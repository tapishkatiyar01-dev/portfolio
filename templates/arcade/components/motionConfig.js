'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const arcadeEase = [0.16, 1, 0.3, 1];
export const arcadeSnap = [0.34, 1.45, 0.64, 1];

export const arcadeReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: arcadeEase },
  },
};

export const arcadeStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

export const arcadeStaggerItem = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: arcadeSnap },
  },
};

export const arcadeBlink = {
  animate: {
    opacity: [1, 1, 0.35, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: 'linear' },
  },
};

export const arcadeFloat = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
  },
};

export const arcadeCoinSpin = {
  animate: {
    rotateY: [0, 360],
    transition: { duration: 2.4, repeat: Infinity, ease: 'linear' },
  },
};

export const arcadePixelPop = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 420, damping: 22 },
  },
};

export const arcadeSlideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: (index = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: Math.min(index, 5) * 0.05, duration: 0.45, ease: arcadeEase },
  }),
};

export function arcadeCardMotion(reduced) {
  if (reduced) return {};
  return {
    whileHover: { y: -8 },
    whileTap: { scale: 0.98, y: -4 },
    transition: { duration: 0.14, ease: arcadeSnap },
  };
}

export function arcadeTimelineMotion(reduced) {
  if (reduced) return {};
  return {
    whileTap: { scale: 0.99, x: 4 },
    transition: { duration: 0.12, ease: arcadeSnap },
  };
}

export function arcadePressMotion(reduced) {
  if (reduced) return {};
  return {
    whileHover: { scale: 1.03, y: -2 },
    whileTap: { scale: 0.96 },
    transition: { duration: 0.1, ease: arcadeSnap },
  };
}

export const arcadeCardHover = {
  rest: { y: 0, boxShadow: '6px 6px 0 var(--arcade-shadow)' },
  hover: {
    y: -8,
    boxShadow: '10px 10px 0 var(--arcade-shadow-hover)',
    transition: { duration: 0.2, ease: arcadeSnap },
  },
};

export function useArcadeReveal(amount = 0.15) {
  const ref = useRef(null);
  return { ref, isInView: useInView(ref, { amount, once: false }) };
}

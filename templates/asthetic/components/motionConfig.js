'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const aestheticEase = [0.165, 0.84, 0.44, 1];

export const AestheticWindowVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: aestheticEase,
    },
  },
};

export const aestheticStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

export const aestheticStaggerItem = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: aestheticEase },
  },
};

export const aestheticSlideIn = {
  hidden: { opacity: 0, x: -12 },
  visible: (index = 0) => ({
    opacity: 1,
    x: 0,
    transition: { delay: Math.min(index, 5) * 0.05, duration: 0.45, ease: aestheticEase },
  }),
};

export function aestheticCardMotion(reduced) {
  if (reduced) return {};
  return {
    whileHover: { y: -4 },
    whileTap: { scale: 0.985, y: -1 },
    transition: { duration: 0.16, ease: aestheticEase },
  };
}

export function aestheticTimelineMotion(reduced) {
  if (reduced) return {};
  return {
    whileHover: { x: 3 },
    whileTap: { scale: 0.99, x: 5 },
    transition: { duration: 0.14, ease: aestheticEase },
  };
}

export function aestheticPressMotion(reduced) {
  if (reduced) return {};
  return {
    whileHover: { y: -3 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.12, ease: aestheticEase },
  };
}

const AestheticWindowViewport = {
  once: true,
  amount: 0.01,
  margin: '0px 0px -20% 0px',
};

export function useAestheticWindowMotion() {
  const ref = useRef(null);
  const isInView = useInView(ref, AestheticWindowViewport);

  return { ref, isInView };
}

export const sectionVariants = AestheticWindowVariants;
export const useAestheticMotion = useAestheticWindowMotion;

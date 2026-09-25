'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const premiumWindowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
  },
};

export const premiumItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: Math.min(index * 0.05, 0.28),
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export const premiumShellVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05 },
  },
};

export const premiumNavItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.26, ease: [0.16, 1, 0.3, 1] } },
};

export function usePremiumInView(amount = 0.16) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount, initial: true, once: true });
  return { ref, isInView };
}

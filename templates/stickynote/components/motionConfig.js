import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const stickyReveal = {
  hidden: { opacity: 0, y: 22, rotate: -0.6 },
  visible: { opacity: 1, y: 0, rotate: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

export const stickyItemReveal = {
  hidden: { opacity: 0, y: 18, rotate: -1.2, scale: 0.985 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    rotate: index % 2 ? 0.45 : -0.35,
    scale: 1,
    transition: { delay: Math.min(index * 0.07, 0.42), duration: 0.48, ease: [0.165, 0.84, 0.44, 1] },
  }),
};

export const paperDrop = {
  resting: { opacity: 1, y: 0, rotate: 0, scale: 1 },
  dropped: { opacity: 0, y: 180, rotate: 8, scale: 0.92 },
};

export function useStickyInView(amount = 0.12) {
  const ref = useRef(null);
  return { ref, isInView: useInView(ref, { once: true, amount }) };
}

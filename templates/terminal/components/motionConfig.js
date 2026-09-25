'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const terminalWindowVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: [0.165, 0.84, 0.44, 1],
    },
  },
};

const terminalWindowViewport = {
  once: true,
  amount: 0.01,
  margin: '0px 0px -20% 0px',
};

export function useTerminalWindowMotion() {
  const ref = useRef(null);
  const isInView = useInView(ref, terminalWindowViewport);

  return { ref, isInView };
}

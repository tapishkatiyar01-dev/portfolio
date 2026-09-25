'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function TerminalCursor({ className = '' }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.span
      aria-hidden="true"
      className={`terminal-cursor ${className}`}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [1, 0, 1] }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.8, ease: 'linear', repeat: Infinity }
      }
    />
  );
}

'use client';

import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 100,
        height: 2,
        originX: 0,
        scaleX: scrollYProgress,
        backgroundColor: 'var(--terminal-green)',
        boxShadow: '0 0 0.65rem var(--terminal-shadow)',
        pointerEvents: 'none',
      }}
    />
  );
}

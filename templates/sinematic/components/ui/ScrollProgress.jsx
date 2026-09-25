'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Lighter spring — less overshoot work per scroll frame
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 32, restDelta: 0.001 });
  return <motion.div className="sinematic-progress" style={{ scaleX }} aria-hidden="true" />;
}

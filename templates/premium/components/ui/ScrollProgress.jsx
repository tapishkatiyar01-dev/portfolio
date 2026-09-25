'use client';

import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return <motion.div aria-hidden="true" className="premium-scroll-progress" style={{ scaleX: scrollYProgress }} />;
}

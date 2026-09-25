'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { AestheticWindowVariants, useAestheticWindowMotion } from '../motionConfig';

export default function LayoutFrame({ title, children, className = '' }) {
  const { ref, isInView } = useAestheticWindowMotion();
  const reduced = useReducedMotion();

  return (
    <motion.section
      className={`aesthetic-window aesthetic-layout-window ${className}`.trim()}
      variants={AestheticWindowVariants}
      ref={ref}
      initial={reduced ? false : 'hidden'}
      animate={reduced ? undefined : (isInView ? 'visible' : 'hidden')}
    >
      {title && (
        <div className="aesthetic-title-bar">
          <span className="aesthetic-title-mark" aria-hidden="true" />
          <div className="aesthetic-title">{title}</div>
          <span className="aesthetic-title-rule" aria-hidden="true" />
        </div>
      )}
      <div className="aesthetic-content">{children}</div>
    </motion.section>
  );
}

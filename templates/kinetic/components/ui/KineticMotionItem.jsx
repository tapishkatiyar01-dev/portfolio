'use client';

import { useRef } from 'react';
import { lightTap } from '../gsapSetup';

/**
 * High-performance hardware-accelerated wrapper for section items.
 * Uses GPU-composited CSS transforms for hover lift and attaches light haptic tap on press.
 */
export default function KineticMotionItem({
  as: Tag = 'article',
  className = '',
  children,
  lift,
  scale,
  ...rest
}) {
  const ref = useRef(null);

  const handlePointerDown = () => {
    lightTap();
    const el = ref.current;
    if (el) el.classList.add('is-pressed');
  };

  const handlePointerUp = () => {
    const el = ref.current;
    if (el) el.classList.remove('is-pressed');
  };

  return (
    <Tag
      ref={ref}
      className={className}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      {...rest}
    >
      {children}
    </Tag>
  );
}

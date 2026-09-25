'use client';

import { useEffect, useRef } from 'react';
import { attachPressInvert, lightTap } from '../gsapSetup';

/** Wraps children and applies acid invert on pointer press (mouse + touch). */
export default function PressInvert({ className = '', as: Tag = 'div', children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const detach = attachPressInvert(node);
    const onDown = () => lightTap();
    node.addEventListener('pointerdown', onDown);
    return () => {
      detach();
      node.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <Tag ref={ref} className={`kinetic-invert ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

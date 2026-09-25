'use client';

import { motion, useReducedMotion } from 'framer-motion';

const STARS = [
  { x: '8%', y: '12%', size: 3, delay: 0 },
  { x: '22%', y: '28%', size: 2, delay: 0.4 },
  { x: '78%', y: '18%', size: 4, delay: 0.2 },
  { x: '92%', y: '42%', size: 2, delay: 0.6 },
  { x: '65%', y: '8%', size: 3, delay: 0.8 },
  { x: '45%', y: '22%', size: 2, delay: 1 },
  { x: '15%', y: '55%', size: 3, delay: 0.3 },
  { x: '88%', y: '72%', size: 2, delay: 0.5 },
];

export default function PixelStars() {
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <div className="arcade-stars" aria-hidden="true">
      {STARS.map((star, index) => (
        <motion.span
          key={index}
          className="arcade-star"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{
            duration: 1.8 + star.delay,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScoreBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26 });
  const [flash, setFlash] = useState(false);
  const [label, setLabel] = useState('');

  useEffect(() => {
    let timer;
    const onOk = (event) => {
      setFlash(true);
      setLabel(event.detail || 'CODE OK');
      clearTimeout(timer);
      timer = setTimeout(() => {
        setFlash(false);
        setLabel('');
      }, 900);
    };
    window.addEventListener('arcade:code-ok', onOk);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('arcade:code-ok', onOk);
    };
  }, []);

  return (
    <>
      <motion.div
        className={`arcade-score-bar${flash ? ' is-flash' : ''}`}
        style={{ scaleX }}
        aria-hidden="true"
      />
      {flash && label ? (
        <div className="arcade-code-toast" role="status" aria-live="polite">
          {label}
        </div>
      ) : null}
    </>
  );
}

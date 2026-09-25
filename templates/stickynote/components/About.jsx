'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { stickyReveal, useStickyInView } from './motionConfig';

const aboutNoteMotion = {
  hidden: { opacity: 0, y: 24, rotate: -1.5, scale: .98 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    rotate: index ? .8 : -.6,
    scale: 1,
    transition: { delay: index * .12, duration: .6, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function About({ personal }) {
  const { ref, isInView } = useStickyInView();
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      ref={ref}
      id="about"
      className="stickynote-lower-grid"
      variants={stickyReveal}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion || isInView ? 'visible' : 'hidden'}
    >
      <motion.article className="stickynote-note stickynote-note-yellow lower-about" variants={aboutNoteMotion} custom={0} whileHover={reduceMotion ? undefined : { y: -5, rotate: -.9 }} whileTap={reduceMotion ? undefined : { scale: .985 }} transition={{ duration: .2 }}>
        <h2>About me</h2>
        <p>{personal?.description || personal?.summary}</p>
        {personal?.location && <p className="stickynote-meta">⌖ {personal.location}</p>}
        {personal?.email && <p className="stickynote-meta">✉ {personal.email}</p>}
      </motion.article>
      <motion.article className="stickynote-note stickynote-note-lime lower-summary" variants={aboutNoteMotion} custom={1} whileHover={reduceMotion ? undefined : { y: -5, rotate: 1 }} whileTap={reduceMotion ? undefined : { scale: .985 }} transition={{ duration: .2 }}>
        <h2>{personal?.designation || 'Profile'}</h2>
        <p>{personal?.summary}</p>
        {personal?.traits?.length > 0 && (
          <div className="stickynote-chip-list">
            {personal.traits.map((trait) => <span key={trait}>{trait}</span>)}
          </div>
        )}
      </motion.article>
    </motion.section>
  );
}

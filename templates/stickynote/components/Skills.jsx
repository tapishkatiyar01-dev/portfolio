'use client';

import { motion } from 'framer-motion';
import { stickyReveal, useStickyInView } from './motionConfig';

export default function Skills({ skills = [] }) {
  const { ref, isInView } = useStickyInView();

  return (
    <motion.section
      ref={ref}
      id="skills"
      className="stickynote-note stickynote-note-lime stickynote-skills"
      variants={stickyReveal}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <h2>Skills</h2>
      <div className="stickynote-skill-groups">
        <div>
          <h3>Toolkit</h3>
          <div className="stickynote-chip-list">
            {skills.map((skill, index) => {
              const label = typeof skill === 'string'
                ? skill
                : `${skill.name}${skill.level ? ` · ${skill.level}` : ''}`;
              return <motion.span key={`${label}-${index}`} whileHover={{ y: -3, rotate: index % 2 ? 1 : -1 }} transition={{ duration: .15 }}>{label}</motion.span>;
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

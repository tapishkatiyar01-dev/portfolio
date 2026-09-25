'use client';

import { motion, useReducedMotion } from 'framer-motion';
import LayoutFrame from './layouts/LayoutFrame';
import { aestheticPressMotion, aestheticStagger, aestheticStaggerItem } from './motionConfig';

export default function Skills({ skills }) {
  const skillItems = Array.isArray(skills) ? skills : [];
  const reduced = useReducedMotion();

  return (
    <LayoutFrame title="Skills">
      <motion.div
        className="aesthetic-skill-grid"
        variants={aestheticStagger}
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'visible'}
        viewport={{ once: true, amount: 0.1 }}
      >
        {skillItems.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="aesthetic-skill-cell"
            variants={aestheticStaggerItem}
            {...aestheticPressMotion(reduced)}
          >
            <span className="aesthetic-skill-icon">{skill.name.slice(0, 2)}</span>
            <span className="aesthetic-skill-name">{skill.name}</span>
            {skill.level && <span className="aesthetic-skill-level">{skill.level}</span>}
          </motion.div>
        ))}
      </motion.div>
    </LayoutFrame>
  );
}

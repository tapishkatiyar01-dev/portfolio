'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { sinematicCardMotion } from './motionConfig';

export default function Skills({ skills = [] }) {
  const reduced = useReducedMotion();

  return (
    <section className="sinematic-panel sinematic-skills">
      <div className="sinematic-panel-number">Props</div>

      <div className="sinematic-skills-head">
        <p className="sinematic-kicker">Skills</p>
        <h2>
          Core <em>instruments</em>
        </h2>
      </div>

      <div className="sinematic-skill-grid">
        {skills.map((skill, index) => (
          <motion.div
            className="sinematic-skill"
            key={skill.name || index}
            {...sinematicCardMotion(reduced)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{skill.name}</strong>
            {skill.level && <small>{skill.level}</small>}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

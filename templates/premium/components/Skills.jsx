'use client';

import { motion } from 'framer-motion';
import { premiumItemVariants, premiumWindowVariants, usePremiumInView } from './motionConfig';

export default function Skills({ skills = [] }) {
  const { ref, isInView } = usePremiumInView();
  return (
    <motion.section id="skills" ref={ref} className="premium-section premium-skills-card" variants={premiumWindowVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      <div className="premium-section-heading">
        <div>
          <span className="premium-eyebrow">Toolkit</span>
          <h2>Skills</h2>
        </div>
        <p>Materials and instruments used to ship reliable work.</p>
      </div>
      <div className="premium-skills-grid">
        {skills.map((skill, index) => (
          <motion.div
            className="premium-skill"
            key={skill.name || index}
            custom={index}
            variants={premiumItemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.16, ease: [0.165, 0.84, 0.44, 1] }}
          >
            {typeof skill === 'string' ? (
              <>
                <strong>{skill}</strong>
                <span>Ready</span>
              </>
            ) : (
              <>
                <strong>{skill.name}</strong>
                <span>{skill.level}</span>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { premiumItemVariants, usePremiumInView } from './motionConfig';

export default function About({ personal }) {
  const { ref, isInView } = usePremiumInView();
  const traits = personal?.traits || [];
  return (
    <motion.section id="about" ref={ref} className="premium-section premium-about-grid" initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      <motion.div className="premium-about-card" variants={premiumItemVariants} custom={0} whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: [0.165, 0.84, 0.44, 1] }}>
        <span className="premium-eyebrow">{personal?.aboutKicker || 'About the practice'}</span>
        <h2>{personal?.name}</h2>
        <p>{personal?.description || personal?.summary}</p>
        <div className="premium-traits">
          {traits.map((trait) => (
            <span className="premium-trait" key={trait}>
              {trait}
            </span>
          ))}
        </div>
      </motion.div>
      <motion.div className="premium-about-card" variants={premiumItemVariants} custom={1} whileHover={{ y: -3 }} transition={{ duration: 0.2, ease: [0.165, 0.84, 0.44, 1] }}>
        <span className="premium-eyebrow">Profile plate</span>
        <p>{personal?.summary}</p>
        {personal?.location ? <p>{personal.location}</p> : null}
      </motion.div>
    </motion.section>
  );
}

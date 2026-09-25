'use client';

import { motion } from 'framer-motion';
import { terminalWindowVariants, useTerminalWindowMotion } from './motionConfig';

export default function Skills({ skills }) {
  const skillItems = Array.isArray(skills) ? skills : [];
  const { ref: windowRef, isInView } = useTerminalWindowMotion();

  return (
    <motion.section
      className="terminal-window"
      variants={terminalWindowVariants}
      ref={windowRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="terminal-title-bar">
        <div className="terminal-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="terminal-title">skills.dat</div>
        <div className="terminal-actions">_ [] x</div>
      </div>
      <div className="terminal-content">
        <div className="terminal-skill-grid">
          {skillItems.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="terminal-skill-cell"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, delay: index * 0.04, ease: [0.165, 0.84, 0.44, 1] }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="terminal-skill-icon">{skill.name.slice(0, 2)}</span>
              <span className="terminal-skill-name terminal-green">{skill.name}</span>
              <span className="terminal-skill-level text-xs text-zinc-400">{skill.level || ''}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

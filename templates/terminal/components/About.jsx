'use client';

import { motion } from 'framer-motion';
import DateString from './DateString';
import { terminalWindowVariants, useTerminalWindowMotion } from './motionConfig';

const profileRows = (personal) => [
  ['login', personal.name],
  ['role', personal.designation],
  ['directory', personal.location],
  ['mail', personal.email],
];

const aboutEase = [0.165, 0.84, 0.44, 1];

export default function About({ personal }) {
  const imageToUse = personal.Logo || personal.Avatar;
  const { ref: windowRef, isInView } = useTerminalWindowMotion();

  return (
    <motion.section
      className="terminal-window terminal-window-compact"
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
        <div className="terminal-title">about.txt</div>
        <div className="terminal-actions">_ [] x</div>
      </div>

      <div className="terminal-content">
        <div className="terminal-about-grid">
          <motion.div
            className="terminal-about-visual"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, ease: aboutEase }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="terminal-about-avatar">
              {imageToUse ? (
                <>
                  <img className="terminal-avatar-image" src={imageToUse} alt={`${personal.name} profile`} />
                  <div className="terminal-avatar-scan" />
                </>
              ) : (
                <div className="terminal-avatar-symbol">
                  <span>()</span>
                  <span>/|\</span>
                </div>
              )}
            </div>
            <div className="terminal-about-status">
              <span>$ whoami</span>
              <span>active</span>
            </div>
          </motion.div>

          <motion.div
            className="terminal-about-body"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.05, ease: aboutEase }}
          >
            <div>
              <p className="terminal-about-kicker">{personal.aboutKicker || personal.designation}</p>
              <h2>{personal.name}</h2>
              <p className="terminal-about-copy">{personal.description || personal.summary}</p>
            </div>

            <div className="terminal-about-meta">
              {profileRows(personal).map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.12 + index * 0.04, ease: aboutEase }}
                >
                  <span>{label}</span>
                  <strong>{value}</strong>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.28, ease: aboutEase }}
              >
                <span>login_time</span>
                <strong><DateString /></strong>
              </motion.div>
            </div>

            <div className="terminal-about-traits">
              {(personal.traits || []).map((trait, index) => (
                <motion.span
                  key={trait}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18, delay: 0.18 + index * 0.04, ease: aboutEase }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {trait}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

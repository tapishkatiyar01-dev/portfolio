'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  arcadeReveal,
  arcadeStagger,
  arcadeStaggerItem,
  useArcadeReveal,
} from './motionConfig';

function getInitials(name) {
  return name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || '??';
}

export default function About({ personal }) {
  const { ref, isInView } = useArcadeReveal();
  const reduced = useReducedMotion();
  const image = personal?.Logo || personal?.Avatar;
  const kicker = personal?.aboutKicker || personal?.designation || '';
  const copy = personal?.description || personal?.summary || '';

  const rows = [
    ['Player', personal?.name],
    ['Class', personal?.designation],
    ['Zone', personal?.location],
    ['Comms', personal?.email],
  ].filter(([, value]) => value);

  return (
    <motion.section
      ref={ref}
      className="arcade-panel arcade-about"
      variants={arcadeReveal}
      initial={reduced ? false : 'hidden'}
      animate={reduced || isInView ? 'visible' : 'hidden'}
    >
      <div className="arcade-panel-label">
        <span>STAGE 02</span>
        <i aria-hidden="true" />
        <span>CHARACTER SELECT</span>
      </div>

      <div className="arcade-about-grid">
        <motion.div
          className="arcade-about-select"
          variants={arcadeStagger}
          initial={reduced ? false : 'hidden'}
          animate={reduced || isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="arcade-about-card" variants={arcadeStaggerItem}>
            <div className="arcade-about-card-screen">
              {image ? (
                <img src={image} alt={`${personal?.name || 'Profile'} portrait`} />
              ) : (
                <span>{getInitials(personal?.name)}</span>
              )}
            </div>
            <b>ACTIVE</b>
            <motion.span
              className="arcade-select-cursor"
              aria-hidden="true"
              animate={reduced ? undefined : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              ▶
            </motion.span>
          </motion.div>

          <div className="arcade-stat-bars" aria-label="Character stats">
            {['PWR', 'SPD', 'SKL'].map((label, barIndex) => (
              <div key={label} className="arcade-stat-bar">
                <span>{label}</span>
                <div className="arcade-stat-bar-track">
                  <motion.i
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={reduced || isInView ? { scaleX: 0.55 + barIndex * 0.15 } : { scaleX: 0 }}
                    transition={{ delay: 0.3 + barIndex * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="arcade-about-detail"
          variants={arcadeStagger}
          initial={reduced ? false : 'hidden'}
          animate={reduced || isInView ? 'visible' : 'hidden'}
        >
          {kicker && (
            <motion.p className="arcade-kicker" variants={arcadeStaggerItem}>
              {kicker}
            </motion.p>
          )}

          {personal?.name && (
            <motion.h2 variants={arcadeStaggerItem}>
              {personal.name}
              {personal?.designation && (
                <>
                  {' '}
                  <em>{personal.designation}</em>
                </>
              )}
            </motion.h2>
          )}

          {copy && (
            <motion.p className="arcade-copy" variants={arcadeStaggerItem}>
              {copy}
            </motion.p>
          )}

          {rows.length > 0 && (
            <motion.dl className="arcade-record" variants={arcadeStaggerItem}>
              {rows.map(([label, value], rowIndex) => (
                <motion.div
                  key={label}
                  custom={rowIndex}
                  initial={reduced ? false : { opacity: 0, x: -12 }}
                  animate={reduced || isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                  transition={{ delay: 0.2 + rowIndex * 0.06 }}
                >
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </motion.div>
              ))}
            </motion.dl>
          )}

          {personal?.traits?.length > 0 && (
            <motion.div className="arcade-chips" variants={arcadeStaggerItem}>
              {personal.traits.map((trait, traitIndex) => (
                <motion.span
                  key={trait}
                  initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                  animate={reduced || isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ delay: 0.35 + traitIndex * 0.05, type: 'spring', stiffness: 400, damping: 20 }}
                  whileHover={reduced ? undefined : { y: -3, boxShadow: '4px 4px 0 var(--arcade-cyan)' }}
                >
                  {trait}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}

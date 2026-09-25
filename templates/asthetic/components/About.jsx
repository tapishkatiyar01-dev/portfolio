'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  aestheticEase,
  aestheticStagger,
  aestheticStaggerItem,
  AestheticWindowVariants,
  useAestheticWindowMotion,
} from './motionConfig';

const profileRows = (personal) => [
  ['Name', personal?.name],
  ['Role', personal?.designation],
  ['Location', personal?.location],
  ['Email', personal?.email],
].filter(([, value]) => value);

const getInitials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase();

export default function About({ personal }) {
  const imageToUse = personal?.Logo || personal?.Avatar;
  const rows = profileRows(personal);
  const initials = getInitials(personal?.name);
  const kicker = personal?.aboutKicker || personal?.designation || '';
  const copy = personal?.description || personal?.summary || '';
  const { ref: windowRef, isInView } = useAestheticWindowMotion();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="aesthetic-window aesthetic-window-compact aesthetic-about-window"
      variants={AestheticWindowVariants}
      ref={windowRef}
      initial={prefersReducedMotion ? false : 'hidden'}
      animate={prefersReducedMotion ? undefined : (isInView ? 'visible' : 'hidden')}
      aria-labelledby="aesthetic-about-title"
    >
      <div className="aesthetic-about-overlay" aria-hidden="true" />
      <div className="aesthetic-content">
        <div className="aesthetic-about-shell">
          <motion.aside
            className="aesthetic-about-identity"
            variants={aestheticStagger}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion || isInView ? 'visible' : 'hidden'}
            whileHover={prefersReducedMotion ? undefined : { y: -4 }}
          >
            <motion.div className="aesthetic-about-identity-top" variants={aestheticStaggerItem}>
              <span className="aesthetic-about-mark" aria-hidden="true">/</span>
              {personal?.availability && (
                <span className="aesthetic-about-availability">{personal.availability}</span>
              )}
            </motion.div>

            <motion.div className="aesthetic-about-avatar" variants={aestheticStaggerItem}>
              {imageToUse ? (
                <img className="aesthetic-avatar-image" src={imageToUse} alt={`${personal?.name || 'Profile'} portrait`} />
              ) : (
                <span className="aesthetic-about-initials" aria-hidden="true">{initials}</span>
              )}
            </motion.div>

            <motion.div className="aesthetic-about-identity-footer" variants={aestheticStaggerItem}>
              {personal?.name && <span>{personal.name}</span>}
              {personal?.location && <span>{personal.location}</span>}
            </motion.div>
          </motion.aside>

          <motion.div
            className="aesthetic-about-content"
            variants={aestheticStagger}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion || isInView ? 'visible' : 'hidden'}
          >
            <motion.div className="aesthetic-about-intro" variants={aestheticStaggerItem}>
              {kicker && <p className="aesthetic-about-kicker">{kicker}</p>}
              {personal?.name && (
                <h2 id="aesthetic-about-title">
                  About {personal.name}
                </h2>
              )}
              {copy && <p className="aesthetic-about-copy">{copy}</p>}
            </motion.div>

            {rows.length > 0 && (
              <motion.dl className="aesthetic-about-record" variants={aestheticStaggerItem}>
                {rows.map(([label, value], index) => (
                  <motion.div
                    key={label}
                    initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={prefersReducedMotion || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ delay: 0.1 + index * 0.05, duration: 0.4, ease: aestheticEase }}
                  >
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </motion.div>
                ))}
              </motion.dl>
            )}

            {personal?.traits?.length > 0 && (
              <motion.div className="aesthetic-about-traits" variants={aestheticStaggerItem}>
                {personal.traits.map((trait, index) => (
                  <motion.span
                    key={trait}
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
                    animate={prefersReducedMotion || isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                    transition={{ delay: 0.15 + index * 0.04, duration: 0.35, ease: aestheticEase }}
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  >
                    {trait}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

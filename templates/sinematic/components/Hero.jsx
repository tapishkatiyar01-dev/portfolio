'use client';

import { motion, useReducedMotion } from 'framer-motion';
import CinematicScene from './cinematic/CinematicScene';
import {
  sinematicPressMotion,
  sinematicStagger,
  sinematicStaggerItem,
  useSinematicScene,
} from './motionConfig';

/**
 * Scene 0 — Opening title card. Scroll pushes it back into the reel.
 * Mobile: portrait becomes a full-bleed plate; name stays the brand hero.
 */
export default function Hero({
  name,
  designation,
  summary,
  resume,
  logo,
  avatar,
}) {
  const prefersReducedMotion = useReducedMotion();
  const { selectNav } = useSinematicScene();
  const press = sinematicPressMotion(prefersReducedMotion);
  const first = name?.split(/\s+/)[0] || name || '';
  const image = avatar || logo;
  const monogram = name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2) || '—';

  return (
    <CinematicScene
      id="home"
      index={0}
      label="Home"
      recipe="heroExit"
      anchor={false}
    >
      <section className="sinematic-hero">
        <div className="sinematic-hero-grid">
          <motion.div
            className="sinematic-hero-copy"
            variants={sinematicStagger}
            initial={prefersReducedMotion ? false : 'hidden'}
            animate={prefersReducedMotion ? undefined : 'visible'}
          >
            <motion.p className="sinematic-hero-slate" variants={sinematicStaggerItem}>
              Scene 01 · Title card
            </motion.p>

            <motion.h1 variants={sinematicStaggerItem}>
              <span className="sn-hero-tag">{'<'}</span>
              {' '}
              <span className="sn-hero-name">{first}</span>
              {' '}
              <span className="sn-hero-tag">{'/>'}</span>
            </motion.h1>

            {designation && (
              <motion.p className="sinematic-role" variants={sinematicStaggerItem}>
                {designation}
              </motion.p>
            )}

            {summary && (
              <motion.p className="sinematic-summary" variants={sinematicStaggerItem}>
                {summary}
                <span className="sn-hero-cursor" aria-hidden="true">
                  {' >_'}
                </span>
              </motion.p>
            )}

            <motion.div className="sinematic-actions" variants={sinematicStaggerItem}>
              <motion.button
                type="button"
                className="sinematic-button sinematic-button-solid"
                onClick={() => selectNav('about')}
                {...press}
              >
                Enter reel <span aria-hidden="true">↓</span>
              </motion.button>
              {resume && (
                <motion.a className="sinematic-button" href={resume} download {...press}>
                  Download CV
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="sinematic-hero-media"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {image ? (
              <img
                src={image}
                alt={`${name || 'Profile'} portrait`}
                decoding="async"
              />
            ) : (
              <div className="sinematic-monogram" aria-hidden="true">
                {monogram}
              </div>
            )}

            <span className="sn-hero-corner sn-corner-tl" aria-hidden="true" />
            <span className="sn-hero-corner sn-corner-tr" aria-hidden="true" />
            <span className="sn-hero-corner sn-corner-bl" aria-hidden="true" />
            <span className="sn-hero-corner sn-corner-br" aria-hidden="true" />
            {name && <span className="sinematic-media-label">{name}</span>}
          </motion.div>
        </div>
      </section>
    </CinematicScene>
  );
}

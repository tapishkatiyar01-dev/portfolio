'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  arcadeBlink,
  arcadeEase,
  arcadeFloat,
  arcadePressMotion,
  arcadeSnap,
  arcadeStagger,
  arcadeStaggerItem,
} from './motionConfig';

function isGifSource(source) {
  return typeof source === 'string' && /^(?:data:image\/gif|.*\.gif(?:[?#]|$))/i.test(source);
}

function getInitials(name) {
  return name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'P1';
}

export default function Hero({
  name,
  designation,
  headlines,
  summary,
  resume,
  location,
  logo,
  avatar,
  stats = [],
}) {
  const reduced = useReducedMotion();
  const lines = headlines?.length ? headlines : [designation].filter(Boolean);
  const [index, setIndex] = useState(0);
  const [gifKey, setGifKey] = useState(0);
  const heroRef = useRef(null);
  const wasVisible = useRef(false);
  const media = avatar || logo;

  useEffect(() => {
    if (reduced || lines.length < 2) return undefined;
    const timer = setInterval(() => setIndex((value) => (value + 1) % lines.length), 3200);
    return () => clearInterval(timer);
  }, [lines.length, reduced]);

  useEffect(() => {
    const node = heroRef.current;
    if (!node || reduced) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible.current && isGifSource(media)) {
          setGifKey((value) => value + 1);
        }
        wasVisible.current = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [media, reduced]);

  const scroll = (event) => {
    event.preventDefault();
    document.getElementById('arcade-sections')?.scrollIntoView({ behavior: 'smooth' });
  };

  const score = stats?.slice(0, 3).map((item, statIndex) => (
    typeof item === 'string' ? { value: item, label: `Stat ${statIndex + 1}` } : item
  )) || [];

  return (
    <section className="arcade-hero" id="home" ref={heroRef}>
      <div className="arcade-hero-cabinet">
        <div className="arcade-cabinet-top" aria-hidden="true">
          <span className="arcade-marquee-dot" />
          <span className="arcade-marquee-dot" />
          <span className="arcade-marquee-dot" />
        </div>

        <div className="arcade-hero-inner">
          <motion.div
            className="arcade-hero-copy"
            variants={arcadeStagger}
            initial={reduced ? false : 'hidden'}
            animate={reduced ? undefined : 'visible'}
          >
            <motion.div className="arcade-eyebrow" variants={arcadeStaggerItem}>
              <span>PLAYER 01</span>
              <i aria-hidden="true" />
              {!reduced ? (
                <motion.span variants={arcadeBlink} animate="animate">
                  INSERT COIN
                </motion.span>
              ) : (
                <span>READY</span>
              )}
            </motion.div>

            <motion.h1 variants={arcadeStaggerItem}>
              {name || 'Player'}
              <b aria-hidden="true">.</b>
            </motion.h1>

            <motion.div className="arcade-class" variants={arcadeStaggerItem}>
              <span>CLASS</span>
              <div className="arcade-class-display" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.strong
                    key={lines[index] || designation}
                    initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3, ease: arcadeSnap }}
                  >
                    {lines[index] || designation}
                  </motion.strong>
                </AnimatePresence>
              </div>
            </motion.div>

            {summary && (
              <motion.p className="arcade-summary" variants={arcadeStaggerItem}>
                {summary}
              </motion.p>
            )}

            <motion.div className="arcade-lives" variants={arcadeStaggerItem} aria-hidden="true">
              {[0, 1, 2].map((heart) => (
                <motion.span
                  key={heart}
                  className="arcade-heart"
                  animate={reduced ? undefined : { scale: [1, 1.15, 1] }}
                  transition={{ duration: 0.9, delay: heart * 0.15, repeat: Infinity, repeatDelay: 2.5 }}
                />
              ))}
            </motion.div>

            <motion.div className="arcade-actions" variants={arcadeStaggerItem}>
              <motion.a
                className="arcade-button arcade-button-primary"
                href="#arcade-sections"
                onClick={scroll}
                {...arcadePressMotion(reduced)}
              >
                <span className="arcade-button-pixel" aria-hidden="true" />
                Press Start
                <span aria-hidden="true">▶</span>
              </motion.a>
              {resume && (
                <motion.a
                  className="arcade-button"
                  href={resume}
                  download
                  {...arcadePressMotion(reduced)}
                >
                  Save State
                  <span aria-hidden="true">↓</span>
                </motion.a>
              )}
            </motion.div>

            {location && (
              <motion.p className="arcade-location" variants={arcadeStaggerItem}>
                Spawn / {location}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            className="arcade-avatar-wrap"
            initial={reduced ? false : { opacity: 0, scale: 0.75, rotate: -6 }}
            animate={reduced ? undefined : { opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: arcadeEase }}
          >
            {!reduced && (
              <motion.div className="arcade-avatar-glow" animate={arcadeFloat.animate} />
            )}
            <div className="arcade-avatar-frame">
              <div className="arcade-avatar-screen">
                {media ? (
                  <img
                    key={gifKey}
                    src={media}
                    alt={`${name || 'Profile'} portrait`}
                  />
                ) : (
                  <span>{getInitials(name)}</span>
                )}
              </div>
              <b className="arcade-avatar-tag">LV 01</b>
              <span className="arcade-avatar-corner arcade-avatar-corner-tl" aria-hidden="true" />
              <span className="arcade-avatar-corner arcade-avatar-corner-tr" aria-hidden="true" />
              <span className="arcade-avatar-corner arcade-avatar-corner-bl" aria-hidden="true" />
              <span className="arcade-avatar-corner arcade-avatar-corner-br" aria-hidden="true" />
            </div>
            <div className="arcade-orbit arcade-orbit-one" />
            <div className="arcade-orbit arcade-orbit-two" />
          </motion.div>
        </div>

        {score.length > 0 && (
          <motion.div
            className="arcade-stats"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            {score.map((stat, statIndex) => (
              <motion.div
                key={`${stat.label}-${statIndex}`}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + statIndex * 0.1 }}
              >
                <span>0{statIndex + 1}</span>
                <strong>{stat.value}</strong>
                <small>{stat.label || 'Score'}</small>
              </motion.div>
            ))}
            <a href="#arcade-sections" onClick={scroll}>
              Continue
              <motion.span
                aria-hidden="true"
                animate={reduced ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </a>
          </motion.div>
        )}

        {score.length === 0 && (
          <motion.div
            className="arcade-stats arcade-stats-continue-only"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <a href="#arcade-sections" onClick={scroll} className="arcade-stats-scroll">
              Continue
              <motion.span
                aria-hidden="true"
                animate={reduced ? undefined : { y: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}

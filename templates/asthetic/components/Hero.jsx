'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  aestheticEase,
  aestheticPressMotion,
  aestheticStagger,
  aestheticStaggerItem,
  useAestheticWindowMotion,
} from './motionConfig';

function isGifSource(source) {
  return typeof source === 'string' && /^(?:data:image\/gif|.*\.gif(?:[?#]|$))/i.test(source);
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
  const safeHeadlines = headlines?.length ? headlines : [designation].filter(Boolean);
  const imageToUse = avatar || logo;
  const normalizedStats = stats.slice(0, 4).map((stat, index) => (
    typeof stat === 'string' ? { value: stat, label: `Focus ${index + 1}` } : stat
  ));
  const prefersReducedMotion = useReducedMotion();
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const currentHeadline = safeHeadlines[headlineIndex] || designation;
  const { ref: windowRef, isInView } = useAestheticWindowMotion();
  const [gifReplayKey, setGifReplayKey] = useState(0);
  const wasInView = useRef(false);

  useEffect(() => {
    if (isInView && !wasInView.current && isGifSource(imageToUse)) {
      setGifReplayKey((value) => value + 1);
    }
    wasInView.current = isInView;
  }, [imageToUse, isInView]);

  useEffect(() => {
    if (prefersReducedMotion || safeHeadlines.length < 2) return undefined;
    const timer = setInterval(() => {
      setHeadlineIndex((value) => (value + 1) % safeHeadlines.length);
    }, 4200);
    return () => clearInterval(timer); 
  }, [prefersReducedMotion, safeHeadlines.length]);

  const scrollToWork = (event) => {
    event.preventDefault();
    document.getElementById('aesthetic-sections')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.section
      className="aesthetic-window aesthetic-hero"
      variants={aestheticStagger}
      ref={windowRef}
      initial={prefersReducedMotion ? false : 'hidden'}
      animate={prefersReducedMotion ? undefined : (isInView ? 'visible' : 'hidden')}
    >
      <div className="aesthetic-hero-overlay" aria-hidden="true" />
      <div className="aesthetic-content">
        <div className="aesthetic-hero-grid">
          <motion.div variants={aestheticStaggerItem} className="aesthetic-hero-copy">
            <div className="aesthetic-eyebrow">
              <span className="aesthetic-brass-line" aria-hidden="true" />
              {designation || 'Portfolio'}
            </div>

            <div className="aesthetic-hero-title-block">
              {name && <h1 className="aesthetic-name">{name}</h1>}
              {currentHeadline && (
                <div className="aesthetic-designation" aria-live="polite">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={currentHeadline}
                      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                      transition={{ duration: 0.45, ease: aestheticEase }}
                    >
                      {currentHeadline}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
            </div>

            {summary && <p className="aesthetic-summary">{summary}</p>}

            <div className="aesthetic-actions">
              <motion.a
                href="#aesthetic-sections"
                onClick={scrollToWork}
                {...aestheticPressMotion(prefersReducedMotion)}
                className="aesthetic-button aesthetic-button-primary"
              >
                View work <span aria-hidden="true">→</span>
              </motion.a>
              {resume && (
                <motion.a
                  href={resume}
                  download
                  {...aestheticPressMotion(prefersReducedMotion)}
                  className="aesthetic-button"
                >
                  Download CV <span aria-hidden="true">↓</span>
                </motion.a>
              )}
            </div>

            {location && (
              <div className="aesthetic-location">
                <span className="aesthetic-location-mark" aria-hidden="true" />
                {location}
              </div>
            )}
          </motion.div>

          <motion.div
            key={isGifSource(imageToUse) ? `${imageToUse}-${gifReplayKey}` : imageToUse}
            variants={aestheticStaggerItem}
            {...aestheticPressMotion(prefersReducedMotion)}
            className="aesthetic-hero-portrait"
          >
            {imageToUse ? (
              <div className="aesthetic-portrait-frame">
                <img
                  src={imageToUse}
                  alt={`${name || 'Profile'} portrait`}
                  className="aesthetic-avatar-image"
                />
                <div className="aesthetic-portrait-orbit" />
                <div className="aesthetic-portrait-ring" aria-hidden="true" />
              </div>
            ) : (
              <div className="aesthetic-avatar-placeholder" aria-hidden="true">
                <span>{name?.split(/\s+/).map((part) => part[0]).join('').slice(0, 2)}</span>
              </div>
            )}
          </motion.div>

          <motion.a
            variants={aestheticStaggerItem}
            href="#aesthetic-sections"
            className="aesthetic-scroll-cue"
            onClick={scrollToWork}
          >
            <span aria-hidden="true">↓</span>
            <span>Scroll to explore</span>
          </motion.a>

          {normalizedStats.length > 0 && (
            <motion.div
              className="aesthetic-stats"
              aria-label="Portfolio highlights"
              variants={aestheticStaggerItem}
            >
              {normalizedStats.map((stat, index) => (
                <motion.div
                  key={`${stat.value}-${index}`}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.4, ease: aestheticEase }}
                >
                  <strong>{stat.value}</strong>
                  <span>{stat.label || 'Focus'}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

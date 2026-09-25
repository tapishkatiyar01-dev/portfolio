'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { premiumWindowVariants, usePremiumInView } from './motionConfig';

function isGifSource(source) {
  return typeof source === 'string' && /^(?:data:image\/gif|.*\.gif(?:[?#]|$))/i.test(source);
}

export default function Hero({ name, designation, headlines = [], summary, email, resume, location, logo, avatar, stats = [] }) {
  const { ref, isInView } = usePremiumInView(0.12);
  const isGifInView = useInView(ref, { amount: 0.12 });
  const shouldReduceMotion = useReducedMotion();
  const options = headlines.length ? headlines : [designation];
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const currentHeadline = options[headlineIndex] || designation || '';
  const [gifReplayKey, setGifReplayKey] = useState(0);
  const wasInView = useRef(false);
  const imageSource = avatar || logo;

  useEffect(() => {
    if (isGifInView && !wasInView.current && isGifSource(imageSource)) {
      setGifReplayKey((value) => value + 1);
    }
    wasInView.current = isGifInView;
  }, [imageSource, isGifInView]);

  useEffect(() => {
    if (options.length < 2 || shouldReduceMotion) return undefined;
    const timer = setInterval(() => setHeadlineIndex((value) => (value + 1) % options.length), 3200);
    return () => clearInterval(timer);
  }, [options.length, shouldReduceMotion]);

  return (
    <>
      <motion.section
        ref={ref}
        className="premium-hero premium-hero-reference"
        variants={premiumWindowVariants}
        initial={shouldReduceMotion ? false : 'hidden'}
        animate={shouldReduceMotion ? undefined : isInView ? 'visible' : 'hidden'}
      >
        <div className="premium-hero-copy">
          <p className="premium-hero-edition">Folio 01</p>
          <p className="premium-hero-greeting">Private press</p>
          <h1>
            {name}
            <span aria-hidden="true">.</span>
          </h1>
          <div className="premium-hero-headline" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={currentHeadline}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: [0.165, 0.84, 0.44, 1] }}
              >
                {currentHeadline}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="premium-hero-summary">{summary}</p>
          <div className="premium-actions">
            <a className="premium-button premium-button-primary" href={resume} target="_blank" rel="noreferrer">
              Download Resume
            </a>
            <a
              className="premium-button"
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact me
            </a>
          </div>
          {location ? <p className="premium-hero-location">{location}</p> : null}
        </div>

        <motion.div
          className="premium-avatar-orbit premium-avatar-stage"
          initial={shouldReduceMotion ? false : { opacity: 0, x: 28 }}
          animate={shouldReduceMotion ? undefined : isInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        >
          <div
            key={isGifSource(imageSource) ? `${imageSource}-${gifReplayKey}` : imageSource}
            className="premium-avatar-frame"
          >
            {imageSource ? (
              <img
                className="premium-avatar-image"
                src={imageSource}
                alt={`${name} profile`}
                width="720"
                height="900"
                fetchPriority="high"
              />
            ) : (
              <div className="premium-avatar-placeholder" aria-label={`${name} profile placeholder`}>
                {name?.slice(0, 1)}
              </div>
            )}
            <span className="premium-avatar-mark" aria-hidden="true">
              Plate A
            </span>
          </div>
        </motion.div>
      </motion.section>

      {stats.length > 0 ? (
        <div className="premium-hero-stats" aria-label="Highlights">
          {stats.map((stat, index) => (
            <div className="premium-hero-stat" key={`${stat.value}-${index}`}>
              <strong>{stat.value}</strong>
              {stat.label ? <span>{stat.label}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

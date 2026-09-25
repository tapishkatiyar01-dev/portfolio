'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { stickyReveal, useStickyInView } from './motionConfig';

const noteMotion = {
  hidden: { opacity: 0, y: 28, rotate: -2.5, scale: .97 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    rotate: index ? 1.2 : -1,
    scale: 1,
    transition: { delay: index * .12, duration: .65, ease: [0.16, 1, 0.3, 1] },
  }),
};

const childMotion = {
  hidden: { opacity: 0, y: 10 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: .2 + index * .06, duration: .4, ease: [0.165, 0.84, 0.44, 1] },
  }),
};

export default function Hero({
  name,
  designation,
  headlines = [],
  summary,
  resume,
  location,
  logo,
  avatar,
  stats = [],
  Sections = [],
}) {
  const { ref, isInView } = useStickyInView(0.08);
  const reduceMotion = useReducedMotion();
  const options = headlines.length ? headlines : [designation].filter(Boolean);
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const workSectionId =
    Sections.find((section) => /project|work|portfolio/i.test(section.id) || /project|work/i.test(section.name))?.id ||
    Sections[0]?.id ||
    'projects';

  const viewWork = (event) => {
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('stickynote:select-tab', { detail: workSectionId }));
    document.getElementById('stickynote-sections')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (options.length < 2 || reduceMotion) return undefined;

    const timer = setInterval(() => {
      setHeadlineIndex((value) => (value + 1) % options.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [options.length, reduceMotion]);

  return (
    <motion.section
      ref={ref}
      id="home"
      className="stickynote-hero"
      variants={stickyReveal}
      initial={reduceMotion ? false : 'hidden'}
      animate={reduceMotion || isInView ? 'visible' : 'hidden'}
    >
      <motion.div className="stickynote-note stickynote-note-yellow stickynote-intro-note" variants={noteMotion} custom={0} whileHover={reduceMotion ? undefined : { y: -5, rotate: -.5 }} whileTap={reduceMotion ? undefined : { scale: .985 }}>
        <span className="stickynote-tape tape-coral" aria-hidden="true" />
        <p className="stickynote-kicker">Hi, I&apos;m</p>
        <h1>{name}</h1>
        <div className="stickynote-headline" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={options[headlineIndex] || designation}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            >
              {options[headlineIndex] || designation}
            </motion.span>
          </AnimatePresence>
        </div>
        <p className="stickynote-summary">{summary}</p>
        <div className="stickynote-actions">
          <a
            className="stickynote-button button-purple"
            href="#stickynote-sections"
            onClick={viewWork}
          >
            View my work <span aria-hidden="true">→</span>
          </a>
          {resume && (
            <a className="stickynote-button button-yellow" href={resume} target="_blank" rel="noreferrer">
              Download CV <span aria-hidden="true">↓</span>
            </a>
          )}
        </div>
      </motion.div>

      <motion.div className="stickynote-note stickynote-note-blue stickynote-profile-note" variants={noteMotion} custom={1} whileHover={reduceMotion ? undefined : { y: -5, rotate: .7 }} whileTap={reduceMotion ? undefined : { scale: .985 }}>
        <span className="stickynote-tape tape-violet" aria-hidden="true" />
        <div className="stickynote-profile-layout">
          <div className="stickynote-traits">
            {stats.map((stat, index) => (
              <motion.div className="stickynote-trait" key={`${stat.value}-${index}`} variants={childMotion} custom={index}>
                <span aria-hidden="true">{['✧', '✿', '♡', '◷'][index % 4]}</span>
                <span>{stat.label || stat.value}</span>
              </motion.div>
            ))}
          </div>
          <div className="stickynote-avatar-wrap">
            {avatar || logo ? (
              <img className="stickynote-avatar" src={avatar || logo} alt={`${name} profile`} width="220" height="220" />
            ) : (
              <div className="stickynote-avatar-placeholder">{name?.slice(0, 1)}</div>
            )}
          </div>
        </div>
        {location && <p className="stickynote-location">⌖ {location}</p>}
        {stats.length > 0 && (
          <div className="stickynote-hero-stats" aria-label="Portfolio stats">
            {stats.map((stat, index) => (
              <motion.div key={`${stat.value}-${index}`} variants={childMotion} custom={index}>
                <strong>{stat.value}</strong>
                {stat.label && <span>{stat.label}</span>}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.section>
  );
}

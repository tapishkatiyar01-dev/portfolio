'use client';

import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useTerminalWindowMotion } from './motionConfig';
import TerminalCursor from './ui/TerminalCursor';

const easeOutQuart = [0.165, 0.84, 0.44, 1];

function isGifSource(source) {
  return typeof source === 'string' && /^(?:data:image\/gif|.*\.gif(?:[?#]|$))/i.test(source);
}

const container = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
      transition: { duration: 0.25, ease: easeOutQuart, staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: easeOutQuart } },
};

export default function Hero({ name, designation, headlines, summary, email, resume, location, logo, avatar }) {
  const safeHeadlines = headlines?.length ? headlines : [designation];
  const imageToUse = avatar || logo;
  const imageAlt = imageToUse ? `${name} terminal avatar` : '';
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const currentHeadline = safeHeadlines[headlineIndex] || designation;
  const { ref: windowRef, isInView } = useTerminalWindowMotion();
  const [gifReplayKey, setGifReplayKey] = useState(0);
  const wasInView = useRef(false);

  useEffect(() => {
    if (isInView && !wasInView.current && isGifSource(imageToUse)) {
      setGifReplayKey((value) => value + 1);
    }
    wasInView.current = isInView;
  }, [imageToUse, isInView]);

  useEffect(() => {
    const isComplete = visibleIndex === currentHeadline.length;
    const isEmpty = visibleIndex === 0;
    const delay = isComplete && !isDeleting ? 1500 : isEmpty && isDeleting ? 350 : isDeleting ? 42 : 78;
    const timer = setTimeout(() => {
      if (!isDeleting && !isComplete) {
        setVisibleIndex((value) => value + 1);
      } else if (!isDeleting && isComplete) {
        setIsDeleting(true);
      } else if (isDeleting && !isEmpty) {
        setVisibleIndex((value) => value - 1);
      } else {
        setIsDeleting(false);
        setHeadlineIndex((value) => (value + 1) % safeHeadlines.length);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [currentHeadline, headlineIndex, isDeleting, safeHeadlines.length, visibleIndex]);

  return (
    <motion.section
      className="terminal-window terminal-window-hero"
      variants={container}
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
        <div className="terminal-title">{name}@portfolio:~</div>
        <div className="terminal-actions">_ [] x</div>
      </div>

      <div className="terminal-content">
        <div className="terminal-hero-grid min-h-0 items-center gap-8">
          <motion.div variants={item} className="terminal-hero-copy">
            <div className="text-base text-zinc-200 md:text-lg">
              <span className="terminal-green">&gt;_</span> Hello, I'm
            </div>

            <div>
              <h1 className="glow-text text-5xl font-semibold tracking-normal text-terminal-green md:text-7xl">
                {name}
              </h1>
              <div className="mt-4 text-sm uppercase text-zinc-100 md:text-base relative inline-block">
                <span className="whitespace-nowrap">
                  {currentHeadline.slice(0, visibleIndex)}
                </span>
                {(!isDeleting || visibleIndex > 0) ? (
                  <TerminalCursor className="terminal-cursor-headline" />
                ) : null}
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
              {summary}
            </p>

            <div className="flex flex-wrap gap-3">
              <motion.a
                href="#terminal-sections"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="terminal-button terminal-button-primary"
              >
                [ view_projects.sh ]
              </motion.a>
              <motion.a
                href={resume}
                download
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="terminal-button"
              >
                [ resume.pdf ]
              </motion.a>
            </div>

            <div className="text-xs text-zinc-500">
              <span className="terminal-green">&gt;_</span> location -- {location}
            </div>
          </motion.div>

          <motion.div
            key={isGifSource(imageToUse) ? `${imageToUse}-${gifReplayKey}` : imageToUse}
            variants={item}
            className="terminal-avatar-terminal"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.24, ease: easeOutQuart }}
          >
            <div className="terminal-avatar-title">
              <span>&gt; render --avatar</span>
              <span>online</span>
            </div>
            {imageToUse ? (
              <div className="terminal-avatar-frame">
                <img src={imageToUse} alt={imageAlt} className="terminal-avatar-image" />
                <div className="terminal-avatar-scan" />
              </div>
            ) : (
              <div className="terminal-avatar-placeholder">
                <span>()</span>
                <span>/|\</span>
              </div>
            )}
            <pre className="terminal-avatar-output">
{`> npm run dev

OK  Portfolio Loaded
SYS ${designation}
LOC ${location}
NET Available`}
            </pre>
          </motion.div>

          <motion.div variants={item} className="terminal-log-line">
            &gt;_ console.log("Building the future, one line at a time...")
            <TerminalCursor />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

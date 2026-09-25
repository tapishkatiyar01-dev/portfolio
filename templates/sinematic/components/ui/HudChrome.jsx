'use client';

import { AnimatePresence, motion, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sinematicTapMotion, useSinematicScene } from '../motionConfig';
import { SINEMATIC_PROCESS } from '../sceneConfig';

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.47-1.1-1.47-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="currentColor">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 7.05a1.96 1.96 0 1 0 0-3.92 1.96 1.96 0 0 0 0 3.92ZM20.44 20h-3.37v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.15 1.45-2.15 2.96V20H9.69V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.27 2.24 4.27 5.16V20Z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" />
    </svg>
  );
}

function chunkTraits(traits = [], size = 2) {
  const values = traits.filter(Boolean);
  const rows = [];
  for (let i = 0; i < values.length; i += size) rows.push(values.slice(i, i + size));
  return rows.slice(0, 4);
}

export default function HudChrome({ personal, socials, navItems = [] }) {
  const { activeId, activeIndex, total, selectNav, scrollYProgress } = useSinematicScene();
  const reduced = useReducedMotion();
  const tap = sinematicTapMotion(reduced);
  const processMotion = useTransform(
    scrollYProgress,
    [0, 1],
    [0, SINEMATIC_PROCESS.length - 1],
  );
  const [processStep, setProcessStep] = useState(0);
  const [hudOpen, setHudOpen] = useState(true);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    if (media.matches) setHudOpen(false);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.hud = hudOpen ? 'open' : 'closed';
  }, [hudOpen]);

  useEffect(() => {
    const unsubscribe = processMotion.on('change', (value) => {
      const next = Math.round(value);
      setProcessStep((prev) => (prev === next ? prev : next));
    });
    return () => unsubscribe();
  }, [processMotion]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== 'h' && event.key !== 'H') return;
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      setHudOpen((open) => !open);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const socialEntries = [
    socials?.github && { id: 'github', href: socials.github, label: 'GitHub', icon: <IconGithub /> },
    socials?.linkedin && { id: 'linkedin', href: socials.linkedin, label: 'LinkedIn', icon: <IconLinkedin /> },
    personal?.email && { id: 'email', href: `mailto:${personal.email}`, label: 'Email', icon: <IconMail /> },
    socials?.website && { id: 'code', href: socials.website, label: 'Website', icon: <IconCode /> },
  ].filter(Boolean);

  const traitRows = chunkTraits(personal?.traits);
  const itemTotal = Math.max(total, 1);
  const counterValue = activeIndex + 1;
  const boardMotion = {
    initial: reduced ? false : { opacity: 0 },
    animate: { opacity: 1 },
    exit: reduced ? { opacity: 0 } : { opacity: 0 },
    transition: { duration: reduced ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <>
      <motion.div
        className="sn-letterbox sn-letterbox-top"
        aria-hidden="true"
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        style={{ transformOrigin: 'top' }}
        transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="sn-letterbox sn-letterbox-bottom"
        aria-hidden="true"
        initial={reduced ? false : { scaleY: 0 }}
        animate={{ scaleY: 1 }}
        style={{ transformOrigin: 'bottom' }}
        transition={{ duration: reduced ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.button
        type="button"
        className={`sn-hud-toggle${hudOpen ? ' is-open' : ''}`}
        aria-expanded={hudOpen}
        aria-controls="sn-hud-board"
        aria-label={hudOpen ? 'Close HUD board' : 'Open HUD board'}
        title={hudOpen ? 'Hide HUD (H)' : 'Show HUD (H)'}
        onClick={() => setHudOpen((open) => !open)}
        {...tap}
      >
        <span className="sn-hud-toggle-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>{hudOpen ? 'Hide HUD' : 'Show HUD'}</span>
      </motion.button>

      <AnimatePresence initial={false}>
        {hudOpen ? (
          <motion.div key="hud-board" id="sn-hud-board" className="sn-hud-board" {...boardMotion}>
            <div className="sn-rec-badge" aria-hidden="true">
              <i />
              Rec · {String(counterValue).padStart(2, '0')}
            </div>

            <div className="sn-hud-frame" aria-hidden="true">
              <span className="sn-corner sn-corner-tl" />
              <span className="sn-corner sn-corner-tr" />
              <span className="sn-corner sn-corner-bl" />
              <span className="sn-corner sn-corner-br" />
              <span className="sn-hud-border" />
            </div>

            <aside className="sn-hud-rail" aria-label="Section rail">
              <div className="sn-hud-counter" aria-live="polite">
                <motion.span
                  key={counterValue}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {String(counterValue).padStart(2, '0')}
                </motion.span>
                <span className="sn-hud-counter-sep">/</span>
                <span>{String(itemTotal).padStart(2, '0')}</span>
              </div>

              <div className="sn-hud-rail-track" role="tablist" aria-orientation="vertical" aria-label="Sections">
                <span className="sn-hud-rail-line" aria-hidden="true">
                  <motion.i
                    className="sn-hud-rail-fill"
                    animate={{
                      height: `${(counterValue / itemTotal) * 100}%`,
                    }}
                    transition={{ duration: reduced ? 0.15 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>
                {navItems.map((item, index) => {
                  const reached = index <= activeIndex;
                  const active = activeId === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={item.label}
                      className={`sn-hud-rail-dot${active ? ' is-active' : ''}${reached ? ' is-reached' : ''}`}
                      onClick={() => selectNav(item.id)}
                      {...tap}
                    >
                      <i />
                      <span className="sn-hud-rail-tip">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </aside>

            {socialEntries.length > 0 && (
              <nav className="sn-hud-socials" aria-label="Social links">
                {socialEntries.map((entry) => (
                  <motion.a
                    key={entry.id}
                    href={entry.href}
                    target={entry.id === 'email' ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={entry.label}
                    {...tap}
                  >
                    {entry.icon}
                  </motion.a>
                ))}
              </nav>
            )}

            <div className="sn-hud-process" aria-hidden="true">
              <div className="sn-hud-process-bar">
                <motion.span
                  className="sn-hud-process-thumb"
                  animate={{
                    left: `${(processStep / Math.max(SINEMATIC_PROCESS.length - 1, 1)) * 100}%`,
                    width: `${100 / SINEMATIC_PROCESS.length}%`,
                  }}
                  transition={{ duration: reduced ? 0.15 : 0.55, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <div className="sn-hud-process-labels">
                {SINEMATIC_PROCESS.map((label, index) => (
                  <span key={label} className={index === processStep ? 'is-active' : ''}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {traitRows.length > 0 && (
              <aside className="sn-hud-stack" aria-label="Traits">
                <p>CAST NOTES</p>
                {traitRows.map((row) => (
                  <span key={row.join('|')}>{row.join(' | ')}</span>
                ))}
              </aside>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { sinematicTapMotion, useSinematicScene } from '../motionConfig';
import { runSinematicSlate } from '../runSinematicSlate';

/**
 * Director's slate — jump scenes, swap LUTs, toggle grain, roll pagination.
 */
export default function DirectorSlate({ personal }) {
  const { activeId, activeIndex, total, navItems, selectNav } = useSinematicScene();
  const reduced = useReducedMotion();
  const tap = sinematicTapMotion(reduced);
  const [cue, setCue] = useState('');
  const [status, setStatus] = useState('slate · take 01 / lut cyan / gel neon');
  const [flash, setFlash] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const openRef = useRef(open);
  const shouldFocusRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open || !shouldFocusRef.current) return undefined;
    shouldFocusRef.current = false;
    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, reduced ? 0 : 180);
    return () => window.clearTimeout(timer);
  }, [open, reduced]);

  useEffect(() => {
    const onKey = (event) => {
      const tag = event.target?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable;

      if ((event.key === 's' || event.key === 'S') && !event.metaKey && !event.ctrlKey && !event.altKey && !typing) {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }

      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !typing) {
        event.preventDefault();
        if (!openRef.current) {
          shouldFocusRef.current = true;
          setOpen(true);
          return;
        }
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let timer;
    const onOk = (event) => {
      setFlash(event.detail || 'MARK');
      clearTimeout(timer);
      timer = setTimeout(() => setFlash(''), 900);
    };
    window.addEventListener('sinematic:slate-ok', onOk);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('sinematic:slate-ok', onOk);
    };
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const result = runSinematicSlate({
      input: cue,
      navItems,
      personal,
      selectNav,
    });
    setStatus(result.status);
    setCue('');
  };

  const takeNo = String(activeIndex + 1).padStart(2, '0');
  const takeTotal = String(Math.max(total, 1)).padStart(2, '0');
  const sceneLabel = navItems.find((item) => item.id === activeId)?.label || '—';

  return (
    <>
      {flash ? (
        <div className="sn-slate-toast" role="status" aria-live="polite">
          {flash}
        </div>
      ) : null}

      <motion.button
        type="button"
        className={`sn-slate-toggle${open ? ' is-open' : ''}`}
        aria-expanded={open}
        aria-controls="sn-director-slate"
        aria-label={open ? 'Close director slate' : 'Open director slate'}
        title={open ? 'Hide slate (S)' : 'Show slate (S)'}
        onClick={() => {
          setOpen((value) => {
            const next = !value;
            if (next) shouldFocusRef.current = true;
            return next;
          });
        }}
        {...tap}
      >
        <span aria-hidden="true">{open ? '▾' : '▴'}</span>
        <span>{open ? 'Hide slate' : 'Show slate'}</span>
      </motion.button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="director-slate"
            id="sn-director-slate"
            className="sn-director-slate"
            aria-label="Director slate"
            initial={reduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduced ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sn-slate-hinge" aria-hidden="true" />
            <header className="sn-slate-head">
              <span className="sn-slate-brand">SLATE</span>
              <span>
                TAKE {takeNo}/{takeTotal}
              </span>
            </header>
            <p className="sn-slate-scene">{sceneLabel}</p>
            <form className="sn-slate-form" onSubmit={submit}>
              <label htmlFor="sinematic-slate-input">cue</label>
              <input
                ref={inputRef}
                id="sinematic-slate-input"
                className="sn-slate-input"
                value={cue}
                onChange={(event) => setCue(event.target.value)}
                placeholder="take about · gel neon · gel teal · lut noir"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="go"
              />
              <button type="submit" className="sn-slate-submit">
                Mark
              </button>
            </form>
            <p className="sn-slate-status" role="status" aria-live="polite">
              {status}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

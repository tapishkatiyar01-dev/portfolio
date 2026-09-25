'use client';

import { useEffect, useState } from 'react';
import { runStickyScribble } from './runStickyScribble';

/**
 * Quick sticky scribble — navigate tabs, change desk paper, shuffle note colors.
 */
export default function StickyScribble({ tabs = [], personal, activeId, onPin }) {
  const [scribble, setScribble] = useState('');
  const [status, setStatus] = useState('scribble · #projects / pink / shuffle');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== 'n' && event.key !== 'N') return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;
      const el = document.getElementById('stickynote-scribble-input');
      if (el && document.activeElement !== el) {
        event.preventDefault();
        el.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let timer;
    const onOk = (event) => {
      setToast(event.detail || 'OK');
      clearTimeout(timer);
      timer = setTimeout(() => setToast(''), 900);
    };
    window.addEventListener('stickynote:scribble-ok', onOk);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('stickynote:scribble-ok', onOk);
    };
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const result = runStickyScribble({
      input: scribble,
      tabs,
      personal,
      setActive: onPin,
    });
    setStatus(result.status);
    setScribble('');
  };

  const activeName = tabs.find((tab) => tab.id === activeId)?.name || '—';

  return (
    <>
      {toast ? (
        <div className="stickynote-scribble-toast" role="status" aria-live="polite">
          {toast}
        </div>
      ) : null}

      <div className="stickynote-scribble">
        <div className="stickynote-scribble-tape" aria-hidden="true" />
        <header className="stickynote-scribble-head">
          <span>Quick scribble</span>
          <span>{activeName}</span>
        </header>
        <form className="stickynote-scribble-form" onSubmit={submit}>
          <label htmlFor="stickynote-scribble-input">note</label>
          <input
            id="stickynote-scribble-input"
            className="stickynote-scribble-input"
            value={scribble}
            onChange={(event) => setScribble(event.target.value)}
            placeholder="#projects · pink · shuffle · more"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
          />
          <button type="submit" className="stickynote-scribble-submit">
            Stick
          </button>
        </form>
        <p className="stickynote-scribble-status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { runArcadeCheat } from './runArcadeCheat';

/**
 * Cheat-code input — navigate stages, swap palettes, toggle arcade FX.
 */
export default function CheatCodes({ tabs = [], personal, activeId, onWarp }) {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('insert coin · warp projects / blast / shoot');

  useEffect(() => {
    const onKonami = (event) => {
      // Lightweight: press `~` to focus the cheat field
      if (event.key === '`' || event.key === '~') {
        const el = document.getElementById('arcade-cheat-input');
        if (el && document.activeElement !== el) {
          event.preventDefault();
          el.focus();
        }
      }
    };
    window.addEventListener('keydown', onKonami);
    return () => window.removeEventListener('keydown', onKonami);
  }, []);

  const submit = (event) => {
    event.preventDefault();
    const result = runArcadeCheat({
      input: code,
      tabs,
      personal,
      setActive: onWarp,
    });
    setStatus(result.status);
    setCode('');
  };

  const stage =
    tabs.findIndex((tab) => tab.id === activeId) >= 0
      ? String(tabs.findIndex((tab) => tab.id === activeId) + 1).padStart(2, '0')
      : '—';

  return (
    <div className="arcade-cheat">
      <div className="arcade-cheat-heading">
        <span>CHEAT CODES</span>
        <span>STAGE {stage}</span>
      </div>
      <form className="arcade-cheat-form" onSubmit={submit}>
        <label htmlFor="arcade-cheat-input">› code</label>
        <input
          id="arcade-cheat-input"
          className="arcade-cheat-input"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="warp projects · blast · shoot 3 · palette neon"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="go"
        />
        <button type="submit" className="arcade-cheat-submit">
          Enter
        </button>
      </form>
      <p className="arcade-cheat-status" role="status" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

const MAX_BLASTS = 8;
const LIFE_MS = 620;

function randomPoint() {
  const pad = 48;
  return {
    x: pad + Math.random() * Math.max(window.innerWidth - pad * 2, 1),
    y: pad + Math.random() * Math.max(window.innerHeight - pad * 2, 1),
  };
}

function pickKind(requested) {
  const key = String(requested || '').toLowerCase();
  if (key === 'shot' || key === 'shoot' || key === 'fire' || key === 'pew') return 'shot';
  if (key === 'blast' || key === 'boom' || key === 'explode') return 'blast';
  return Math.random() > 0.45 ? 'blast' : 'shot';
}

/**
 * Pixel shot / blast FX — fires on interactive clicks and `arcade:blast` cheats.
 */
export default function ArcadeBlast() {
  const [blasts, setBlasts] = useState([]);

  useEffect(() => {
    const spawn = ({ x, y, kind = 'blast' }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const next = { id, x, y, kind: pickKind(kind) };
      setBlasts((list) => [...list.slice(-(MAX_BLASTS - 1)), next]);
      window.setTimeout(() => {
        setBlasts((list) => list.filter((item) => item.id !== id));
      }, LIFE_MS);
    };

    const onClick = (event) => {
      if (event.button != null && event.button !== 0) return;
      const hit = event.target?.closest?.(
        [
          'button',
          'a.arcade-button',
          '.arcade-button',
          '.arcade-tabs button',
          '.arcade-cheat-submit',
          '.arcade-menu',
          '.arcade-header nav a',
          '.arcade-status',
          '.arcade-brand',
          '[role="tab"]',
          'input[type="submit"]',
        ].join(', '),
      );
      if (!hit) return;
      if (hit.disabled || hit.getAttribute?.('aria-disabled') === 'true') return;
      spawn({
        x: event.clientX,
        y: event.clientY,
        kind: hit.classList?.contains('arcade-button-primary') ? 'blast' : 'shot',
      });
    };

    const onBlast = (event) => {
      const detail = event.detail || {};
      const point =
        Number.isFinite(detail.x) && Number.isFinite(detail.y)
          ? { x: detail.x, y: detail.y }
          : randomPoint();
      spawn({ ...point, kind: detail.kind || 'blast' });
    };

    document.addEventListener('pointerdown', onClick, true);
    window.addEventListener('arcade:blast', onBlast);
    return () => {
      document.removeEventListener('pointerdown', onClick, true);
      window.removeEventListener('arcade:blast', onBlast);
    };
  }, []);

  if (!blasts.length) return null;

  return (
    <div className="arcade-blast-layer" aria-hidden="true">
      {blasts.map((blast) => (
        <span
          key={blast.id}
          className={`arcade-fx arcade-fx-${blast.kind}`}
          style={{ left: blast.x, top: blast.y }}
        >
          {blast.kind === 'shot' ? (
            <>
              <i className="arcade-fx-beam arcade-fx-beam-h" />
              <i className="arcade-fx-beam arcade-fx-beam-v" />
              <i className="arcade-fx-core" />
              <i className="arcade-fx-spark arcade-fx-spark-1" />
              <i className="arcade-fx-spark arcade-fx-spark-2" />
              <i className="arcade-fx-spark arcade-fx-spark-3" />
              <i className="arcade-fx-spark arcade-fx-spark-4" />
            </>
          ) : (
            <>
              <i className="arcade-fx-ring arcade-fx-ring-1" />
              <i className="arcade-fx-ring arcade-fx-ring-2" />
              <i className="arcade-fx-core arcade-fx-core-blast" />
              <i className="arcade-fx-shard arcade-fx-shard-1" />
              <i className="arcade-fx-shard arcade-fx-shard-2" />
              <i className="arcade-fx-shard arcade-fx-shard-3" />
              <i className="arcade-fx-shard arcade-fx-shard-4" />
              <i className="arcade-fx-shard arcade-fx-shard-5" />
              <i className="arcade-fx-shard arcade-fx-shard-6" />
            </>
          )}
        </span>
      ))}
    </div>
  );
}

export function fireArcadeBlast(detail = {}) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('arcade:blast', { detail }));
}

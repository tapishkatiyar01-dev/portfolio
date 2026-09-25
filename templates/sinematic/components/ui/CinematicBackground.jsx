'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSinematicScene } from '../motionConfig';
import {
  applyNeonGelMode,
  cycleProjectionPalette,
  nextProjectionPalette,
  projectionBeamForIndex,
} from '../sceneConfig';

const MOBILE_MQ = '(max-width: 760px)';

/**
 * Scope void + projection beam.
 * Neon mode advances gel color when the active section changes (not on a timer).
 * Locked colors stay fixed until the user picks another or returns to neon.
 */
export default function CinematicBackground() {
  const reduced = useReducedMotion();
  const { activeId, activeIndex } = useSinematicScene();
  const [palette, setPalette] = useState('amber');
  const [mode, setMode] = useState('neon');
  const [isMobile, setIsMobile] = useState(false);
  const paletteRef = useRef(palette);
  const modeRef = useRef(mode);
  const sectionReadyRef = useRef(false);

  useEffect(() => {
    paletteRef.current = palette;
  }, [palette]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const beam = useMemo(
    () => projectionBeamForIndex(activeIndex, isMobile),
    [activeIndex, isMobile],
  );

  useEffect(() => {
    applyNeonGelMode('amber');
    const onPalette = (event) => {
      const detail = event.detail;
      if (!detail) return;
      if (typeof detail === 'string') {
        setPalette(detail);
        setMode('lock');
        return;
      }
      if (detail.palette) setPalette(detail.palette);
      if (detail.mode) setMode(detail.mode);
    };
    window.addEventListener('sinematic:palette', onPalette);
    return () => window.removeEventListener('sinematic:palette', onPalette);
  }, []);

  // Neon: step gel once per section change (skip initial mount)
  useEffect(() => {
    if (!sectionReadyRef.current) {
      sectionReadyRef.current = true;
      return;
    }
    if (modeRef.current !== 'neon') return;

    const next = nextProjectionPalette(paletteRef.current);
    paletteRef.current = next;
    setPalette(next);
    document.documentElement.dataset.projectionPalette = next;
    document.documentElement.dataset.projectionMode = 'neon';
  }, [activeId]);

  const onLampClick = () => {
    const next = cycleProjectionPalette(palette);
    setPalette(next);
    setMode('lock');
    window.dispatchEvent(new CustomEvent('sinematic:slate-ok', { detail: `GEL ${next}` }));
  };

  const fade = reduced
    ? { duration: 0 }
    : { duration: 0.34, ease: [0.4, 0, 0.2, 1] };

  const gelLabel = mode === 'neon' ? `neon · ${palette}` : palette;
  const poseKey = `${beam.label}|${beam.x}|${beam.y}|${beam.angle}`;

  return (
    <>
      <div
        className="sinematic-cinematic-bg"
        data-active-scene={activeId}
        data-projection={beam.label}
        data-projection-palette={palette}
        data-projection-mode={mode}
        data-mobile={isMobile ? 'true' : 'false'}
      >
        <div className="sn-void-stage" aria-hidden="true">
          <div className="sn-void-base" />
          <div className="sn-void-screen" />
          <div className="sn-void-floor" />
          <div className="sn-void-columns" />
          <div className="sn-void-ambient" />
          {!isMobile ? <div className="sn-void-marks" /> : null}
        </div>

        {!reduced && !isMobile ? <div className="sn-bg-depth" aria-hidden="true" /> : null}
        <div className="sn-bg-wash" aria-hidden="true" />
        {!reduced && !isMobile ? <div className="sn-bg-sweep" aria-hidden="true" /> : null}
        <div className="sn-bg-vignette" aria-hidden="true" />
      </div>

      <div
        className="sn-projection-fore"
        data-projection={beam.label}
        data-projection-palette={palette}
        data-projection-mode={mode}
        data-mobile={isMobile ? 'true' : 'false'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={poseKey}
            className="sn-projection-pose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
          >
            <div
              className="sn-projection-beam"
              style={{
                '--beam-flare': `${beam.flare}%`,
                '--beam-flare-soft': `${Math.min(beam.flare + 10, 68)}%`,
                '--beam-length': beam.length,
                left: beam.x,
                top: beam.y,
                transform: `translateY(-50%) rotate(${beam.angle}deg)`,
              }}
              aria-hidden="true"
            >
              <span className="sn-projection-source sn-projection-source-glow" />
              <span className="sn-projection-cone" />
              <span className="sn-projection-haze" />
              <span className="sn-projection-dust" />
            </div>

            <button
              type="button"
              className="sn-projection-source sn-projection-source-hit"
              data-projection-palette={palette}
              aria-label={
                mode === 'neon'
              ? `Neon gel. Current: ${palette}. Advances on each section. Click to lock.`
              : `Locked gel: ${palette}. Click to change color.`
          }
          title={`Gel · ${gelLabel}${mode === 'neon' ? ' · per section' : ' · locked'} (click to lock / change)`}
              style={{ left: beam.x, top: beam.y }}
              onClick={onLampClick}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

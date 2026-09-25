'use client';

import { useEffect, useRef, useState } from 'react';
import {
  attachHoverLift,
  attachMagnetic,
  attachPointerTilt,
  bindItemMotion,
  getGsap,
  lightTap,
  prefersReducedMotion,
  registerKineticGsap,
  useGSAP,
} from './gsapSetup';
import {
  animateHeroRoleSwap,
  bindHeroEntranceTrigger,
  bindHeroInteractions,
  bindHeroParallax,
  buildHeroEntranceTimeline,
} from './motionConfig';
import KineticChars from './ui/KineticChars';
import KineticMarquee from './ui/KineticMarquee';

registerKineticGsap();

function isGifSource(source) {
  return typeof source === 'string' && /^(?:data:image\/gif|.*\.gif(?:[?#]|$))/i.test(source);
}

function getInitials(name) {
  return (
    name
      ?.split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'MK'
  );
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
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const visualRef = useRef(null);
  const mediaRef = useRef(null);
  const ctaRef = useRef(null);
  const media = avatar || logo;
  const lines = headlines?.length ? headlines : [designation].filter(Boolean);
  const [index, setIndex] = useState(0);
  const [gifKey, setGifKey] = useState(0);
  const wasVisible = useRef(false);

  const score =
    stats?.slice(0, 3).map((item, statIndex) =>
      typeof item === 'string' ? { value: item, label: `Focus ${statIndex + 1}` } : item,
    ) || [];

  const marqueeItems = [...(lines || []), designation, location].filter(Boolean);
  const displayName = name || 'Maker';

  useEffect(() => {
    if (prefersReducedMotion() || lines.length < 2) return undefined;
    const timer = setInterval(() => setIndex((value) => (value + 1) % lines.length), 3200);
    return () => clearInterval(timer);
  }, [lines.length]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || prefersReducedMotion()) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !wasVisible.current && isGifSource(media)) {
          setGifKey((value) => value + 1);
        }
        wasVisible.current = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [media]);

  useGSAP(
    (context, contextSafe) => {
      const root = rootRef.current;
      const { gsap, ScrollTrigger } = getGsap();
      if (!root || !gsap || !ScrollTrigger) return undefined;

      const cleanups = [];

      if (ctaRef.current) {
        cleanups.push(attachMagnetic(ctaRef.current, 0.32));
        cleanups.push(attachHoverLift(ctaRef.current, { y: -5, scale: 1.035, duration: 0.2 }));
      }
      if (visualRef.current) cleanups.push(attachPointerTilt(visualRef.current, { max: 9 }));

      cleanups.push(
        bindItemMotion(root.querySelectorAll('[data-k="stat"]'), {
          y: -6,
          scale: 1.025,
          duration: 0.2,
          tap: true,
        }),
      );

      if (!prefersReducedMotion()) {
        cleanups.push(
          bindHeroInteractions(gsap, {
            root,
            visual: visualRef.current,
            attachMagnetic,
            attachHoverLift,
            bindItemMotion,
          }),
        );
      }

      root.querySelectorAll('.kinetic-btn').forEach((btn) => {
        const onDown = contextSafe(() => {
          lightTap();
          btn.classList.add('is-pressed');
        });
        const onUp = contextSafe(() => btn.classList.remove('is-pressed'));
        btn.addEventListener('pointerdown', onDown);
        btn.addEventListener('pointerup', onUp);
        btn.addEventListener('pointerleave', onUp);
        btn.addEventListener('pointercancel', onUp);
        cleanups.push(() => {
          btn.removeEventListener('pointerdown', onDown);
          btn.removeEventListener('pointerup', onUp);
          btn.removeEventListener('pointerleave', onUp);
          btn.removeEventListener('pointercancel', onUp);
        });
      });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: '(min-width: 768px)',
          isMobile: '(max-width: 767px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (self) => {
          const { isDesktop, isMobile, reduceMotion } = self.conditions;
          if (reduceMotion) return undefined;

          const tl = buildHeroEntranceTimeline(gsap, { isDesktop, isMobile });
          const entrance = bindHeroEntranceTrigger(ScrollTrigger, tl, root);
          const parallax = bindHeroParallax(gsap, {
            root,
            stage: stageRef.current || root,
            visual: visualRef.current,
            media: mediaRef.current,
            isDesktop,
            isMobile,
          });

          if (entrance?.isActive) tl.timeScale(1).play(0);

          return () => {
            entrance?.kill();
            parallax.forEach((tween) => tween?.scrollTrigger?.kill());
            parallax.forEach((tween) => tween?.kill());
            tl.kill();
          };
        },
      );

      cleanups.push(() => mm.revert());

      return () => cleanups.forEach((fn) => fn?.());
    },
    { scope: rootRef },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return undefined;
      const { gsap } = getGsap();
      const el = rootRef.current?.querySelector('[data-k="role-text"]');
      animateHeroRoleSwap(gsap, el);
    },
    { scope: rootRef, dependencies: [index] },
  );

  return (
    <section className="kinetic-hero" ref={rootRef}>
      <div className="kinetic-hero-bloom" aria-hidden="true" />
      <div className="kinetic-hero-grid" aria-hidden="true" />

      <div className="kinetic-hero-stage" ref={stageRef}>
        <div className="kinetic-hero-copy">
          <p className="kinetic-eyebrow" data-k="eyebrow">
            <span>{location || 'Portfolio'}</span>
            <i aria-hidden="true" />
            <span>{designation || 'Available'}</span>
          </p>

          <h1>
            <span className="kinetic-title-mask">
              <KineticChars text={displayName} className="kinetic-title-line" as="span" />
              <b className="kinetic-title-dot" aria-hidden="true">
                .
              </b>
            </span>
          </h1>

          <div className="kinetic-role" data-k="role" aria-live="polite">
            <strong data-k="role-text">
              {(lines[index] || designation || '').replace(/\|/g, ' ')}
            </strong>
          </div>

          {summary ? (
            <p className="kinetic-summary" data-k="summary">
              {summary}
            </p>
          ) : null}

          <div className="kinetic-actions">
            <a
              ref={ctaRef}
              className="kinetic-btn kinetic-btn-primary"
              href="#about"
              data-k="action"
              data-kinetic-magnet
            >
              Explore work
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 2v9M3.5 8.5 7 12l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            {resume ? (
              <a className="kinetic-btn" href={resume} download data-k="action">
                Resume
              </a>
            ) : null}
          </div>
        </div>

        <div className="kinetic-hero-visual" data-k="visual" ref={visualRef}>
          <span className="kinetic-hero-glow" data-k="glow" aria-hidden="true" />
          <span className="kinetic-hero-ring is-outer" aria-hidden="true" />
          <span className="kinetic-hero-ring is-inner" aria-hidden="true" />
          <span className="kinetic-float is-a" data-k-float aria-hidden="true" />
          <span className="kinetic-float is-b" data-k-float aria-hidden="true" />
          <span className="kinetic-float is-c" data-k-float aria-hidden="true" />
          <span className="kinetic-float is-d" data-k-float aria-hidden="true" />
          <div className="kinetic-avatar">
            <div className="kinetic-avatar-media" ref={mediaRef}>
              {media ? (
                <img key={gifKey} src={media} alt={`${displayName} portrait`} />
              ) : (
                <span>{getInitials(name)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {(score.length > 0 || marqueeItems.length > 0) && (
        <div className="kinetic-hero-after">
          {score.length > 0 ? (
            <div className="kinetic-stats" aria-label="Highlights">
              {score.map((stat, statIndex) => (
                <div key={`${stat.label}-${statIndex}`} data-k="stat">
                  <strong>{stat.value}</strong>
                  <small>{stat.label || 'Signal'}</small>
                </div>
              ))}
            </div>
          ) : null}

          {marqueeItems.length > 0 ? (
            <div data-k="marquee">
              <KineticMarquee items={marqueeItems} speed={26} label="Headlines" />
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

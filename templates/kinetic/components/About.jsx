'use client';

import { useRef } from 'react';
import {
  attachMagnetic,
  attachPointerTilt,
  bindItemMotion,
  getGsap,
  prefersReducedMotion,
  registerKineticGsap,
  revealItems,
  useGSAP,
} from './gsapSetup';
import {
  bindAboutInteractions,
  bindAboutParallax,
  buildAboutEntranceTimeline,
} from './motionConfig';
import KineticMotionItem from './ui/KineticMotionItem';

registerKineticGsap();

function getInitials(name) {
  return (
    name
      ?.split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '??'
  );
}

export default function About({ personal, index = 0 }) {
  const rootRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);

  const image = personal?.Logo || personal?.Avatar;
  const kicker = personal?.aboutKicker || personal?.designation || '';
  const copy = personal?.description || personal?.summary || '';
  const rows = [
    { label: 'Name', value: personal?.name },
    { label: 'Role', value: personal?.designation },
    { label: 'Base', value: personal?.location },
    { label: 'Mail', value: personal?.email },
  ].filter((row) => row.value);

  useGSAP(
    () => {
      const root = rootRef.current;
      const { gsap } = getGsap();
      if (!root || !gsap) return undefined;

      const cleanups = [];

      if (frameRef.current && !prefersReducedMotion()) {
        cleanups.push(attachPointerTilt(frameRef.current, { max: 9 }));
      }

      if (!prefersReducedMotion()) {
        buildAboutEntranceTimeline(gsap, root);

        const parallax = bindAboutParallax(gsap, {
          root,
          media: mediaRef.current,
          frame: frameRef.current,
        });
        cleanups.push(() => {
          parallax.forEach((tween) => {
            tween?.scrollTrigger?.kill();
            tween?.kill();
          });
        });

        const { cleanups: ixCleanups, batches } = bindAboutInteractions(gsap, {
          root,
          frame: frameRef.current,
          attachMagnetic,
          bindItemMotion,
          revealItems,
          metaSelector: '.kinetic-about-stat',
          chipSelector: '.kinetic-chip',
        });
        cleanups.push(...ixCleanups);
        batches.forEach((batch) => cleanups.push(() => batch.kill()));
      }

      return () => {
        cleanups.forEach((fn) => fn?.());
      };
    },
    { scope: rootRef, dependencies: [personal?.name, rows.length, personal?.traits?.length] },
  );

  return (
    <div className="kinetic-panel kinetic-about" ref={rootRef}>
      <div className="kinetic-about-stage">
        <div className="kinetic-about-intro" data-about-reveal>
          <p className="kinetic-eyebrow">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <i aria-hidden="true" />
            <span>About</span>
          </p>
          {kicker ? <p className="kinetic-about-kicker">{kicker}</p> : null}
          {personal?.name ? (
            <h2 className="kinetic-about-title">
              {personal.name}
              {personal?.designation ? (
                <em> — {personal.designation}</em>
              ) : null}
            </h2>
          ) : null}
        </div>

        <div className="kinetic-about-layout">
          <div className="kinetic-about-visual" data-about-reveal>
            <div className="kinetic-about-orb" data-about-orb aria-hidden="true" />
            <div className="kinetic-about-ring" data-about-ring aria-hidden="true" />
            <div className="kinetic-about-frame" ref={frameRef}>
              <div className="kinetic-about-media" ref={mediaRef}>
                {image ? (
                  <img
                    src={image}
                    alt={`${personal?.name || 'Profile'} portrait`}
                  />
                ) : (
                  <span>{getInitials(personal?.name)}</span>
                )}
              </div>
            </div>
            {personal?.location ? (
              <p className="kinetic-about-locale">{personal.location}</p>
            ) : null}
          </div>

          <div className="kinetic-about-body">
            {copy ? (
              <div className="kinetic-about-story" data-about-reveal>
                <span className="kinetic-about-mark" data-about-mark aria-hidden="true">
                  “
                </span>
                <p className="kinetic-copy">{copy}</p>
              </div>
            ) : null}

            {rows.length > 0 ? (
              <dl className="kinetic-about-stats" data-about-meta data-kinetic-items>
                {rows.map((row) => (
                  <div key={row.label} className="kinetic-about-stat">
                    <dt>{row.label}</dt>
                    <dd>
                      {row.label === 'Mail' && personal?.email ? (
                        <a href={`mailto:${personal.email}`} data-about-mail>
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}

            {personal?.traits?.length > 0 ? (
              <div
                className="kinetic-chips kinetic-about-chips"
                data-about-chips
                data-kinetic-items
              >
                {personal.traits.map((trait) => (
                  <KineticMotionItem
                    key={trait}
                    as="span"
                    className="kinetic-chip"
                    lift={-4}
                    scale={1.05}
                  >
                    {trait}
                  </KineticMotionItem>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

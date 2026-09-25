'use client';

import { useRef } from 'react';
import {
  getGsap,
  prefersReducedMotion,
  refreshScroll,
  registerKineticGsap,
  useGSAP,
} from '../gsapSetup';

registerKineticGsap();

/**
 * 3D Specular Orbs with calibrated parallax depth.
 * Calibrated so reading zone stays clear while creating immersive depth.
 */
const ORBS = [
  { id: 'a', className: 'is-coral is-lg', style: { top: '6%', left: '80%' }, y: 460, x: -110, rotate: 54, scale: 1.26 },
  { id: 'b', className: 'is-mist is-md', style: { top: '48%', left: '86%' }, y: -380, x: -80, rotate: -72, scale: 0.92 },
  { id: 'c', className: 'is-navy is-sm', style: { top: '74%', left: '72%' }, y: -300, x: 70, rotate: 80, scale: 1.22 },
  { id: 'd', className: 'is-coral is-xs', style: { top: '16%', left: '62%' }, y: 260, x: 50, rotate: -32, scale: 1.15 },
  { id: 'e', className: 'is-mist is-sm', style: { top: '84%', left: '6%' }, y: -220, x: 90, rotate: 42, scale: 1.08 },
  { id: 'f', className: 'is-cyber is-md', style: { top: '28%', left: '90%' }, y: 320, x: -60, rotate: 60, scale: 1.1 },
  { id: 'g', className: 'is-coral is-sm', style: { top: '62%', left: '12%' }, y: -180, x: 40, rotate: -45, scale: 0.95 },
];

/** Orbital rings and geometric HUD vectors */
const RINGS = [
  { id: 'r1', className: 'is-wide', style: { top: '10%', left: '56%' }, y: 280, rotate: 160 },
  { id: 'r2', className: 'is-tall', style: { top: '48%', left: '76%' }, y: -340, rotate: -140 },
  { id: 'r3', className: 'is-soft', style: { top: '68%', left: '-3%' }, y: 200, rotate: 85 },
  { id: 'r4', className: 'is-hud', style: { top: '32%', left: '70%' }, y: -160, rotate: 120 },
];

/** Floating kinetic coordinate crosshair markers */
const HUD_MARKERS = [
  { id: 'h1', symbol: '+', style: { top: '14%', left: '42%' }, y: 140, speed: 0.8 },
  { id: 'h2', symbol: '// 0.84', style: { top: '38%', left: '88%' }, y: -220, speed: 1.1 },
  { id: 'h3', symbol: '✦', style: { top: '72%', left: '48%' }, y: 180, speed: 0.9 },
  { id: 'h4', symbol: '+', style: { top: '82%', left: '28%' }, y: -140, speed: 1.2 },
];

/**
 * Layered GSAP-driven aurora backdrop:
 * Multi-depth wash + drifting blobs + 3D specular orbs + HUD vectors.
 * Synchronized with ScrollTrigger scrub without background CPU thrashing.
 */
export default function KineticBackdrop() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const { gsap, ScrollTrigger } = getGsap();
      if (!root || !gsap || prefersReducedMotion()) return undefined;

      const scrollerConfig = {
        start: 0,
        end: 'max',
        scrub: true,
        invalidateOnRefresh: true,
      };

      const aurora = root.querySelector('[data-kb="aurora"]');
      const beam = root.querySelector('[data-kb="beam"]');
      const wash = root.querySelector('[data-kb="wash"]');
      const blobs = root.querySelectorAll('[data-kb-blob]');

      // 1. Fluid Aurora mesh scroll scrub
      if (aurora) {
        gsap.fromTo(
          aurora,
          { yPercent: -10, scale: 1 },
          {
            yPercent: 32,
            scale: 1.22,
            ease: 'none',
            scrollTrigger: { ...scrollerConfig, scrub: 1.25 },
          },
        );
      }

      // 2. Light beam angle morphing
      if (beam) {
        gsap.fromTo(
          beam,
          { yPercent: 0, xPercent: 0, rotate: -16 },
          {
            yPercent: 22,
            xPercent: -8,
            rotate: -6,
            ease: 'none',
            scrollTrigger: { ...scrollerConfig, scrub: 1.5 },
          },
        );
      }

      // 3. Ambient depth wash expansion
      if (wash) {
        gsap.fromTo(
          wash,
          { yPercent: -8, scale: 1 },
          {
            yPercent: 40,
            scale: 1.32,
            ease: 'none',
            scrollTrigger: { ...scrollerConfig, scrub: 1.1 },
          },
        );
      }

      // 4. Multi-directional organic floating blobs (scroll scrub)
      blobs.forEach((blob, index) => {
        const dir = index % 2 === 0 ? 1 : -1;
        gsap.to(blob, {
          yPercent: 24 * dir,
          xPercent: 10 * -dir,
          scale: 1.14 + index * 0.05,
          ease: 'none',
          scrollTrigger: {
            ...scrollerConfig,
            scrub: 0.9 + index * 0.25,
          },
        });
      });

      // 5. 3D Specular Orbs (Scroll scrub)
      root.querySelectorAll('[data-kb-orb]').forEach((orb, index) => {
        const y = Number(orb.getAttribute('data-y') || 200);
        const x = Number(orb.getAttribute('data-x') || 0);
        const rotate = Number(orb.getAttribute('data-rotate') || 0);
        const scale = Number(orb.getAttribute('data-scale') || 1);

        gsap.fromTo(
          orb,
          { y: 0, x: 0, rotate: 0, scale: 1 },
          {
            y,
            x,
            rotate,
            scale,
            ease: 'none',
            scrollTrigger: {
              ...scrollerConfig,
              scrub: 0.8 + (index % 4) * 0.25,
            },
          },
        );
      });

      // 6. Orbital geometric rings
      root.querySelectorAll('[data-kb-ring]').forEach((ring, index) => {
        const y = Number(ring.getAttribute('data-y') || 160);
        const rotate = Number(ring.getAttribute('data-rotate') || 60);

        gsap.fromTo(
          ring,
          { y: 0, rotate: 0 },
          {
            y,
            rotate,
            ease: 'none',
            scrollTrigger: {
              ...scrollerConfig,
              scrub: 1.1 + index * 0.18,
            },
          },
        );
      });

      // 7. HUD Coordinates & Crosshairs
      root.querySelectorAll('[data-kb-hud]').forEach((marker) => {
        const y = Number(marker.getAttribute('data-y') || 100);
        const speed = Number(marker.getAttribute('data-speed') || 1);

        gsap.fromTo(
          marker,
          { y: 0, opacity: 0.35 },
          {
            y,
            opacity: 0.75,
            ease: 'none',
            scrollTrigger: {
              ...scrollerConfig,
              scrub: speed,
            },
          },
        );
      });

      const t1 = window.setTimeout(() => refreshScroll(), 100);
      const t2 = window.setTimeout(() => refreshScroll(), 500);
      const onLoad = () => ScrollTrigger?.refresh?.();
      window.addEventListener('load', onLoad);

      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        window.removeEventListener('load', onLoad);
      };
    },
    { scope: rootRef },
  );

  return (
    <div className="kinetic-backdrop" ref={rootRef} aria-hidden="true">
      <div className="kinetic-backdrop-aurora" data-kb="aurora" />
      <div className="kinetic-backdrop-beam" data-kb="beam" />
      <div className="kinetic-backdrop-wash" data-kb="wash" />

      <span className="kinetic-blob is-a" data-kb-blob />
      <span className="kinetic-blob is-b" data-kb-blob />
      <span className="kinetic-blob is-c" data-kb-blob />

      <div className="kinetic-backdrop-vignette" />

      {ORBS.map((orb) => (
        <span
          key={orb.id}
          className={`kinetic-orb ${orb.className}`}
          style={orb.style}
          data-kb-orb
          data-y={orb.y}
          data-x={orb.x}
          data-rotate={orb.rotate}
          data-scale={orb.scale}
        />
      ))}

      {RINGS.map((ring) => (
        <span
          key={ring.id}
          className={`kinetic-ring ${ring.className}`}
          style={ring.style}
          data-kb-ring
          data-y={ring.y}
          data-rotate={ring.rotate}
        />
      ))}

      {HUD_MARKERS.map((marker) => (
        <span
          key={marker.id}
          className="kinetic-hud-marker"
          style={marker.style}
          data-kb-hud
          data-y={marker.y}
          data-speed={marker.speed}
        >
          {marker.symbol}
        </span>
      ))}
    </div>
  );
}

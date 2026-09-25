'use client';

import { useRef } from 'react';
import {
  getGsap,
  prefersReducedMotion,
  registerStageGsap,
  useGSAP,
} from '../gsapSetup';
import { useStageScene } from '../sceneContext';

registerStageGsap();

/**
 * Scene looks + transition style:
 * morph | wipe | burst | swirl | cascade | ribbon
 */
const SCENE_LOOKS = {
  home: {
    transition: 'morph',
    wash: { xPercent: 8, yPercent: -12, scale: 1, rotate: 0 },
    mesh: { xPercent: 0, yPercent: 0, rotate: 0, opacity: 0.55 },
    hue: 0,
    orbs: [
      { top: '6%', left: '74%', scale: 1, x: 0, y: 0, rotate: 0 },
      { top: '24%', left: '4%', scale: 1, x: 0, y: 0, rotate: 0 },
      { top: '52%', left: '86%', scale: 1, x: 0, y: 0, rotate: 0 },
      { top: '68%', left: '14%', scale: 1, x: 0, y: 0, rotate: 0 },
      { top: '82%', left: '58%', scale: 1, x: 0, y: 0, rotate: 0 },
      { top: '38%', left: '48%', scale: 1, x: 0, y: 0, rotate: 0 },
    ],
    rings: [
      { top: '10%', left: '8%', rotate: 0, scale: 1 },
      { top: '42%', left: '70%', rotate: 0, scale: 1 },
      { top: '74%', left: '6%', rotate: 0, scale: 1 },
    ],
  },
  about: {
    transition: 'wipe',
    wash: { xPercent: -18, yPercent: 8, scale: 1.22, rotate: -8 },
    mesh: { xPercent: 6, yPercent: -4, rotate: -14, opacity: 0.7 },
    hue: -28,
    orbs: [
      { top: '12%', left: '12%', scale: 1.15, x: 40, y: 20, rotate: 12 },
      { top: '18%', left: '72%', scale: 0.85, x: -30, y: 60, rotate: -8 },
      { top: '58%', left: '78%', scale: 1.2, x: -50, y: -40, rotate: 18 },
      { top: '70%', left: '28%', scale: 0.9, x: 20, y: -30, rotate: -14 },
      { top: '40%', left: '48%', scale: 1.05, x: -10, y: 40, rotate: 6 },
      { top: '84%', left: '62%', scale: 0.8, x: 30, y: -20, rotate: -10 },
    ],
    rings: [
      { top: '22%', left: '55%', rotate: 40, scale: 1.1 },
      { top: '60%', left: '8%', rotate: -50, scale: 0.9 },
      { top: '8%', left: '28%', rotate: 25, scale: 1.05 },
    ],
  },
  skills: {
    transition: 'burst',
    wash: { xPercent: 22, yPercent: 16, scale: 1.18, rotate: 10 },
    mesh: { xPercent: -8, yPercent: 6, rotate: 18, opacity: 0.62 },
    hue: 42,
    orbs: [
      { top: '8%', left: '58%', scale: 0.9, x: -20, y: 50, rotate: -20 },
      { top: '30%', left: '8%', scale: 1.25, x: 60, y: -10, rotate: 24 },
      { top: '48%', left: '70%', scale: 1.1, x: -40, y: 30, rotate: -16 },
      { top: '72%', left: '18%', scale: 0.95, x: 40, y: -50, rotate: 10 },
      { top: '16%', left: '32%', scale: 0.8, x: 10, y: 70, rotate: -6 },
      { top: '86%', left: '78%', scale: 1.15, x: -60, y: -20, rotate: 28 },
    ],
    rings: [
      { top: '14%', left: '70%', rotate: -70, scale: 1.15 },
      { top: '50%', left: '20%', rotate: 80, scale: 1 },
      { top: '78%', left: '55%', rotate: -20, scale: 0.85 },
    ],
  },
  contact: {
    transition: 'swirl',
    wash: { xPercent: -6, yPercent: 28, scale: 1.3, rotate: 4 },
    mesh: { xPercent: 4, yPercent: -10, rotate: -6, opacity: 0.78 },
    hue: -8,
    orbs: [
      { top: '10%', left: '40%', scale: 1.3, x: 0, y: 40, rotate: 30 },
      { top: '28%', left: '78%', scale: 0.75, x: -50, y: 20, rotate: -22 },
      { top: '55%', left: '10%', scale: 1.1, x: 70, y: -30, rotate: 16 },
      { top: '66%', left: '60%', scale: 1, x: -20, y: -40, rotate: -12 },
      { top: '80%', left: '30%', scale: 0.9, x: 30, y: 10, rotate: 8 },
      { top: '42%', left: '50%', scale: 1.2, x: 20, y: 50, rotate: -18 },
    ],
    rings: [
      { top: '30%', left: '12%', rotate: 110, scale: 1.2 },
      { top: '18%', left: '62%', rotate: -90, scale: 0.95 },
      { top: '68%', left: '72%', rotate: 35, scale: 1.1 },
    ],
  },
};

const DYNAMIC_SCENES = [
  {
    transition: 'cascade',
    wash: { xPercent: 14, yPercent: -6, scale: 1.16, rotate: -12 },
    mesh: { xPercent: -4, yPercent: 8, rotate: 22, opacity: 0.6 },
    hue: 18,
    orbs: [
      { top: '14%', left: '66%', scale: 1.05, x: -40, y: 30, rotate: 14 },
      { top: '26%', left: '10%', scale: 1.2, x: 50, y: 10, rotate: -10 },
      { top: '50%', left: '80%', scale: 0.85, x: -30, y: -20, rotate: 20 },
      { top: '64%', left: '22%', scale: 1.1, x: 20, y: -50, rotate: -8 },
      { top: '78%', left: '54%', scale: 0.95, x: -10, y: 20, rotate: 6 },
      { top: '36%', left: '42%', scale: 1.15, x: 40, y: 40, rotate: -16 },
    ],
    rings: [
      { top: '20%', left: '40%', rotate: 55, scale: 1.05 },
      { top: '58%', left: '68%', rotate: -100, scale: 1.15 },
      { top: '72%', left: '12%', rotate: 15, scale: 0.9 },
    ],
  },
  {
    transition: 'ribbon',
    wash: { xPercent: -22, yPercent: 20, scale: 1.24, rotate: 14 },
    mesh: { xPercent: 10, yPercent: -8, rotate: -18, opacity: 0.68 },
    hue: 55,
    orbs: [
      { top: '8%', left: '20%', scale: 0.9, x: 30, y: 60, rotate: -24 },
      { top: '22%', left: '70%', scale: 1.25, x: -40, y: -10, rotate: 18 },
      { top: '46%', left: '8%', scale: 1, x: 60, y: 20, rotate: -12 },
      { top: '70%', left: '76%', scale: 0.8, x: -50, y: -30, rotate: 22 },
      { top: '84%', left: '36%', scale: 1.1, x: 10, y: -40, rotate: -6 },
      { top: '40%', left: '50%', scale: 1.05, x: -20, y: 50, rotate: 10 },
    ],
    rings: [
      { top: '12%', left: '58%', rotate: -40, scale: 1.2 },
      { top: '48%', left: '18%', rotate: 95, scale: 0.88 },
      { top: '76%', left: '48%', rotate: -15, scale: 1.05 },
    ],
  },
  {
    transition: 'morph',
    wash: { xPercent: 6, yPercent: 12, scale: 1.12, rotate: -4 },
    mesh: { xPercent: -12, yPercent: 2, rotate: 8, opacity: 0.72 },
    hue: -45,
    orbs: [
      { top: '16%', left: '48%', scale: 1.2, x: -10, y: 30, rotate: 8 },
      { top: '28%', left: '14%', scale: 0.85, x: 40, y: -20, rotate: -14 },
      { top: '54%', left: '82%', scale: 1.15, x: -60, y: 10, rotate: 20 },
      { top: '68%', left: '8%', scale: 1, x: 50, y: -40, rotate: -18 },
      { top: '80%', left: '62%', scale: 0.9, x: -20, y: 20, rotate: 4 },
      { top: '38%', left: '34%', scale: 1.1, x: 30, y: 40, rotate: -10 },
    ],
    rings: [
      { top: '24%', left: '24%', rotate: 70, scale: 1 },
      { top: '44%', left: '72%', rotate: -60, scale: 1.1 },
      { top: '70%', left: '40%', rotate: 120, scale: 0.95 },
    ],
  },
];

const ORB_CLASSES = [
  'is-coral is-lg',
  'is-mist is-md',
  'is-navy is-sm',
  'is-coral is-xs',
  'is-mist is-lg',
  'is-coral is-sm',
];

const RING_CLASSES = ['is-wide', 'is-tall', 'is-soft'];

function resolveLook(scene) {
  if (SCENE_LOOKS[scene]) return SCENE_LOOKS[scene];
  let hash = 0;
  const key = String(scene || 'dynamic');
  for (let i = 0; i < key.length; i += 1) hash = (hash + key.charCodeAt(i) * (i + 1)) % 997;
  return DYNAMIC_SCENES[hash % DYNAMIC_SCENES.length];
}

function settleOrbs(gsap, orbs, look, duration, ease, stagger = 0.04) {
  orbs.forEach((orb, index) => {
    const target = look.orbs[index] || look.orbs[0];
    gsap.to(orb, {
      top: target.top,
      left: target.left,
      x: target.x,
      y: target.y,
      scale: target.scale,
      rotate: target.rotate || 0,
      duration,
      ease,
      overwrite: true,
      delay: index * stagger,
    });
  });
}

function settleRings(gsap, rings, look, duration, ease) {
  rings.forEach((ring, index) => {
    const target = look.rings[index] || look.rings[0];
    gsap.to(ring, {
      top: target.top,
      left: target.left,
      rotate: target.rotate,
      scale: target.scale,
      duration,
      ease,
      overwrite: true,
      delay: 0.04 + index * 0.04,
    });
  });
}

function playTransition(gsap, root, look) {
  const wash = root.querySelector('[data-kb="wash"]');
  const mesh = root.querySelector('[data-kb="mesh"]');
  const veil = root.querySelector('[data-kb="veil"]');
  const ribbons = root.querySelectorAll('[data-kb-ribbon]');
  const orbs = root.querySelectorAll('[data-kb-orb]');
  const rings = root.querySelectorAll('[data-kb-ring]');
  const reduced = prefersReducedMotion();
  const mode = reduced ? 'morph' : look.transition || 'morph';
  const duration = reduced ? 0.01 : 0.95;
  const ease = 'power2.inOut';

  gsap.set(ribbons, { clearProps: 'transform,opacity' });

  if (wash) {
    gsap.to(wash, {
      ...look.wash,
      filter: `hue-rotate(${look.hue}deg)`,
      duration: mode === 'burst' ? duration * 0.85 : duration,
      ease: mode === 'swirl' ? 'power3.inOut' : ease,
      overwrite: true,
    });
  }

  if (mesh) {
    gsap.to(mesh, {
      ...look.mesh,
      duration,
      ease: mode === 'swirl' ? 'expo.inOut' : ease,
      overwrite: true,
    });
  }

  if (mode === 'wipe' && veil) {
    gsap
      .timeline({ defaults: { overwrite: true } })
      .fromTo(
        veil,
        { opacity: 0, yPercent: 110 },
        { opacity: 0.55, yPercent: 0, duration: 0.38, ease: 'power2.in' },
      )
      .to(veil, { yPercent: -110, opacity: 0, duration: 0.55, ease: 'power2.out' });
    settleOrbs(gsap, orbs, look, duration, ease, 0.03);
    settleRings(gsap, rings, look, duration, ease);
    return;
  }

  if (mode === 'burst') {
    gsap.fromTo(
      orbs,
      { scale: 0.2, opacity: 0.35 },
      {
        scale: (i) => look.orbs[i]?.scale || 1,
        opacity: 1,
        duration: 0.7,
        stagger: 0.05,
        ease: 'back.out(1.6)',
        overwrite: true,
      },
    );
    orbs.forEach((orb, index) => {
      const target = look.orbs[index] || look.orbs[0];
      gsap.to(orb, {
        top: target.top,
        left: target.left,
        x: target.x,
        y: target.y,
        rotate: target.rotate || 0,
        duration,
        ease,
        overwrite: false,
      });
    });
    if (veil) {
      gsap.fromTo(
        veil,
        { opacity: 0.4, scale: 0.85 },
        { opacity: 0, scale: 1.2, duration: 0.75, ease: 'power1.out', overwrite: true },
      );
    }
    settleRings(gsap, rings, look, duration, 'back.out(1.2)');
    return;
  }

  if (mode === 'swirl') {
    if (mesh) {
      gsap.fromTo(
        mesh,
        { rotate: (look.mesh.rotate || 0) - 120, scale: 1.15 },
        {
          rotate: look.mesh.rotate || 0,
          scale: 1,
          xPercent: look.mesh.xPercent,
          yPercent: look.mesh.yPercent,
          opacity: look.mesh.opacity,
          duration: 1.05,
          ease: 'expo.inOut',
          overwrite: true,
        },
      );
    }
    orbs.forEach((orb, index) => {
      const target = look.orbs[index] || look.orbs[0];
      gsap.fromTo(
        orb,
        { rotate: (target.rotate || 0) - 160, scale: 0.55 },
        {
          top: target.top,
          left: target.left,
          x: target.x,
          y: target.y,
          scale: target.scale,
          rotate: target.rotate || 0,
          duration: 1,
          ease: 'power3.inOut',
          delay: index * 0.04,
          overwrite: true,
        },
      );
    });
    settleRings(gsap, rings, look, 1, 'power3.inOut');
    return;
  }

  if (mode === 'cascade') {
    orbs.forEach((orb, index) => {
      const target = look.orbs[index] || look.orbs[0];
      gsap.fromTo(
        orb,
        { y: -180, opacity: 0, scale: 0.7 },
        {
          top: target.top,
          left: target.left,
          x: target.x,
          y: target.y,
          scale: target.scale,
          rotate: target.rotate || 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power2.out',
          delay: index * 0.07,
          overwrite: true,
        },
      );
    });
    if (veil) {
      gsap.fromTo(
        veil,
        { opacity: 0.25, yPercent: -30 },
        { opacity: 0, yPercent: 20, duration: 0.8, ease: 'power1.out', overwrite: true },
      );
    }
    settleRings(gsap, rings, look, duration, ease);
    return;
  }

  if (mode === 'ribbon' && ribbons.length) {
    gsap.set(ribbons, { opacity: 0.85, xPercent: (i) => (i % 2 === 0 ? -120 : 120) });
    gsap.to(ribbons, {
      xPercent: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      overwrite: true,
    });
    gsap.to(ribbons, {
      opacity: 0,
      duration: 0.55,
      delay: 0.45,
      stagger: 0.06,
      ease: 'power1.in',
      overwrite: false,
    });
    settleOrbs(gsap, orbs, look, duration, ease, 0.05);
    settleRings(gsap, rings, look, duration, ease);
    if (veil) {
      gsap.fromTo(
        veil,
        { opacity: 0.3 },
        { opacity: 0, duration: 0.7, ease: 'power1.out', overwrite: true },
      );
    }
    return;
  }

  // morph (default)
  if (veil && !reduced) {
    gsap.fromTo(
      veil,
      { opacity: 0.32 },
      { opacity: 0, duration: 0.7, ease: 'power1.out', overwrite: true },
    );
  }
  settleOrbs(gsap, orbs, look, duration, ease);
  settleRings(gsap, rings, look, duration, ease);
}

/**
 * Ambient Iris-style backdrop with multiple scene-change transition types.
 */
export default function StageBackdrop() {
  const rootRef = useRef(null);
  const { scene } = useStageScene();
  const look = resolveLook(scene);

  useGSAP(
    () => {
      const root = rootRef.current;
      const { gsap } = getGsap();
      if (!root || !gsap) return undefined;
      playTransition(gsap, root, look);
      return undefined;
    },
    { scope: rootRef, dependencies: [scene], revertOnUpdate: false },
  );

  return (
    <div
      className="kineticstage-backdrop"
      ref={rootRef}
      aria-hidden="true"
      data-kb-transition={look.transition || 'morph'}
    >
      <div className="kineticstage-backdrop-wash" data-kb="wash" />
      <div className="kineticstage-backdrop-mesh" data-kb="mesh" />
      <div className="kineticstage-backdrop-veil" data-kb="veil" />

      <div className="kineticstage-backdrop-ribbons">
        <span className="kineticstage-ribbon is-a" data-kb-ribbon />
        <span className="kineticstage-ribbon is-b" data-kb-ribbon />
        <span className="kineticstage-ribbon is-c" data-kb-ribbon />
      </div>

      {ORB_CLASSES.map((className, index) => (
        <span
          key={`orb-${index}`}
          className={`kineticstage-orb ${className}`}
          style={{
            top: SCENE_LOOKS.home.orbs[index].top,
            left: SCENE_LOOKS.home.orbs[index].left,
          }}
          data-kb-orb
        />
      ))}

      {RING_CLASSES.map((className, index) => (
        <span
          key={`ring-${index}`}
          className={`kineticstage-ring ${className}`}
          style={{
            top: SCENE_LOOKS.home.rings[index].top,
            left: SCENE_LOOKS.home.rings[index].left,
          }}
          data-kb-ring
        />
      ))}
    </div>
  );
}

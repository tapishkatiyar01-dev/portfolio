'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

let registered = false;

export function registerStageGsap() {
  if (typeof window === 'undefined' || registered) return { gsap, ScrollTrigger, useGSAP };
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  registered = true;
  return { gsap, ScrollTrigger, useGSAP };
}

export function getGsap() {
  if (typeof window === 'undefined') return { gsap: null, ScrollTrigger: null };
  registerStageGsap();
  return { gsap, ScrollTrigger };
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function canHoverFine() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Replay-friendly ScrollTrigger defaults (play on enter, reverse on leave-back). */
const REPLAY_ACTIONS = 'play none none reverse';

/**
 * Transform-only reveal — never gates content behind opacity:0
 * so late ScrollTrigger still leave copy readable.
 * Replays when the element re-enters the viewport from above.
 */
export function revealIn(el, options = {}) {
  const { gsap: g } = getGsap();
  if (!g || !el || prefersReducedMotion()) return null;

  return g.from(el, {
    y: options.y ?? 28,
    scale: options.scale ?? 0.985,
    rotate: options.rotate ?? 0,
    duration: options.duration ?? 0.65,
    ease: options.ease ?? 'power2.out',
    overwrite: 'auto',
    scrollTrigger: {
      trigger: options.trigger || el,
      start: options.start ?? 'top 88%',
      toggleActions: options.toggleActions ?? REPLAY_ACTIONS,
      invalidateOnRefresh: true,
    },
  });
}

/**
 * Choreographed section entrance when a plane enters the viewport.
 * Animates [data-reveal] children when present; otherwise the plane itself.
 * Replays on scroll-back via toggleActions reverse.
 */
export function revealSection(plane, options = {}) {
  const { gsap: g } = getGsap();
  if (!g || !plane || prefersReducedMotion()) return null;

  const start = options.start ?? 'top 86%';
  const parts = Array.from(plane.querySelectorAll('[data-reveal]')).filter(
    (node) => !node.closest('[data-ks-items]'),
  );

  const tl = g.timeline({
    defaults: { ease: 'power2.out', overwrite: 'auto' },
    scrollTrigger: {
      trigger: plane,
      start,
      toggleActions: options.toggleActions ?? REPLAY_ACTIONS,
      invalidateOnRefresh: true,
      refreshPriority: options.refreshPriority ?? 0,
    },
  });

  if (parts.length) {
    tl.from(parts, {
      y: options.childY ?? 28,
      scale: options.childScale ?? 0.985,
      duration: options.duration ?? 0.6,
      stagger: options.stagger ?? 0.07,
    });
  } else {
    tl.from(plane, {
      y: options.y ?? 36,
      scale: options.scale ?? 0.985,
      duration: options.duration ?? 0.7,
    });
  }

  return tl;
}

/**
 * Per-item viewport reveals (batch). Each item animates when *it* enters view,
 * and reverses when scrolled past upward — smooth replay.
 */
export function revealItems(container, childSelector, options = {}) {
  const { gsap: g, ScrollTrigger } = getGsap();
  if (!g || !ScrollTrigger || !container || prefersReducedMotion()) return null;

  const children = Array.from(container.querySelectorAll(childSelector));
  if (!children.length) return null;

  const y = options.y ?? 28;
  const x = options.x ?? 0;
  const scale = options.scale ?? 0.985;
  const rotate = options.rotate ?? 0;
  const duration = options.duration ?? 0.55;
  const ease = options.ease ?? 'power2.out';
  const start = options.start ?? 'top 92%';

  g.set(children, { y, x, scale, rotate, force3D: true });

  const triggers = ScrollTrigger.batch(children, {
    start,
    interval: 0.08,
    batchMax: options.batchMax ?? 6,
    onEnter: (batch) =>
      g.to(batch, {
        y: 0,
        x: 0,
        scale: 1,
        rotate: 0,
        duration,
        stagger: options.stagger ?? 0.06,
        ease,
        overwrite: true,
        force3D: true,
      }),
    onEnterBack: (batch) =>
      g.to(batch, {
        y: 0,
        x: 0,
        scale: 1,
        rotate: 0,
        duration: duration * 0.85,
        stagger: (options.stagger ?? 0.06) * 0.7,
        ease,
        overwrite: true,
        force3D: true,
      }),
    onLeaveBack: (batch) =>
      g.to(batch, {
        y,
        x,
        scale,
        rotate,
        duration: 0.35,
        stagger: 0.03,
        ease: 'power1.in',
        overwrite: true,
        force3D: true,
      }),
  });

  return {
    triggers,
    kill() {
      triggers?.forEach((st) => st.kill());
      g.set(children, { clearProps: 'transform' });
    },
  };
}

/** @deprecated Prefer revealItems for per-item viewport motion. */
export function revealChildren(container, childSelector, options = {}) {
  return revealItems(container, childSelector, options);
}

/** Magnetic pull for desktop pointer; no-ops on coarse touch. */
export function attachMagnetic(el, strength = 0.28) {
  const { gsap: g } = getGsap();
  if (!g || !el || prefersReducedMotion() || !canHoverFine()) return () => {};

  const xTo = g.quickTo(el, 'x', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });
  const yTo = g.quickTo(el, 'y', { duration: 0.4, ease: 'elastic.out(1, 0.4)' });

  const onMove = (event) => {
    const rect = el.getBoundingClientRect();
    xTo((event.clientX - rect.left - rect.width / 2) * strength);
    yTo((event.clientY - rect.top - rect.height / 2) * strength);
  };
  const onLeave = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener('mousemove', onMove);
  el.addEventListener('mouseleave', onLeave);

  return () => {
    el.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
    g.set(el, { x: 0, y: 0 });
  };
}

/**
 * Hover lift + touch press feedback (transform only).
 * Uses pointerenter/leave so mouse + pen work; pointerdown/up for touch.
 */
export function attachHoverLift(el, options = {}) {
  const { gsap: g } = getGsap();
  if (!g || !el || prefersReducedMotion()) return () => {};

  const lift = options.y ?? -8;
  const scale = options.scale ?? 1.02;
  const duration = options.duration ?? 0.28;

  const enter = () => {
    g.to(el, { y: lift, scale, duration, ease: 'power2.out', overwrite: 'auto' });
    el.classList.add('is-hot');
  };
  const leave = () => {
    g.to(el, { y: 0, scale: 1, duration, ease: 'power2.out', overwrite: 'auto' });
    el.classList.remove('is-hot', 'is-pressed');
  };
  const down = () => {
    g.to(el, {
      y: lift * 0.4,
      scale: 0.98,
      duration: 0.14,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    el.classList.add('is-pressed');
  };
  const up = (event) => {
    el.classList.remove('is-pressed');
    if (event?.pointerType === 'touch') {
      leave();
      return;
    }
    if (el.matches(':hover')) enter();
    else leave();
  };

  el.addEventListener('pointerenter', enter);
  el.addEventListener('pointerleave', leave);
  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', leave);

  return () => {
    el.removeEventListener('pointerenter', enter);
    el.removeEventListener('pointerleave', leave);
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointercancel', leave);
    el.classList.remove('is-hot', 'is-pressed');
    g.set(el, { y: 0, scale: 1 });
  };
}

/**
 * Pointer / touch tilt on a surface.
 */
export function attachPointerTilt(el, options = {}) {
  const { gsap: g } = getGsap();
  if (!g || !el || prefersReducedMotion()) return () => {};

  const max = options.max ?? 8;
  const rotX = g.quickTo(el, 'rotateX', { duration: 0.35, ease: 'power3.out' });
  const rotY = g.quickTo(el, 'rotateY', { duration: 0.35, ease: 'power3.out' });

  const apply = (clientX, clientY) => {
    const rect = el.getBoundingClientRect();
    const nx = (clientX - rect.left) / rect.width - 0.5;
    const ny = (clientY - rect.top) / rect.height - 0.5;
    rotY(nx * max * 2);
    rotX(-ny * max * 2);
  };

  const reset = () => {
    rotX(0);
    rotY(0);
  };

  const onPointerMove = (event) => {
    if (event.pointerType === 'touch' && !event.isPrimary) return;
    apply(event.clientX, event.clientY);
  };

  el.style.transformStyle = 'preserve-3d';
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerleave', reset);
  el.addEventListener('pointercancel', reset);
  el.addEventListener('pointerup', reset);

  return () => {
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerleave', reset);
    el.removeEventListener('pointercancel', reset);
    el.removeEventListener('pointerup', reset);
    g.set(el, { rotateX: 0, rotateY: 0 });
  };
}

export function attachPressInvert(el) {
  if (!el || prefersReducedMotion()) return () => {};

  const down = () => el.classList.add('is-pressed');
  const up = () => el.classList.remove('is-pressed');

  el.addEventListener('pointerdown', down);
  el.addEventListener('pointerup', up);
  el.addEventListener('pointerleave', up);
  el.addEventListener('pointercancel', up);

  return () => {
    el.removeEventListener('pointerdown', down);
    el.removeEventListener('pointerup', up);
    el.removeEventListener('pointerleave', up);
    el.removeEventListener('pointercancel', up);
    el.classList.remove('is-pressed');
  };
}

/** Bind hover lift + optional light tap on a list of nodes. */
export function bindItemMotion(nodes, options = {}) {
  const cleanups = [];
  Array.from(nodes || []).forEach((node) => {
    cleanups.push(attachHoverLift(node, options));
    if (options.tap) {
      const onDown = () => lightTap();
      node.addEventListener('pointerdown', onDown);
      cleanups.push(() => node.removeEventListener('pointerdown', onDown));
    }
  });
  return () => cleanups.forEach((fn) => fn?.());
}

export function lightTap() {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try {
      navigator.vibrate(8);
    } catch {
      /* ignore */
    }
  }
}

export function refreshScroll() {
  const { ScrollTrigger: ST } = getGsap();
  ST?.refresh?.();
}

export { useGSAP };

/**
 * Motion-design tokens for Kinetic / Kinetic Stage heroes & about.
 * Decision tree → GSAP:
 * - Viewport enter/exit → expo.out / power4.out (ease-out family)
 * - Role text morph → power2.inOut (ease-in-out-cubic), ~240ms
 * - Scrub parallax → none (linear)
 * - Hover / press → power1.out / power2.out, 120–240ms
 * - Never scale from 0 — use 0.94–0.98
 * - Exits faster than enters (reverseTimeScale)
 * - No infinite decorative loops (a11y)
 */
export const HERO_MOTION = {
  ease: {
    enter: 'expo.out',
    enterSoft: 'power4.out',
    morph: 'power2.inOut',
    scrub: 'none',
    press: 'power1.out',
    hover: 'power2.out',
  },
  dur: {
    micro: 0.12,
    short: 0.18,
    mid: 0.24,
    long: 0.3,
    brand: 0.55,
    visual: 0.48,
    role: 0.24,
  },
  scale: {
    large: 0.95,
    medium: 0.96,
    small: 0.97,
    glow: 0.94,
  },
  travel: {
    mobile: { title: 42, copy: 10, visual: 16, float: 10 },
    desktop: { title: 52, copy: 12, visual: 22, float: 14 },
  },
  reverseTimeScale: 1.4,
};

export const ABOUT_MOTION = {
  ease: {
    enter: HERO_MOTION.ease.enterSoft,
    morph: HERO_MOTION.ease.morph,
    scrub: HERO_MOTION.ease.scrub,
    hover: HERO_MOTION.ease.hover,
  },
  dur: {
    micro: HERO_MOTION.dur.micro,
    short: HERO_MOTION.dur.short,
    mid: HERO_MOTION.dur.mid,
    long: HERO_MOTION.dur.long,
    section: 0.5,
  },
  travel: { copy: 14, meta: 12, chip: 10 },
  scale: { section: 0.97, meta: 0.98, chip: 0.97 },
};

export const KINETIC_EASE = {
  enter: HERO_MOTION.ease.enterSoft,
  snap: HERO_MOTION.ease.press,
  elastic: 'elastic.out(1, 0.45)',
  scrub: HERO_MOTION.ease.scrub,
};

export const KINETIC_DUR = {
  micro: HERO_MOTION.dur.micro,
  short: HERO_MOTION.dur.short,
  mid: HERO_MOTION.dur.mid,
  long: HERO_MOTION.dur.long,
};

export const KINETIC_SCROLL = {
  revealStart: 'top 88%',
  batchStart: 'top 90%',
  pinEnd: '+=120%',
};

/** Build paused entrance timeline (transform-only). */
export function buildHeroEntranceTimeline(gsap, { isDesktop, isMobile }) {
  const m = HERO_MOTION;
  const travel = isMobile ? m.travel.mobile : m.travel.desktop;
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: m.ease.enterSoft, overwrite: 'auto' },
  });

  if (isMobile) {
    tl.from('[data-k="visual"]', {
      y: travel.visual,
      scale: m.scale.large,
      duration: m.dur.visual,
      ease: m.ease.enter,
    }, 0)
      .from('[data-k="glow"]', {
        scale: m.scale.glow,
        duration: m.dur.visual,
        ease: m.ease.enterSoft,
      }, 0)
      .from('[data-k="eyebrow"]', { y: travel.copy, duration: m.dur.mid }, 0.06)
      .from('[data-k="title"]', {
        yPercent: travel.title,
        duration: m.dur.brand,
        ease: m.ease.enter,
      }, 0.1)
      .from('[data-k="role"]', { y: travel.copy, duration: m.dur.mid }, 0.22)
      .from('[data-k="summary"]', { y: travel.copy, duration: m.dur.mid }, 0.28)
      .from('[data-k="action"]', {
        y: travel.copy,
        scale: m.scale.small,
        stagger: 0.04,
        duration: m.dur.long,
      }, 0.32)
      .from('[data-k="stat"]', {
        y: travel.copy,
        stagger: 0.03,
        duration: m.dur.mid,
      }, 0.4)
      .from('[data-k="marquee"]', { y: travel.copy, duration: m.dur.mid }, 0.46);
  }

  if (isDesktop) {
    tl.from('[data-k="eyebrow"]', { y: travel.copy, duration: m.dur.mid }, 0)
      .from('[data-k="title"]', {
        yPercent: travel.title,
        duration: m.dur.brand,
        ease: m.ease.enter,
      }, 0.05)
      .from('[data-k="role"]', { y: travel.copy, duration: m.dur.mid }, 0.18)
      .from('[data-k="summary"]', { y: travel.copy, duration: m.dur.mid }, 0.24)
      .from('[data-k="action"]', {
        y: travel.copy,
        scale: m.scale.small,
        stagger: 0.045,
        duration: m.dur.long,
      }, 0.28)
      .from('[data-k="visual"]', {
        y: travel.visual,
        scale: m.scale.large,
        duration: m.dur.visual,
        ease: m.ease.enter,
      }, 0.08)
      .from('[data-k="glow"]', {
        scale: m.scale.glow,
        duration: m.dur.visual,
        ease: m.ease.enterSoft,
      }, 0.06)
      .from('[data-k-float]', {
        scale: m.scale.medium,
        y: travel.float,
        stagger: 0.05,
        duration: m.dur.long,
      }, 0.22)
      .from('[data-k="stat"]', {
        y: travel.copy,
        stagger: 0.035,
        duration: m.dur.mid,
      }, 0.38)
      .from('[data-k="marquee"]', { y: travel.copy, duration: m.dur.mid }, 0.44);
  }

  return tl;
}

/** Play on enter; reverse faster on leave-back. */
export function bindHeroEntranceTrigger(ScrollTrigger, timeline, root) {
  if (!ScrollTrigger || !timeline || !root) return null;

  return ScrollTrigger.create({
    trigger: root,
    start: 'top 82%',
    invalidateOnRefresh: true,
    onEnter: () => timeline.timeScale(1).play(),
    onEnterBack: () => timeline.timeScale(1).play(),
    onLeaveBack: () => timeline.timeScale(HERO_MOTION.reverseTimeScale).reverse(),
  });
}

/** Linear scrub parallax for decorative layers only. */
export function bindHeroParallax(gsap, { root, stage, visual, media, isDesktop, isMobile }) {
  if (!gsap || !root) return [];

  const tweens = [];
  const scrubSoft = isMobile ? 1 : 0.85;
  const scrubDeep = isMobile ? 1.1 : 1.15;

  if (media) {
    tweens.push(
      gsap.to(media, {
        yPercent: isMobile ? 6 : -5,
        scale: isDesktop ? 1.03 : 1,
        ease: HERO_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: scrubDeep,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  if (visual && isDesktop) {
    tweens.push(
      gsap.to(visual, {
        yPercent: 12,
        ease: HERO_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: scrubSoft,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  root.querySelectorAll('[data-k-float]').forEach((node, i) => {
    const amp = isMobile ? 1 : 1.8;
    tweens.push(
      gsap.to(node, {
        y: (i % 2 === 0 ? -28 : 32) * amp,
        x: (i % 2 === 0 ? 14 : -16) * amp,
        rotate: isDesktop ? (i % 2 === 0 ? 18 : -22) : 0,
        ease: HERO_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: scrubSoft + i * 0.12,
          invalidateOnRefresh: true,
        },
      }),
    );
  });

  const glow = root.querySelector('[data-k="glow"]');
  if (glow && isDesktop && stage) {
    tweens.push(
      gsap.to(glow, {
        scale: 1.12,
        xPercent: -4,
        ease: HERO_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  return tweens;
}

/**
 * Pointer interactions for hero: glow bloom on visual hover,
 * float hover lift, secondary CTA magnetic pull (clamped).
 */
export function bindHeroInteractions(gsap, {
  root,
  visual,
  attachMagnetic,
  attachHoverLift,
  bindItemMotion,
}) {
  if (!gsap || !root) return () => {};

  const cleanups = [];
  const glow = root.querySelector('[data-k="glow"]');
  const actions = root.querySelectorAll('[data-k="action"]');
  const secondary = actions.length > 1 ? actions[1] : null;

  if (visual && glow) {
    const enter = () => {
      gsap.to(glow, {
        scale: 1.08,
        duration: HERO_MOTION.dur.mid,
        ease: HERO_MOTION.ease.hover,
        overwrite: 'auto',
      });
      gsap.to(visual, {
        scale: 1.015,
        duration: HERO_MOTION.dur.short,
        ease: HERO_MOTION.ease.hover,
        overwrite: 'auto',
      });
    };
    const leave = () => {
      gsap.to(glow, {
        scale: 1,
        duration: HERO_MOTION.dur.short,
        ease: HERO_MOTION.ease.press,
        overwrite: 'auto',
      });
      gsap.to(visual, {
        scale: 1,
        duration: HERO_MOTION.dur.short,
        ease: HERO_MOTION.ease.press,
        overwrite: 'auto',
      });
    };
    visual.addEventListener('pointerenter', enter);
    visual.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      visual.removeEventListener('pointerenter', enter);
      visual.removeEventListener('pointerleave', leave);
      gsap.set([glow, visual], { scale: 1 });
    });
  }

  if (typeof bindItemMotion === 'function') {
    cleanups.push(
      bindItemMotion(root.querySelectorAll('[data-k-float]'), {
        y: -6,
        scale: 1.06,
        duration: HERO_MOTION.dur.short,
        tap: false,
      }),
    );
  }

  if (secondary && typeof attachMagnetic === 'function') {
    cleanups.push(attachMagnetic(secondary, 0.16));
  }
  if (secondary && typeof attachHoverLift === 'function') {
    cleanups.push(
      attachHoverLift(secondary, {
        y: -3,
        scale: 1.02,
        duration: HERO_MOTION.dur.short,
      }),
    );
  }

  const title = root.querySelector('[data-k="title"]');
  if (title) {
    const tween = gsap.to(title, {
      letterSpacing: '0.02em',
      ease: HERO_MOTION.ease.scrub,
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.9,
        invalidateOnRefresh: true,
      },
    });
    cleanups.push(() => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
  }

  return () => cleanups.forEach((fn) => fn?.());
}

/** Role headline swap — on-screen morph. */
export function animateHeroRoleSwap(gsap, el) {
  if (!gsap || !el) return null;
  return gsap.fromTo(
    el,
    { y: 12 },
    {
      y: 0,
      duration: HERO_MOTION.dur.role,
      ease: HERO_MOTION.ease.morph,
      overwrite: 'auto',
    },
  );
}

/** About section entrance timeline. */
export function buildAboutEntranceTimeline(gsap, root) {
  const m = ABOUT_MOTION;
  const revealEls = root.querySelectorAll('[data-about-reveal]');
  return gsap.timeline({
    defaults: { ease: m.ease.enter, overwrite: 'auto' },
    scrollTrigger: {
      trigger: root,
      start: 'top 84%',
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true,
    },
  }).from(revealEls, {
    y: m.travel.copy + 8,
    scale: m.scale.section,
    duration: m.dur.section,
    stagger: 0.07,
  });
}

export function bindAboutParallax(gsap, { root, media, frame }) {
  if (!gsap || !root) return [];
  const tweens = [];

  if (media) {
    tweens.push(
      gsap.to(media, {
        yPercent: 8,
        ease: ABOUT_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  const ring = root.querySelector('[data-about-ring]');
  if (ring) {
    tweens.push(
      gsap.to(ring, {
        rotate: 28,
        ease: ABOUT_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  const orb = root.querySelector('[data-about-orb]');
  if (orb) {
    tweens.push(
      gsap.to(orb, {
        yPercent: -18,
        scale: 1.08,
        ease: ABOUT_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  const mark = root.querySelector('[data-about-mark]');
  if (mark) {
    tweens.push(
      gsap.fromTo(
        mark,
        { scale: 0.92, y: 10 },
        {
          scale: 1.06,
          y: -6,
          ease: ABOUT_MOTION.ease.scrub,
          scrollTrigger: {
            trigger: mark,
            start: 'top 90%',
            end: 'top 40%',
            scrub: 0.75,
            invalidateOnRefresh: true,
          },
        },
      ),
    );
  }

  if (frame) {
    tweens.push(
      gsap.to(frame, {
        y: -10,
        ease: ABOUT_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          end: 'bottom top',
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  return tweens;
}

export function bindAboutInteractions(gsap, {
  root,
  frame,
  attachMagnetic,
  bindItemMotion,
  revealItems,
  metaSelector,
  chipSelector,
}) {
  if (!gsap || !root) return { cleanups: [], batches: [] };

  const cleanups = [];
  const batches = [];
  const orb = root.querySelector('[data-about-orb]');

  if (frame && orb) {
    const enter = () => {
      gsap.to(orb, {
        scale: 1.12,
        duration: ABOUT_MOTION.dur.mid,
        ease: ABOUT_MOTION.ease.hover,
        overwrite: 'auto',
      });
    };
    const leave = () => {
      gsap.to(orb, {
        scale: 1,
        duration: ABOUT_MOTION.dur.short,
        ease: ABOUT_MOTION.ease.hover,
        overwrite: 'auto',
      });
    };
    frame.addEventListener('pointerenter', enter);
    frame.addEventListener('pointerleave', leave);
    cleanups.push(() => {
      frame.removeEventListener('pointerenter', enter);
      frame.removeEventListener('pointerleave', leave);
      gsap.set(orb, { scale: 1 });
    });
  }

  const mail = root.querySelector('[data-about-mail]');
  if (mail && typeof attachMagnetic === 'function') {
    cleanups.push(attachMagnetic(mail, 0.2));
  }

  if (typeof bindItemMotion === 'function' && metaSelector) {
    cleanups.push(
      bindItemMotion(root.querySelectorAll(metaSelector), {
        y: -4,
        scale: 1.015,
        duration: ABOUT_MOTION.dur.short,
        tap: true,
      }),
    );
  }

  if (typeof revealItems === 'function') {
    const metaRoot = root.querySelector('[data-about-meta]');
    if (metaRoot && metaSelector) {
      const batch = revealItems(metaRoot, metaSelector, {
        y: ABOUT_MOTION.travel.meta,
        scale: ABOUT_MOTION.scale.meta,
        stagger: 0.04,
        start: 'top 92%',
        duration: ABOUT_MOTION.dur.mid,
      });
      if (batch) batches.push(batch);
    }

    const chipsRoot = root.querySelector('[data-about-chips]');
    if (chipsRoot && chipSelector) {
      const batch = revealItems(chipsRoot, chipSelector, {
        y: ABOUT_MOTION.travel.chip,
        scale: ABOUT_MOTION.scale.chip,
        stagger: 0.035,
        start: 'top 94%',
        duration: ABOUT_MOTION.dur.mid,
      });
      if (batch) batches.push(batch);
    }
  }

  return { cleanups, batches };
}

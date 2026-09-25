/**
 * Motion-design tokens for Kinetic.
 * DESIGN_VARIANCE 8 · MOTION_INTENSITY 8 · VISUAL_DENSITY 4
 *
 * Grounded in GSAP ScrollTrigger best practices (https://gsap.com/scroll/):
 * - Viewport enter/exit → expo.out / power4.out
 * - Role / char morph → power2.inOut / power3.out
 * - Scrub parallax → none (linear for 1:1 scroll synchronization)
 * - Hover / press → power2.out / elastic.out, 120–280ms
 * - Never scale from 0 — use 0.94–0.98 for subtle physical presence
 * - Exits faster than enters (reverseTimeScale)
 */
export const HERO_MOTION = {
  ease: {
    enter: 'expo.out',
    enterSoft: 'power4.out',
    morph: 'power2.inOut',
    scrub: 'none',
    press: 'power1.out',
    hover: 'power2.out',
    elastic: 'elastic.out(1, 0.4)',
  },
  dur: {
    micro: 0.12,
    short: 0.18,
    mid: 0.28,
    long: 0.42,
    brand: 0.72,
    visual: 0.58,
    role: 0.28,
    char: 0.55,
  },
  scale: {
    large: 0.94,
    medium: 0.96,
    small: 0.97,
    glow: 0.92,
  },
  travel: {
    mobile: { title: 110, copy: 18, visual: 28, float: 16, char: 48 },
    desktop: { title: 120, copy: 22, visual: 36, float: 22, char: 64 },
  },
  reverseTimeScale: 1.55,
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
    section: 0.58,
  },
  travel: { copy: 22, meta: 16, chip: 12 },
  scale: { section: 0.97, meta: 0.98, chip: 0.97 },
};

export const KINETIC_EASE = {
  enter: HERO_MOTION.ease.enterSoft,
  snap: HERO_MOTION.ease.press,
  elastic: HERO_MOTION.ease.elastic,
  scrub: HERO_MOTION.ease.scrub,
};

export const KINETIC_DUR = {
  micro: HERO_MOTION.dur.micro,
  short: HERO_MOTION.dur.short,
  mid: HERO_MOTION.dur.mid,
  long: HERO_MOTION.dur.long,
};

export const KINETIC_SCROLL = {
  revealStart: 'top 86%',
  batchStart: 'top 90%',
  pinEnd: '+=140%',
};

/** Build paused entrance timeline — char stagger + layered reveals. */
export function buildHeroEntranceTimeline(gsap, { isDesktop, isMobile }) {
  const m = HERO_MOTION;
  const travel = isMobile ? m.travel.mobile : m.travel.desktop;
  const tl = gsap.timeline({
    paused: true,
    defaults: { ease: m.ease.enterSoft, overwrite: 'auto' },
  });

  const chars = gsap.utils.toArray('[data-k-char]');
  const hasChars = chars.length > 0;

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
      .from('[data-k="eyebrow"]', { y: travel.copy, duration: m.dur.mid }, 0.05);

    if (hasChars) {
      tl.from(chars, {
        yPercent: travel.char,
        rotate: 8,
        stagger: 0.028,
        duration: m.dur.char,
        ease: m.ease.enter,
      }, 0.1);
    } else {
      tl.from('[data-k="title"]', {
        yPercent: travel.title,
        duration: m.dur.brand,
        ease: m.ease.enter,
      }, 0.1);
    }

    tl.from('[data-k="role"]', { y: travel.copy, duration: m.dur.mid }, 0.26)
      .from('[data-k="summary"]', { y: travel.copy, duration: m.dur.mid }, 0.34)
      .from('[data-k="action"]', {
        y: travel.copy,
        scale: m.scale.small,
        stagger: 0.05,
        duration: m.dur.long,
      }, 0.4)
      .from('[data-k="stat"]', {
        y: travel.copy,
        stagger: 0.04,
        duration: m.dur.mid,
      }, 0.48)
      .from('[data-k="marquee"]', { y: travel.copy, duration: m.dur.mid }, 0.54);
  }

  if (isDesktop) {
    tl.from('[data-k="eyebrow"]', { y: travel.copy, duration: m.dur.mid }, 0);

    if (hasChars) {
      tl.from(chars, {
        yPercent: travel.char,
        rotate: 6,
        stagger: 0.022,
        duration: m.dur.char,
        ease: m.ease.enter,
      }, 0.06);
    } else {
      tl.from('[data-k="title"]', {
        yPercent: travel.title,
        duration: m.dur.brand,
        ease: m.ease.enter,
      }, 0.06);
    }

    tl.from('[data-k="role"]', { y: travel.copy, duration: m.dur.mid }, 0.22)
      .from('[data-k="summary"]', { y: travel.copy, duration: m.dur.mid }, 0.28)
      .from('[data-k="action"]', {
        y: travel.copy,
        scale: m.scale.small,
        stagger: 0.05,
        duration: m.dur.long,
      }, 0.34)
      .from('[data-k="visual"]', {
        y: travel.visual,
        x: 40,
        scale: m.scale.large,
        duration: m.dur.visual,
        ease: m.ease.enter,
      }, 0.1)
      .from('[data-k="glow"]', {
        scale: m.scale.glow,
        duration: m.dur.visual,
        ease: m.ease.enterSoft,
      }, 0.08)
      .from('[data-k-float]', {
        scale: m.scale.medium,
        y: travel.float,
        stagger: 0.06,
        duration: m.dur.long,
      }, 0.26)
      .from('[data-k="stat"]', {
        y: travel.copy,
        stagger: 0.04,
        duration: m.dur.mid,
      }, 0.46)
      .from('[data-k="marquee"]', { y: travel.copy, duration: m.dur.mid }, 0.52);
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

/** Linear scrub parallax for multi-layer depth (GSAP ScrollTrigger). */
export function bindHeroParallax(gsap, { root, stage, visual, media, isDesktop, isMobile }) {
  if (!gsap || !root) return [];

  const tweens = [];
  const scrubSoft = isMobile ? 1 : 0.75;
  const scrubDeep = isMobile ? 1.1 : 1.05;

  if (media) {
    tweens.push(
      gsap.to(media, {
        yPercent: isMobile ? 8 : -10,
        scale: isDesktop ? 1.08 : 1,
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
        yPercent: 18,
        rotate: -2,
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
    const amp = isMobile ? 1.2 : 2.4;
    tweens.push(
      gsap.to(node, {
        y: (i % 2 === 0 ? -42 : 48) * amp,
        x: (i % 2 === 0 ? 22 : -26) * amp,
        rotate: isDesktop ? (i % 2 === 0 ? 32 : -36) : 0,
        ease: HERO_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: scrubSoft + i * 0.14,
          invalidateOnRefresh: true,
        },
      }),
    );
  });

  const rings = root.querySelectorAll('.kinetic-hero-ring');
  rings.forEach((ring, i) => {
    tweens.push(
      gsap.to(ring, {
        rotate: i === 0 ? 45 : -40,
        scale: 1.12,
        ease: HERO_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 1 + i * 0.2,
          invalidateOnRefresh: true,
        },
      }),
    );
  });

  const glow = root.querySelector('[data-k="glow"]');
  if (glow && isDesktop && stage) {
    tweens.push(
      gsap.to(glow, {
        scale: 1.25,
        xPercent: -10,
        ease: HERO_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  return tweens;
}

/**
 * Pointer interactions: glow bloom, float lift, organic idle floating loops.
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

  // Floating idle loop for hero satellites
  const floats = root.querySelectorAll('[data-k-float]');
  floats.forEach((node, i) => {
    const floatTween = gsap.to(node, {
      y: `+=${10 + i * 4}`,
      x: `+=${(i % 2 === 0 ? 1 : -1) * (8 + i * 2)}`,
      rotation: `+=${(i % 2 === 0 ? 1 : -1) * 10}`,
      duration: 4.5 + i * 0.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    cleanups.push(() => floatTween.kill());
  });

  if (visual && glow) {
    const enter = () => {
      gsap.to(glow, {
        scale: 1.14,
        duration: HERO_MOTION.dur.mid,
        ease: HERO_MOTION.ease.hover,
        overwrite: 'auto',
      });
      gsap.to(visual, {
        scale: 1.025,
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
        y: -8,
        scale: 1.08,
        duration: HERO_MOTION.dur.short,
        tap: false,
      }),
    );
  }

  if (secondary && typeof attachMagnetic === 'function') {
    cleanups.push(attachMagnetic(secondary, 0.2));
  }
  if (secondary && typeof attachHoverLift === 'function') {
    cleanups.push(
      attachHoverLift(secondary, {
        y: -4,
        scale: 1.025,
        duration: HERO_MOTION.dur.short,
      }),
    );
  }

  return () => cleanups.forEach((fn) => fn?.());
}

/** Role headline swap — vertical morph. */
export function animateHeroRoleSwap(gsap, el) {
  if (!gsap || !el) return null;
  return gsap.fromTo(
    el,
    { y: 18, rotateX: -28 },
    {
      y: 0,
      rotateX: 0,
      duration: HERO_MOTION.dur.role,
      ease: HERO_MOTION.ease.morph,
      overwrite: 'auto',
      transformPerspective: 600,
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
      start: 'top 82%',
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true,
    },
  }).from(revealEls, {
    y: m.travel.copy + 10,
    scale: m.scale.section,
    duration: m.dur.section,
    stagger: 0.08,
  });
}

export function bindAboutParallax(gsap, { root, media, frame }) {
  if (!gsap || !root) return [];
  const tweens = [];

  if (media) {
    tweens.push(
      gsap.to(media, {
        yPercent: 12,
        ease: ABOUT_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.85,
          invalidateOnRefresh: true,
        },
      }),
    );
  }

  const ring = root.querySelector('[data-about-ring]');
  if (ring) {
    tweens.push(
      gsap.to(ring, {
        rotate: 48,
        scale: 1.1,
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
        yPercent: -28,
        scale: 1.18,
        ease: ABOUT_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.15,
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
        { scale: 0.88, y: 16 },
        {
          scale: 1.12,
          y: -12,
          ease: ABOUT_MOTION.ease.scrub,
          scrollTrigger: {
            trigger: mark,
            start: 'top 90%',
            end: 'top 35%',
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        },
      ),
    );
  }

  if (frame) {
    tweens.push(
      gsap.to(frame, {
        y: -16,
        ease: ABOUT_MOTION.ease.scrub,
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          end: 'bottom top',
          scrub: 0.8,
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
        scale: 1.18,
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
    cleanups.push(attachMagnetic(mail, 0.24));
  }

  if (typeof bindItemMotion === 'function' && metaSelector) {
    cleanups.push(
      bindItemMotion(root.querySelectorAll(metaSelector), {
        y: -5,
        scale: 1.02,
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
        stagger: 0.05,
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
        stagger: 0.04,
        start: 'top 94%',
        duration: ABOUT_MOTION.dur.mid,
      });
      if (batch) batches.push(batch);
    }
  }

  return { cleanups, batches };
}

/** Header compresses slightly while scrolling. */
export function bindHeaderScroll(gsap, header) {
  if (!gsap || !header) return null;
  return gsap.to(header, {
    paddingTop: 10,
    paddingBottom: 8,
    ease: 'none',
    scrollTrigger: {
      start: 0,
      end: 180,
      scrub: 0.4,
      invalidateOnRefresh: true,
    },
  });
}

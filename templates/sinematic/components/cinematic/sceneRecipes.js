/**
 * Scroll-scrub camera recipes — opacity + transform only.
 *
 * All scenes use document-flow scrub (no sticky pin).
 * - hero     → heroExit
 * - about    → fadeHold
 * - skills   → softWipe
 * - dynamic  → fade / slide / dolly cycle
 * - contact  → settle
 */

export const SCENE_RECIPES = {
  /** Hero: hold long, then lift out as About arrives */
  heroExit: {
    opacity: [
      [0, 0.55, 0.82, 1],
      [1, 1, 0.55, 0],
    ],
    y: [
      [0, 0.55, 1],
      [0, -8, -36],
    ],
  },

  /** Readable crossfade — long mid hold, soft edges */
  fadeInOut: {
    opacity: [
      [0, 0.14, 0.28, 0.72, 0.86, 1],
      [0, 0.55, 1, 1, 0.5, 0],
    ],
    y: [
      [0, 1],
      [0, 0],
    ],
  },

  /** Mobile / reduced drama — small y, never harsh */
  fadeHold: {
    opacity: [
      [0, 0.12, 0.26, 0.74, 0.88, 1],
      [0, 0.7, 1, 1, 0.65, 0],
    ],
    y: [
      [0, 0.2, 0.8, 1],
      [14, 0, 0, -10],
    ],
  },

  slideUp: {
    opacity: [
      [0, 0.12, 0.28, 0.72, 0.88, 1],
      [0, 0.5, 1, 1, 0.45, 0],
    ],
    y: [
      [0, 0.22, 0.78, 1],
      [36, 0, 0, -28],
    ],
  },

  slideFromRight: {
    opacity: [
      [0, 0.12, 0.28, 0.72, 0.88, 1],
      [0, 0.5, 1, 1, 0.45, 0],
    ],
    x: [
      [0, 0.22, 0.78, 1],
      [40, 0, 0, -28],
    ],
    y: [
      [0, 1],
      [0, 0],
    ],
  },

  slideFromLeft: {
    opacity: [
      [0, 0.12, 0.28, 0.72, 0.88, 1],
      [0, 0.5, 1, 1, 0.45, 0],
    ],
    x: [
      [0, 0.22, 0.78, 1],
      [-40, 0, 0, 28],
    ],
    y: [
      [0, 1],
      [0, 0],
    ],
  },

  softWipe: {
    opacity: [
      [0, 0.1, 0.24, 0.76, 0.9, 1],
      [0, 0.65, 1, 1, 0.55, 0],
    ],
    y: [
      [0, 0.18, 0.82, 1],
      [20, 0, 0, -16],
    ],
  },

  riseIn: {
    opacity: [
      [0, 0.12, 0.28, 0.72, 0.88, 1],
      [0, 0.55, 1, 1, 0.5, 0],
    ],
    y: [
      [0, 0.2, 0.8, 1],
      [28, 0, 0, -20],
    ],
  },

  dolly: {
    opacity: [
      [0, 0.1, 0.26, 0.74, 0.9, 1],
      [0, 0.6, 1, 1, 0.5, 0],
    ],
    y: [
      [0, 0.18, 0.82, 1],
      [24, 0, 0, -18],
    ],
  },

  settle: {
    opacity: [
      [0, 0.14, 0.32, 1],
      [0, 0.7, 1, 1],
    ],
    y: [
      [0, 0.22, 0.42],
      [28, 8, 0],
    ],
  },
};

/**
 * Desktop dynamic sections — 5 distinct handoffs for ≤6 sections.
 * Kept: fade, slide up, from right, dolly, from left
 */
const DYNAMIC_CYCLE_DESKTOP = [
  'fadeInOut',
  'slideUp',
  'slideFromRight',
  'dolly',
  'slideFromLeft',
];

/**
 * Mobile — no lateral slides; 4 soft vertical/fade handoffs.
 */
const DYNAMIC_CYCLE_MOBILE = [
  'fadeHold',
  'softWipe',
  'riseIn',
  'fadeInOut',
];

/**
 * Remap heavy / lateral recipes when compact (touch + motion sensitivity).
 */
export const COMPACT_RECIPE_MAP = {
  slideFromRight: 'riseIn',
  slideFromLeft: 'riseIn',
  slideUp: 'riseIn',
  heroExit: 'heroExit',
};

export function recipeForKind(kind, sceneIndex = 0, { compact = false } = {}) {
  if (kind === 'hero') return 'heroExit';
  if (kind === 'about') return 'fadeHold';
  if (kind === 'skills') return 'softWipe';
  if (kind === 'contact') return 'settle';
  if (kind === 'dynamic') {
    const cycle = compact ? DYNAMIC_CYCLE_MOBILE : DYNAMIC_CYCLE_DESKTOP;
    return cycle[Math.abs(sceneIndex) % cycle.length];
  }
  return compact ? 'fadeHold' : 'riseIn';
}

/** Resolve recipe after viewport known (compact remaps lateral recipes). */
export function resolveRecipe(recipe, { compact = false } = {}) {
  if (!compact) return recipe;
  return COMPACT_RECIPE_MAP[recipe] || recipe;
}

/** Spring scrub — desktop lag like GSAP scrub:1; mobile snappier for touch. */
export const SCRUB_SPRING = {
  desktop: { stiffness: 110, damping: 28, mass: 0.35, restDelta: 0.001 },
};

/** Atmosphere label — no raster plate; void is CSS in CinematicBackground. */
export const SINEMATIC_BACKGROUND = {
  src: null,
  label: 'Scope void',
};

/** Overlapping composition slots for active-section stage cards. */
export const SINEMATIC_ITEM_SLOTS = ['a', 'b', 'c', 'd', 'e'];

export const SINEMATIC_PROCESS = ['ROLL', 'ACTION', 'CUT', 'PRINT'];

export const SINEMATIC_STAGE_LIMIT = SINEMATIC_ITEM_SLOTS.length;

/** Lamp gel palettes — cycle on source click or slate `gel` / `palette`. */
export const SINEMATIC_PROJECTION_PALETTES = [
  'amber',
  'teal',
  'violet',
  'rose',
  'ice',
  'ember',
];

/** Default lamp mode — advances gel on each section while neon is active. */
export const SINEMATIC_DEFAULT_GEL_MODE = 'neon';

/**
 * Projection beam recipes — lamp on viewport edges, angle always throws toward screen center.
 * Color comes from the active gel palette, not the aim recipe.
 */
export const SINEMATIC_PROJECTION_BEAMS = [
  { x: '0%', y: '68%', angle: -20, flare: 76, length: '170vw', label: 'edge-left-low' },
  { x: '0%', y: '28%', angle: 24, flare: 82, length: '175vw', label: 'edge-left-high' },
  { x: '100%', y: '22%', angle: 148, flare: 78, length: '172vw', label: 'edge-right-high' },
  { x: '100%', y: '76%', angle: -152, flare: 84, length: '176vw', label: 'edge-right-low' },
  { x: '50%', y: '0%', angle: 90, flare: 88, length: '165vh', label: 'edge-top' },
  { x: '14%', y: '0%', angle: 72, flare: 80, length: '174vw', label: 'edge-top-left' },
  { x: '86%', y: '0%', angle: 108, flare: 80, length: '174vw', label: 'edge-top-right' },
  { x: '50%', y: '100%', angle: -90, flare: 86, length: '168vh', label: 'edge-bottom' },
];

/** Mobile — top or bottom edge only (y = 0% | 100%); x may vary along that edge. */
export const SINEMATIC_PROJECTION_BEAMS_MOBILE = [
  { x: '50%', y: '0%', angle: 90, flare: 72, length: '145vh', label: 'edge-top' },
  { x: '18%', y: '0%', angle: 78, flare: 64, length: '148vh', label: 'edge-top-left' },
  { x: '82%', y: '0%', angle: 102, flare: 64, length: '146vh', label: 'edge-top-right' },
  { x: '34%', y: '0%', angle: 84, flare: 68, length: '150vh', label: 'edge-top-mid-left' },
  { x: '50%', y: '100%', angle: -90, flare: 68, length: '140vh', label: 'edge-bottom' },
  { x: '22%', y: '100%', angle: -78, flare: 62, length: '138vh', label: 'edge-bottom-left' },
  { x: '78%', y: '100%', angle: -102, flare: 62, length: '139vh', label: 'edge-bottom-right' },
  { x: '66%', y: '100%', angle: -96, flare: 64, length: '142vh', label: 'edge-bottom-mid-right' },
];

export function projectionBeamForIndex(index = 0, mobile = false) {
  const list = mobile ? SINEMATIC_PROJECTION_BEAMS_MOBILE : SINEMATIC_PROJECTION_BEAMS;
  return list[((index % list.length) + list.length) % list.length];
}

export function normalizeProjectionPalette(name) {
  const key = String(name || '').toLowerCase().trim();
  if (key === 'reset' || key === 'default') return 'amber';
  return SINEMATIC_PROJECTION_PALETTES.includes(key) ? key : null;
}

export function isNeonGelMode(name) {
  const key = String(name || '').toLowerCase().trim();
  return key === 'neon' || key === 'auto' || key === 'loop';
}

export function nextProjectionPalette(current) {
  const list = SINEMATIC_PROJECTION_PALETTES;
  const index = list.indexOf(current);
  return list[(index + 1) % list.length];
}

function dispatchPaletteState(palette, mode) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.projectionPalette = palette;
    document.documentElement.dataset.projectionMode = mode;
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('sinematic:palette', {
        detail: { palette, mode },
      }),
    );
  }
}

/** Lock to a single gel color (stops neon loop). */
export function applyProjectionPalette(name) {
  const palette = normalizeProjectionPalette(name) || 'amber';
  dispatchPaletteState(palette, 'lock');
  return palette;
}

/** Enable neon auto-loop (default). */
export function applyNeonGelMode(startPalette = 'amber') {
  const palette = normalizeProjectionPalette(startPalette) || 'amber';
  dispatchPaletteState(palette, 'neon');
  return palette;
}

/** Advance one gel while staying locked (or lock from neon onto next). */
export function cycleProjectionPalette(current) {
  return applyProjectionPalette(nextProjectionPalette(current || 'amber'));
}

export function getProjectionMode() {
  if (typeof document === 'undefined') return SINEMATIC_DEFAULT_GEL_MODE;
  return document.documentElement.dataset.projectionMode || SINEMATIC_DEFAULT_GEL_MODE;
}

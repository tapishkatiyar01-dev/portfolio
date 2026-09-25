'use client';

/**
 * Director's slate command runner — sinematic cousin of terminal / arcade cheats.
 * Jobs: go (take/cut), play (grain / clap / roll).
 */

const LUTS = ['amber', 'cyan', 'noir', 'reset', 'default'];

const LUT_VARS = {
  amber: {
    '--s-cyan': '#f5a524',
    '--s-cyan-strong': '#ffb84d',
    '--s-amber': '#f5a524',
    '--s-line': 'rgba(245, 165, 36, 0.32)',
  },
  cyan: {
    '--s-cyan': '#7dd3fc',
    '--s-cyan-strong': '#38bdf8',
    '--s-amber': '#f5a524',
    '--s-line': 'rgba(125, 211, 252, 0.28)',
  },
  noir: {
    '--s-cyan': '#c8d0d8',
    '--s-cyan-strong': '#e8eef4',
    '--s-amber': '#b0b8c0',
    '--s-line': 'rgba(200, 208, 216, 0.28)',
  },
};

const DEFAULT_LUT_VARS = LUT_VARS.cyan;

function clearLutClasses() {
  document.documentElement.classList.remove(
    'sinematic-lut-amber',
    'sinematic-lut-cyan',
    'sinematic-lut-noir',
  );
}

function applyLutVars(map) {
  const root = document.documentElement;
  Object.entries(map).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}

function applyLut(name) {
  const key = name === 'default' || name === 'reset' ? 'cyan' : name;
  clearLutClasses();
  if (key !== 'cyan') {
    document.documentElement.classList.add(`sinematic-lut-${key}`);
  } else {
    document.documentElement.classList.add('sinematic-lut-cyan');
  }
  applyLutVars(LUT_VARS[key] || DEFAULT_LUT_VARS);
}

function signalOk(message) {
  window.dispatchEvent(new CustomEvent('sinematic:slate-ok', { detail: message }));
}

function findScene(navItems, target) {
  if (!target) return null;
  const asIndex = Number(target) - 1;
  if (Number.isInteger(asIndex) && navItems[asIndex]) return navItems[asIndex];
  const needle = String(target).toLowerCase().replace(/^0+/, '') || target;
  const byIndexPad = navItems.find((_, i) => String(i + 1).padStart(2, '0') === target);
  if (byIndexPad) return byIndexPad;
  return (
    navItems.find(
      (item) =>
        item.id.toLowerCase() === needle ||
        item.label.toLowerCase() === needle ||
        item.label.toLowerCase().includes(needle),
    ) || null
  );
}

export function runSinematicSlate({ input, navItems, personal, selectNav }) {
  const raw = input.trim();
  if (!raw) return { status: 'slate ready · type `help`' };

  const parts = raw.split(/\s+/);
  const action = parts[0]?.toLowerCase();
  const rest = parts.slice(1).join(' ').trim();
  const restLower = rest.toLowerCase();

  if (action === 'help' || action === '?') {
    return {
      status: 'take · cut · lut · grain · whoami · clap · roll · reset',
    };
  }

  if (action === 'whoami' || action === 'slate') {
    const line = [personal?.name, personal?.designation].filter(Boolean).join(' — ');
    return { status: line || 'untitled production' };
  }

  if (['take', 'cut', 'scene', 'go', 'rollto'].includes(action)) {
    let target = restLower;
    if (action === 'cut' && restLower.startsWith('to ')) {
      target = restLower.slice(3).trim();
    }
    const scene = findScene(navItems, target || parts[1]);
    if (!scene) return { status: `scene not found: ${rest || ''}` };
    selectNav(scene.id);
    signalOk(`TAKE ${scene.label}`);
    return { status: `cut to ${scene.label}` };
  }

  if (action === 'lut' || action === 'grade') {
    const name = (restLower || 'cyan').split(/\s+/)[0];
    if (!LUTS.includes(name) && name !== 'default') {
      return { status: 'luts: amber cyan noir reset' };
    }
    applyLut(name);
    signalOk(`LUT ${name === 'reset' || name === 'default' ? 'cyan' : name}`);
    return {
      status: `lut · ${name === 'reset' || name === 'default' ? 'cyan' : name}`,
    };
  }

  if (action === 'grain') {
    const mode = restLower || 'toggle';
    const root = document.documentElement;
    if (mode === 'on') {
      root.classList.remove('sinematic-grain-off');
      root.classList.add('sinematic-grain-on');
      signalOk('GRAIN ON');
      return { status: 'film grain enabled' };
    }
    if (mode === 'off') {
      root.classList.remove('sinematic-grain-on');
      root.classList.add('sinematic-grain-off');
      signalOk('GRAIN OFF');
      return { status: 'film grain disabled' };
    }
    const off = root.classList.toggle('sinematic-grain-off');
    if (off) root.classList.remove('sinematic-grain-on');
    else root.classList.add('sinematic-grain-on');
    signalOk(off ? 'GRAIN OFF' : 'GRAIN ON');
    return { status: off ? 'film grain disabled' : 'film grain enabled' };
  }

  if (action === 'clap' || action === 'mark' || action === 'action') {
    signalOk('MARK');
    return { status: 'slate clapped · mark recorded' };
  }

  if (action === 'roll' || action === 'more' || action === 'reveal') {
    window.dispatchEvent(new CustomEvent('sinematic:roll'));
    signalOk('ROLL');
    return { status: 'rolling · reveal next takes' };
  }

  if (action === 'reset') {
    clearLutClasses();
    applyLutVars(DEFAULT_LUT_VARS);
    document.documentElement.classList.remove('sinematic-grain-on', 'sinematic-grain-off');
    signalOk('RESET');
    return { status: 'production reset · cyan lut · grain default' };
  }

  // Shorthand: bare number or scene name → take
  if (/^\d{1,2}$/.test(action) || findScene(navItems, action)) {
    const scene = findScene(navItems, action);
    if (scene) {
      selectNav(scene.id);
      signalOk(`TAKE ${scene.label}`);
      return { status: `cut to ${scene.label}` };
    }
  }

  return { status: 'unknown cue · try `help`' };
}

export { applyLut, LUTS };

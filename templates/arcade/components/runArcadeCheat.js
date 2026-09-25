'use client';

/**
 * Arcade cheat runners — theme-native cousin of terminal `$ command`.
 * Jobs: go (warp), look (palette), play (crt / stars / lives / boss).
 */

const DEFAULT_PALETTE = {
  pink: '#ff2d95',
  cyan: '#00f5ff',
  yellow: '#ffe600',
  green: '#39ff14',
  purple: '#7b2fff',
  red: '#ff0040',
};

const PALETTES = {
  neon: DEFAULT_PALETTE,
  pink: {
    pink: '#ff2d95',
    cyan: '#ff6eb4',
    yellow: '#ffd6e7',
    green: '#ff8fab',
    purple: '#c9184a',
    red: '#ff0040',
  },
  cyan: {
    pink: '#5ce1ff',
    cyan: '#00f5ff',
    yellow: '#b8fff9',
    green: '#7afcff',
    purple: '#0096c7',
    red: '#00b4d8',
  },
  yellow: {
    pink: '#ffc857',
    cyan: '#ffe600',
    yellow: '#fff566',
    green: '#c6ff00',
    purple: '#f4a261',
    red: '#ff9f1c',
  },
  green: {
    pink: '#39ff14',
    cyan: '#7aff6b',
    yellow: '#b8ff4a',
    green: '#39ff14',
    purple: '#00c853',
    red: '#64dd17',
  },
  purple: {
    pink: '#c77dff',
    cyan: '#9b5de5',
    yellow: '#e0aaff',
    green: '#7b2fff',
    purple: '#7b2fff',
    red: '#ff006e',
  },
};

function applyPalette(name) {
  const palette = PALETTES[name] || DEFAULT_PALETTE;
  const root = document.documentElement;
  root.style.setProperty('--arcade-pink', palette.pink);
  root.style.setProperty('--arcade-cyan', palette.cyan);
  root.style.setProperty('--arcade-yellow', palette.yellow);
  root.style.setProperty('--arcade-green', palette.green);
  root.style.setProperty('--arcade-purple', palette.purple);
  root.style.setProperty('--arcade-red', palette.red);
  root.style.setProperty('--arcade-shadow', palette.purple);
  root.style.setProperty('--arcade-shadow-hover', palette.cyan);
  root.style.setProperty('--disclosure-accent', palette.green);
}

function signalOk(message) {
  window.dispatchEvent(new CustomEvent('arcade:code-ok', { detail: message }));
}

function findTab(tabs, target) {
  if (!target) return null;
  const asIndex = Number(target) - 1;
  if (Number.isInteger(asIndex) && tabs[asIndex]) return tabs[asIndex];
  const needle = target.toLowerCase();
  return (
    tabs.find(
      (tab) =>
        tab.id.toLowerCase() === needle ||
        tab.name.toLowerCase() === needle ||
        tab.name.toLowerCase().includes(needle),
    ) || null
  );
}

export function runArcadeCheat({ input, tabs, personal, setActive }) {
  const raw = input.trim();
  if (!raw) return { status: 'insert coin · type `help`' };

  const parts = raw.split(/\s+/);
  const action = parts[0]?.toLowerCase();
  const value = parts.slice(1).join(' ').toLowerCase();

  if (action === 'help' || action === '?') {
    return {
      status: 'warp · palette · blast · shoot · whoami · lives · boss · crt · stars · reset · gg',
    };
  }

  if (action === 'whoami') {
    const line = [personal?.name, personal?.designation].filter(Boolean).join(' — ');
    return { status: line || 'player one' };
  }

  if (['warp', 'go', 'stage', 'open'].includes(action)) {
    const tab = findTab(tabs, value || parts[1]);
    if (!tab) return { status: `stage not found: ${value || ''}` };
    setActive(tab.id);
    signalOk(`warped → ${tab.name}`);
    document.getElementById('arcade-sections')?.scrollIntoView({ behavior: 'smooth' });
    return { status: `warped to ${tab.name}` };
  }

  if (action === 'boss') {
    const contact = tabs.find((tab) => tab.id === 'contact');
    if (contact) setActive(contact.id);
    signalOk('boss door unlocked');
    document.getElementById('arcade-sections')?.scrollIntoView({ behavior: 'smooth' });
    return { status: 'boss stage · connect' };
  }

  if (action === 'palette' || action === 'skin') {
    const name = (value || 'neon').split(/\s+/)[0];
    if (name === 'reset' || name === 'default') {
      applyPalette('neon');
      signalOk('palette reset');
      return { status: 'palette · neon' };
    }
    if (!PALETTES[name]) {
      return { status: 'palettes: neon pink cyan yellow green purple' };
    }
    applyPalette(name);
    signalOk(`palette ${name}`);
    return { status: `palette · ${name}` };
  }

  if (action === 'blast' || action === 'boom' || action === 'explode') {
    const count = Math.min(Number(parts[1]) || 1, 5);
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('arcade:blast', { detail: { kind: 'blast' } }),
        );
      }, i * 90);
    }
    signalOk(count > 1 ? `BLAST x${count}` : 'BLAST');
    return { status: count > 1 ? `blast · ${count} impacts` : 'blast · random impact' };
  }

  if (action === 'shoot' || action === 'shot' || action === 'fire' || action === 'pew') {
    const count = Math.min(Number(parts[1]) || 1, 5);
    for (let i = 0; i < count; i += 1) {
      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('arcade:blast', { detail: { kind: 'shot' } }),
        );
      }, i * 70);
    }
    signalOk(count > 1 ? `PEW x${count}` : 'PEW');
    return { status: count > 1 ? `shot · ${count} hits` : 'shot · random hit' };
  }

  if (action === 'lives' || action === '1up' || action === 'lives++') {
    window.dispatchEvent(new CustomEvent('arcade:lives-up'));
    signalOk('1-UP');
    return { status: '1-UP · unlocking more records' };
  }

  if (action === 'crt' || action === 'scan') {
    const on = document.documentElement.classList.toggle('arcade-crt-heavy');
    signalOk(on ? 'CRT on' : 'CRT off');
    return { status: on ? 'CRT overlay enabled' : 'CRT overlay disabled' };
  }

  if (action === 'stars') {
    const on = document.documentElement.classList.toggle('arcade-stars-off');
    signalOk(on ? 'stars off' : 'stars on');
    return { status: on ? 'pixel stars hidden' : 'pixel stars visible' };
  }

  if (action === 'reset') {
    applyPalette('neon');
    document.documentElement.classList.remove('arcade-crt-heavy', 'arcade-stars-off');
    signalOk('cabinet reset');
    return { status: 'cabinet reset to neon' };
  }

  if (action === 'gg' || action === 'clear') {
    signalOk('GG');
    return { status: 'GG · insert next code' };
  }

  return { status: 'unknown code · try `help`' };
}

export { applyPalette, PALETTES };

'use client';

/**
 * Sticky-note scribble runner — desk cousin of terminal / arcade / slate.
 * Jobs: go (#tab / pin), look (paper color), play (shuffle / more).
 */

const PAPERS = {
  yellow: '#f7f5ed',
  cream: '#f7f5ed',
  pink: '#fde8ef',
  blue: '#e8f4fa',
  lime: '#f3f7e4',
  purple: '#f3ebf8',
};

const SHUFFLE_CLASSES = [
  'stickynote-shuffle-a',
  'stickynote-shuffle-b',
  'stickynote-shuffle-c',
];

function signalOk(message) {
  window.dispatchEvent(new CustomEvent('stickynote:scribble-ok', { detail: message }));
}

function clearShuffle() {
  document.documentElement.classList.remove(...SHUFFLE_CLASSES);
}

function applyPaper(name) {
  const key = name === 'reset' || name === 'default' ? 'cream' : name;
  const color = PAPERS[key];
  if (!color) return false;
  document.documentElement.style.setProperty('--sn-paper', color);
  document.documentElement.dataset.stickynotePaper = key;
  return key;
}

function findTab(tabs, target) {
  if (!target) return null;
  const cleaned = String(target).replace(/^#/, '').toLowerCase();
  const asIndex = Number(cleaned) - 1;
  if (Number.isInteger(asIndex) && tabs[asIndex]) return tabs[asIndex];
  return (
    tabs.find(
      (tab) =>
        tab.id.toLowerCase() === cleaned ||
        tab.name.toLowerCase() === cleaned ||
        tab.name.toLowerCase().includes(cleaned),
    ) || null
  );
}

export function runStickyScribble({ input, tabs, personal, setActive }) {
  const raw = input.trim();
  if (!raw) return { status: 'scribble something · #projects / pink / shuffle' };

  const parts = raw.split(/\s+/);
  let action = parts[0]?.toLowerCase();
  let rest = parts.slice(1).join(' ').trim().toLowerCase();

  // Shorthand: #projects or bare tab name
  if (action.startsWith('#')) {
    rest = action.slice(1);
    action = 'pin';
  }

  if (action === 'help' || action === '?') {
    return { status: 'pin · #tab · paper · shuffle · more · whoami · reset' };
  }

  if (action === 'whoami') {
    const line = [personal?.name, personal?.designation].filter(Boolean).join(' — ');
    return { status: line || 'untitled desk' };
  }

  if (['pin', 'go', 'open', 'tab', 'note'].includes(action)) {
    const tab = findTab(tabs, rest || parts[1]);
    if (!tab) return { status: `note not found: ${rest || ''}` };
    setActive(tab.id);
    signalOk(`PIN · ${tab.name}`);
    document.getElementById('stickynote-sections')?.scrollIntoView({ behavior: 'smooth' });
    return { status: `pinned ${tab.name}` };
  }

  if (action === 'paper' || action === 'desk') {
    const name = (rest || 'cream').split(/\s+/)[0];
    const applied = applyPaper(name);
    if (!applied) return { status: 'papers: yellow pink blue lime purple cream' };
    signalOk(`PAPER · ${applied}`);
    return { status: `desk paper · ${applied}` };
  }

  // Bare color word → paper
  if (PAPERS[action] || action === 'cream') {
    const applied = applyPaper(action);
    signalOk(`PAPER · ${applied}`);
    return { status: `desk paper · ${applied}` };
  }

  if (action === 'shuffle' || action === 'mix') {
    clearShuffle();
    const next = SHUFFLE_CLASSES[Math.floor(Math.random() * SHUFFLE_CLASSES.length)];
    document.documentElement.classList.add(next);
    signalOk('SHUFFLE');
    return { status: `notes shuffled · ${next.slice(-1)}` };
  }

  if (action === 'more' || action === 'unpin' || action === 'expand') {
    window.dispatchEvent(new CustomEvent('stickynote:more'));
    signalOk('MORE');
    return { status: 'peeling up more notes…' };
  }

  if (action === 'reset') {
    applyPaper('cream');
    clearShuffle();
    signalOk('RESET');
    return { status: 'desk reset · cream paper' };
  }

  if (action === 'clear' || action === 'gg') {
    signalOk('CLEAR');
    return { status: 'pad cleared · ready to scribble' };
  }

  // Bare tab name
  const tab = findTab(tabs, action);
  if (tab) {
    setActive(tab.id);
    signalOk(`PIN · ${tab.name}`);
    document.getElementById('stickynote-sections')?.scrollIntoView({ behavior: 'smooth' });
    return { status: `pinned ${tab.name}` };
  }

  return { status: 'unknown scribble · try `help`' };
}

export { applyPaper, PAPERS };

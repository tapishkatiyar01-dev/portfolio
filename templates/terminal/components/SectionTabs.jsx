'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { usePersistedSectionId } from '@/lib/usePortfolioPersistence';
import About from '@/templates/terminal/components/About';
import Contact from '@/templates/terminal/components/Contact';
import LayoutRenderer from '@/templates/terminal/components/layouts/LayoutRenderer';
import Skills from '@/templates/terminal/components/Skills';
import { terminalWindowVariants, useTerminalWindowMotion } from './motionConfig';

const namedColors = {
  blue: '#3b82f6',
  cyan: '#22d3ee',
  green: '#5dff58',
  magenta: '#d946ef',
  orange: '#fb923c',
  pink: '#f472b6',
  purple: '#a78bfa',
  red: '#f87171',
  white: '#f4f4f5',
  yellow: '#facc15',
};
const presentationTypes = ['full', 'minimal', 'listview'];

function hexToRgb(hex) {
  const normalized = hex.length === 4 ? hex.slice(1).split('').map((part) => part + part).join('') : hex.slice(1);
  return `${parseInt(normalized.slice(0, 2), 16)}, ${parseInt(normalized.slice(2, 4), 16)}, ${parseInt(normalized.slice(4, 6), 16)}`;
}

function hexToHue(hex) {
  const normalized = hex.length === 4 ? hex.slice(1).split('').map((part) => part + part).join('') : hex.slice(1);
  const values = [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16) / 255);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const delta = max - min;
  if (!delta) return 0;
  let hue = 0;
  if (max === values[0]) hue = ((values[1] - values[2]) / delta) % 6;
  else if (max === values[1]) hue = (values[2] - values[0]) / delta + 2;
  else hue = (values[0] - values[1]) / delta + 4;
  return Math.round(hue * 60 < 0 ? hue * 60 + 360 : hue * 60);
}

export default function SectionTabs({
  personal,
  socials,
  skills,
  Sections,
  data,
  initialSectionId = null,
}) {
  const { ref: windowRef, isInView } = useTerminalWindowMotion();
  const [command, setCommand] = useState('');
  const [commandStatus, setCommandStatus] = useState('type `color #hex` or `tab projects`');
  const tabs = useMemo(
    () => [
      { id: 'about', name: 'About' },
      { id: 'skills', name: 'Skills' },
      ...Sections.map((section) => ({ id: section.id, name: section.name })),
      { id: 'contact', name: 'Contact' },
    ],
    [Sections],
  );
  const tabIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);
  const [activeTab, setActiveTab] = usePersistedSectionId('terminal', tabIds, {
    initialValue: initialSectionId,
    fallback: 'about',
  });
  const activeDynamicSection = Sections.find((section) => section.id === activeTab);

  const getSectionEntry = (sectionId) => {
    const entry = data[sectionId];
    if (!entry) return { items: [], total: 0, hasMore: false };
    if (Array.isArray(entry)) return { items: entry, total: entry.length, hasMore: false };
    return { items: entry.items || [], total: entry.total ?? (entry.items || []).length, hasMore: entry.hasMore ?? false };
  };

  const getDataByType = (section) => {
    return getSectionEntry(section.id);
  };

  const runCommand = (event) => {
    event.preventDefault();
    const input = command.trim();
    const [action, value] = input.split(/\s+/, 2);
    const normalizedAction = action?.toLowerCase();
    const target = value?.toLowerCase();

    const requestedColor = /^(#[0-9a-f]{3}|#[0-9a-f]{6})$/i.test(value || '') ? value : namedColors[target];
    if (normalizedAction === 'color' && requestedColor) {
      const accentRgb = hexToRgb(requestedColor);
      document.documentElement.style.setProperty('--terminal-green', requestedColor);
      document.documentElement.style.setProperty('--terminal-green-soft', requestedColor);
      document.documentElement.style.setProperty('--terminal-green-dim', requestedColor);
      document.documentElement.style.setProperty('--terminal-accent-rgb', accentRgb);
      document.documentElement.style.setProperty('--terminal-line', `rgba(${accentRgb}, 0.35)`);
      document.documentElement.style.setProperty('--terminal-line-strong', `rgba(${accentRgb}, 0.72)`);
      document.documentElement.style.setProperty('--terminal-shadow', `rgba(${accentRgb}, 0.28)`);
      document.documentElement.style.setProperty('--terminal-image-overlay', `linear-gradient(90deg, transparent, rgba(${accentRgb}, 0.18), transparent)`);
      document.documentElement.style.setProperty('--terminal-image-hue', `${hexToHue(requestedColor)}deg`);
      document.documentElement.style.setProperty('--terminal-selection-bg', `rgba(${accentRgb}, 0.38)`);
      setCommandStatus(`accent changed to ${value}`);
    } else if (normalizedAction === 'help') {
      setCommandStatus('commands: color, tab, whoami, matrix, clear, reset');
    } else if (normalizedAction === 'whoami') {
      setCommandStatus(`${personal.name} — ${personal.designation}`);
    } else if (normalizedAction === 'matrix') {
      const enabled = document.documentElement.classList.toggle('terminal-matrix');
      setCommandStatus(enabled ? 'matrix mode enabled' : 'matrix mode disabled');
    } else if (normalizedAction === 'clear') {
      setCommandStatus('terminal ready');
    } else if (normalizedAction === 'reset') {
      document.documentElement.style.setProperty('--terminal-green', '#5dff58');
      document.documentElement.style.setProperty('--terminal-green-soft', '#86efac');
      document.documentElement.style.setProperty('--terminal-green-dim', '#2fa84f');
      document.documentElement.style.setProperty('--terminal-accent-rgb', '93, 255, 88');
      document.documentElement.style.setProperty('--terminal-line', 'rgba(93, 255, 88, 0.35)');
      document.documentElement.style.setProperty('--terminal-line-strong', 'rgba(93, 255, 88, 0.72)');
      document.documentElement.style.setProperty('--terminal-shadow', 'rgba(93, 255, 88, 0.28)');
      document.documentElement.style.setProperty('--terminal-image-overlay', 'linear-gradient(90deg, transparent, rgba(93, 255, 88, 0.18), transparent)');
      document.documentElement.style.setProperty('--terminal-image-hue', '64deg');
      document.documentElement.style.setProperty('--terminal-selection-bg', 'rgba(93, 255, 88, 0.38)');
      document.documentElement.classList.remove('terminal-matrix');
      setCommandStatus('terminal reset to green');
    } else if (['tab', 'go', 'open', 'activate'].includes(normalizedAction)) {
      const tabIndex = Number(target) - 1;
      const nextTab = Number.isInteger(tabIndex) && tabs[tabIndex] ? tabs[tabIndex].id : tabs.find((tab) => tab.id === target || tab.name.toLowerCase() === target)?.id;
      if (nextTab) {
        setActiveTab(nextTab);
        setCommandStatus(`active tab: ${nextTab}`);
      } else {
        setCommandStatus(`tab not found: ${value || ''}`);
      }
    } else {
      setCommandStatus('use `color #hex` or `tab projects`');
    }
    setCommand('');
  };

  return (
    <motion.section
      className="terminal-window"
      id="terminal-sections"
      variants={terminalWindowVariants}
      ref={windowRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="terminal-title-bar">
        <div className="terminal-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="terminal-title">sections</div>
        <div className="terminal-actions">_ [] x</div>
      </div>
      <div className="terminal-content">
        <div className="space-y-6">
          <div className="terminal-command-heading">
            <span>02 / COMPONENT PREVIEW</span>
          </div>

          <form className="terminal-command-form" onSubmit={runCommand}>
            <label htmlFor="terminal-command">$ command</label>
            <input id="terminal-command" value={command} onChange={(event) => setCommand(event.target.value)} className="terminal-input" placeholder="color #5dff58 / tab projects" />
            <span>{commandStatus}</span>
          </form>

          <div className="terminal-nav-tabs">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-pressed={activeTab === tab.id}
                className={activeTab === tab.id ? 'is-active' : ''}
              >
                [{String(index + 1).padStart(2, '0')}]_{tab.name.toLowerCase()}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.165, 0.84, 0.44, 1] }}
            >
              {activeTab === 'about' && <About personal={personal} />}
              {activeTab === 'skills' && <Skills skills={skills} />}
              {activeTab === 'contact' && (
                  <Contact
                  email={personal.email}
                  github={socials.github}
                  linkedin={socials.linkedin}
                  website={socials.website}
                  terminal={personal.terminal}
                />
              )}
              {activeDynamicSection && (
                <LayoutRenderer
                  sectionData={getDataByType(activeDynamicSection)}
                  sectionId={activeDynamicSection.id}
                  layoutType={activeDynamicSection['layout-type']}
                  dataType={activeDynamicSection['data-type']}
                  itemType={activeDynamicSection['data-source'] || (presentationTypes.includes(activeDynamicSection['data-type']) ? activeDynamicSection.id : activeDynamicSection['data-type'])}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { usePersistedSectionId } from '@/lib/usePortfolioPersistence';
import About from './About';
import CheatCodes from './CheatCodes';
import Contact from './Contact';
import Skills from './Skills';
import LayoutRenderer from './layouts/LayoutRenderer';

function getSectionData(data, section) {
  const entry = data[section['data-source'] || section.id];
  if (!entry) return { items: [], total: 0, hasMore: false };
  if (Array.isArray(entry)) return { items: entry, total: entry.length, hasMore: false };
  return entry;
}

export default function SectionTabs({
  personal,
  socials,
  skills,
  Sections = [],
  data = {},
  initialSectionId = null,
}) {
  const tabs = useMemo(
    () => [
      { id: 'about', name: 'Player' },
      { id: 'skills', name: 'Loadout' },
      ...Sections.map((section) => ({ id: section.id, name: section.name })),
      { id: 'contact', name: 'Connect' },
    ],
    [Sections],
  );
  const tabIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);
  const [active, setActive] = usePersistedSectionId('arcade', tabIds, {
    initialValue: initialSectionId,
    fallback: 'about',
  });

  useEffect(() => {
    const handler = (event) => {
      if (tabs.some((tab) => tab.id === event.detail)) setActive(event.detail);
    };
    window.addEventListener('arcade:select-tab', handler);
    return () => window.removeEventListener('arcade:select-tab', handler);
  }, [tabs, setActive]);

  const section = Sections.find((item) => item.id === active);
  const stageLabel = String(tabs.findIndex((tab) => tab.id === active) + 1).padStart(2, '0');

  return (
    <section className="arcade-sections" id="arcade-sections">
      <div className="arcade-section-head">
        <p className="arcade-kicker">Choose your mission</p>
        <span>
          Stage {stageLabel} / {String(tabs.length).padStart(2, '0')}
        </span>
      </div>

      <CheatCodes tabs={tabs} personal={personal} activeId={active} onWarp={setActive} />

      <div className="arcade-tabs" role="tablist" aria-label="Portfolio sections">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={active === tab.id ? 'is-active' : ''}
            onClick={() => setActive(tab.id)}
          >
            <span>0{index + 1}</span>
            {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {active === 'about' && <About personal={personal} />}
          {active === 'skills' && <Skills skills={skills} />}
          {active === 'contact' && (
            <Contact
              email={personal?.email}
              github={socials?.github}
              linkedin={socials?.linkedin}
              website={socials?.website}
            />
          )}
          {section && (
            <LayoutRenderer
              sectionData={getSectionData(data, section)}
              sectionId={section.id}
              layoutType={section['layout-type']}
              dataType={section['data-type']}
              itemType={section['data-source'] || section['data-type']}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

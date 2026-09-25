'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { usePersistedSectionId } from '@/lib/usePortfolioPersistence';
import About from './About';
import Contact from './Contact';
import LayoutRenderer from './layouts/LayoutRenderer';
import Skills from './Skills';
import StickyScribble from './StickyScribble';
import { stickyReveal, useStickyInView } from './motionConfig';

export default function SectionTabs({
  personal,
  socials,
  skills,
  Sections = [],
  data = {},
  initialSectionId = null,
}) {
  const { ref, isInView } = useStickyInView();
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
  const [activeTab, setActiveTab] = usePersistedSectionId('stickynote', tabIds, {
    initialValue: initialSectionId,
    fallback: 'about',
  });
  const activeSection = Sections.find((section) => section.id === activeTab);

  useEffect(() => {
    const selectTab = (event) => {
      if (tabs.some((tab) => tab.id === event.detail)) setActiveTab(event.detail);
    };
    window.addEventListener('stickynote:select-tab', selectTab);
    return () => window.removeEventListener('stickynote:select-tab', selectTab);
  }, [tabs, setActiveTab]);

  return (
    <motion.section
      ref={ref}
      id="stickynote-sections"
      className="stickynote-sections-shell"
      variants={stickyReveal}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <StickyScribble
        tabs={tabs}
        personal={personal}
        activeId={activeTab}
        onPin={setActiveTab}
      />

      <nav className="stickynote-tabs" aria-label="Portfolio sections">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? 'is-active' : ''}
            aria-selected={activeTab === tab.id}
            role="tab"
            onClick={() => setActiveTab(tab.id)}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            {tab.name}
          </button>
        ))}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          className="stickynote-tab-panel"
          role="tabpanel"
          initial={{ opacity: 0, y: 14, rotate: -0.45 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: -10, rotate: 0.35 }}
          transition={{ duration: 0.24, ease: [0.165, 0.84, 0.44, 1] }}
        >
          {activeTab === 'about' && <About personal={personal} />}
          {activeTab === 'skills' && <Skills skills={skills} />}
          {activeTab === 'contact' && <Contact email={personal?.email} socials={socials} />}
          {activeSection && (
            <DynamicSection
              section={activeSection}
              items={resolveSectionItems(activeSection, data)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

function DynamicSection({ section, items }) {
  const sectionData = Array.isArray(items)
    ? { items, total: items.length, hasMore: false }
    : items;
  return (
    <section id={section.id} className="stickynote-dynamic-section">
      <div className="stickynote-section-heading">
        <h2>{section.name}</h2>
        <span>
          {sectionData.total} {sectionData.total === 1 ? 'entry' : 'entries'}
        </span>
      </div>
      <LayoutRenderer
        sectionData={sectionData}
        sectionId={section.id}
        layoutType={section['layout-type']}
        dataType={section['data-type']}
      />
    </section>
  );
}

function resolveSectionItems(section, data) {
  const candidates = [section['data-source'], section.id, section['data-type']].filter(Boolean);
  const aliases = {
    project: 'projects',
    projects: 'projects',
    experience: 'experience',
    experiences: 'experience',
    education: 'education',
    educations: 'education',
  };

  for (const candidate of candidates) {
    const source = aliases[candidate] || candidate;
    const entry = data[source];
    if (entry) {
      if (Array.isArray(entry)) return { items: entry, total: entry.length, hasMore: false };
      return {
        items: entry.items || [],
        total: entry.total ?? (entry.items || []).length,
        hasMore: entry.hasMore ?? false,
      };
    }
  }

  return { items: [], total: 0, hasMore: false };
}

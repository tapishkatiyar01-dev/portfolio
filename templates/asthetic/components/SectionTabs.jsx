'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import { usePersistedSectionId } from '@/lib/usePortfolioPersistence';
import About from '@/templates/asthetic/components/About';
import Contact from '@/templates/asthetic/components/Contact';
import LayoutRenderer from '@/templates/asthetic/components/layouts/LayoutRenderer';
import Skills from '@/templates/asthetic/components/Skills';
import { sectionVariants, useAestheticMotion } from './motionConfig';

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
  const { ref, isInView } = useAestheticMotion();
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
  const [activeTab, setActiveTab] = usePersistedSectionId('asthetic', tabIds, {
    initialValue: initialSectionId,
    fallback: 'about',
  });
  const activeDynamicSection = Sections.find((section) => section.id === activeTab);

  useEffect(() => {
    const handleExternalTabChange = (event) => {
      const nextTab = event.detail;
      if (tabs.some((tab) => tab.id === nextTab)) setActiveTab(nextTab);
    };

    window.addEventListener('asthetic:select-tab', handleExternalTabChange);
    return () => window.removeEventListener('asthetic:select-tab', handleExternalTabChange);
  }, [tabs, setActiveTab]);

  return (
    <motion.section
      className="aesthetic-sections"
      id="aesthetic-sections"
      variants={sectionVariants}
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="section-heading">
        <span>Selected work &amp; story</span>
        <span>Explore the details</span>
      </div>

      <div className="aesthetic-tabs" role="tablist" aria-label="Portfolio sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? 'is-active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="aesthetic-tab-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          {activeTab === 'about' && <About personal={personal} />}
          {activeTab === 'skills' && <Skills skills={skills} />}
          {activeTab === 'contact' && (
            <Contact
              email={personal.email}
              github={socials?.github}
              linkedin={socials?.linkedin}
              website={socials?.website}
            />
          )}
          {activeDynamicSection && (
            <LayoutRenderer
              sectionData={getSectionData(data, activeDynamicSection)}
              sectionId={activeDynamicSection.id}
              layoutType={activeDynamicSection['layout-type']}
              dataType={activeDynamicSection['data-type']}
              itemType={activeDynamicSection['data-source'] || activeDynamicSection['data-type']}
              sectionName={activeDynamicSection.name}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}

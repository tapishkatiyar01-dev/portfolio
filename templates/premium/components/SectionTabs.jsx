'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { usePersistedSectionScroll } from '@/lib/usePortfolioPersistence';
import About from './About';
import Contact from './Contact';
import LayoutRenderer from './layouts/LayoutRenderer';
import Skills from './Skills';
import { premiumWindowVariants, usePremiumInView } from './motionConfig';

const presentationTypes = ['full', 'minimal', 'listview'];

export default function SectionTabs({
  personal,
  socials,
  skills,
  Sections = [],
  data = {},
  initialSectionId = null,
}) {
  const { ref, isInView } = usePremiumInView();
  const sections = [
    { id: 'about', name: 'About', kind: 'about' },
    { id: 'skills', name: 'Skills', kind: 'skills' },
    ...Sections.map((section) => ({ ...section, kind: 'dynamic' })),
    { id: 'contact', name: 'Contact', kind: 'contact' },
  ];
  const sectionIds = useMemo(
    () => ['home', ...sections.map((section) => section.id)],
    // sections identity is stable enough for this page
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Sections],
  );
  usePersistedSectionScroll('premium', sectionIds, {
    initialValue: initialSectionId,
    fallback: 'home',
  });

  return (
    <motion.section ref={ref} className="premium-section" variants={premiumWindowVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      {sections.map((section) => {
        if (section.kind === 'about') return <About personal={personal} key={section.id} />;
        if (section.kind === 'skills') return <Skills skills={skills} key={section.id} />;
        if (section.kind === 'contact') return <Contact email={personal?.email} socials={socials} key={section.id} />;

        const itemType = section['data-source'] || (presentationTypes.includes(section['data-type']) ? section.id : section['data-type']);
        return (
          <section id={section.id} className="premium-section" key={section.id}>
            <div className="premium-section-heading">
              <div>
                <span className="premium-eyebrow">{section.name}</span>
                <h2>{section.name}</h2>
              </div>
            </div>
            <LayoutRenderer
              sectionData={getSectionItems(section, data)}
              sectionId={section.id}
              layoutType={section['layout-type']}
              dataType={section['data-type']}
              itemType={itemType}
            />
          </section>
        );
      })}
    </motion.section>
  );
}

function getSectionItems(section, data) {
  const entry = data[section.id];
  if (!entry) return { items: [], total: 0, hasMore: false };
  if (Array.isArray(entry)) return { items: entry, total: entry.length, hasMore: false };
  return entry;
}

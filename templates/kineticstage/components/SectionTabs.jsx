'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePersistedSectionId } from '@/lib/usePortfolioPersistence';
import About from './About';
import Contact from './Contact';
import Skills from './Skills';
import {
  getGsap,
  prefersReducedMotion,
  refreshScroll,
  registerStageGsap,
  useGSAP,
} from './gsapSetup';
import LayoutRenderer from './layouts/LayoutRenderer';
import { getSectionEntry, resolveItemType } from './sectionData';
import { useStageScene } from './sceneContext';

registerStageGsap();

const EVENT = 'kineticstage:select-tab';

export default function SectionTabs({
  personal,
  socials,
  skills,
  Sections = [],
  data = {},
  initialSectionId = null,
}) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const { setScene } = useStageScene();

  const tabs = useMemo(
    () => [
      { id: 'about', name: 'About', kind: 'about' },
      { id: 'skills', name: 'Skills', kind: 'skills' },
      ...Sections.map((section) => ({ ...section, kind: 'dynamic' })),
      { id: 'contact', name: 'Contact', kind: 'contact' },
    ],
    [Sections],
  );
  const tabIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);
  const [activeTab, setActiveTab] = usePersistedSectionId('kineticstage', tabIds, {
    initialValue: initialSectionId,
    fallback: 'about',
  });

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const active = tabs[activeIndex] || tabs[0];

  const selectTab = (id) => {
    if (!tabs.some((tab) => tab.id === id)) return;
    setActiveTab(id);
    setScene(id);
  };

  useEffect(() => {
    if (activeTab) setScene(activeTab);
  }, [activeTab, setScene]);

  useEffect(() => {
    const onSelect = (event) => {
      const id = event.detail;
      if (!tabs.some((tab) => tab.id === id)) return;
      setActiveTab(id);
      setScene(id);
    };
    window.addEventListener(EVENT, onSelect);
    return () => window.removeEventListener(EVENT, onSelect);
  }, [tabs, setScene, setActiveTab]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const { gsap } = getGsap();
      if (!panel || !gsap || prefersReducedMotion()) {
        const t = window.setTimeout(() => refreshScroll(), 80);
        return () => window.clearTimeout(t);
      }

      gsap.fromTo(
        panel,
        { y: 28, scale: 0.985 },
        {
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: 'power2.out',
          overwrite: 'auto',
        },
      );

      const t = window.setTimeout(() => refreshScroll(), 120);
      return () => window.clearTimeout(t);
    },
    { scope: rootRef, dependencies: [activeTab], revertOnUpdate: true },
  );

  let panel = null;
  if (active?.kind === 'about') {
    panel = <About personal={personal} index={Math.max(activeIndex, 0)} />;
  } else if (active?.kind === 'skills') {
    panel = <Skills skills={skills} index={Math.max(activeIndex, 0)} />;
  } else if (active?.kind === 'contact') {
    panel = (
      <Contact
        email={personal?.email}
        github={socials?.github}
        linkedin={socials?.linkedin}
        website={socials?.website}
        index={Math.max(activeIndex, 0)}
      />
    );
  } else if (active?.kind === 'dynamic') {
    const sectionData = getSectionEntry(active, data);
    const itemType = resolveItemType(active);
    const chapter = String(Math.max(activeIndex, 0) + 1).padStart(2, '0');
    panel = (
      <div className="kineticstage-dynamic">
        <div className="kineticstage-section-head">
          <p className="kineticstage-eyebrow">
            <span>{chapter}</span>
            <i aria-hidden="true" />
            <span>{active.name}</span>
          </p>
          <h2>{active.name}</h2>
        </div>
        <LayoutRenderer
          sectionData={sectionData}
          sectionId={active.id}
          layoutType={active['layout-type']}
          dataType={active['data-type']}
          itemType={itemType}
          sectionName={active.name}
        />
      </div>
    );
  }

  return (
    <div className="kineticstage-sections" id="kineticstage-sections" ref={rootRef}>
      <div className="kineticstage-sections-intro">
        <p className="kineticstage-eyebrow">
          <span>Explore</span>
          <i aria-hidden="true" />
          <span>Sections</span>
        </p>
        <h2 className="kineticstage-sections-title">Sections</h2>
      </div>

      <nav className="kineticstage-tabs" aria-label="Portfolio sections" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`kineticstage-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls="kineticstage-tabpanel"
            className={activeTab === tab.id ? 'is-active' : ''}
            onClick={() => selectTab(tab.id)}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            {tab.name}
          </button>
        ))}
      </nav>

      <div
        ref={panelRef}
        className="kineticstage-tab-panel"
        role="tabpanel"
        id="kineticstage-tabpanel"
        aria-labelledby={`kineticstage-tab-${activeTab}`}
      >
        {panel}
      </div>
    </div>
  );
}

export function dispatchStageTab(id) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT, { detail: id }));
}

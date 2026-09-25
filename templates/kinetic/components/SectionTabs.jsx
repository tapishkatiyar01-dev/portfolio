'use client';

import { useMemo, useRef } from 'react';
import { usePersistedSectionScroll } from '@/lib/usePortfolioPersistence';
import About from './About';
import Contact from './Contact';
import Skills from './Skills';
import {
  prefersReducedMotion,
  refreshScroll,
  registerKineticGsap,
  revealSection,
  useGSAP,
} from './gsapSetup';
import LayoutRenderer from './layouts/LayoutRenderer';
import { getSectionEntry, resolveItemType } from './sectionData';

registerKineticGsap();

export default function SectionTabs({
  personal,
  socials,
  skills,
  Sections = [],
  data = {},
  initialSectionId = null,
}) {
  const stackRef = useRef(null);

  const scenes = useMemo(
    () => [
      { id: 'about', name: 'About', kind: 'about' },
      { id: 'skills', name: 'Skills', kind: 'skills' },
      ...Sections.map((section) => ({ ...section, kind: 'dynamic' })),
      { id: 'contact', name: 'Contact', kind: 'contact' },
    ],
    [Sections],
  );
  const sectionIds = useMemo(() => ['home', ...scenes.map((scene) => scene.id)], [scenes]);
  usePersistedSectionScroll('kinetic', sectionIds, {
    initialValue: initialSectionId,
    fallback: 'home',
  });

  useGSAP(
    () => {
      const root = stackRef.current;
      if (!root) return undefined;

      if (prefersReducedMotion()) {
        const timer = window.setTimeout(() => refreshScroll(), 120);
        return () => window.clearTimeout(timer);
      }

      const planes = root.querySelectorAll('[data-kinetic-plane]');
      const timelines = Array.from(planes).map((plane, index) => {
        // About owns its own choreography — skip plane-level reveal there.
        if (plane.id === 'about') return null;
        return revealSection(plane, {
          refreshPriority: index,
          start: 'top 84%',
          y: 40,
          scale: 0.98,
          childY: 30,
          stagger: 0.08,
          duration: 0.68,
        });
      });

      const timer = window.setTimeout(() => refreshScroll(), 200);
      return () => {
        window.clearTimeout(timer);
        timelines.forEach((tl) => {
          tl?.scrollTrigger?.kill();
          tl?.kill();
        });
      };
    },
    { scope: stackRef, dependencies: [scenes], revertOnUpdate: true },
  );

  return (
    <div className="kinetic-sections" id="kinetic-sections" ref={stackRef}>
      {scenes.map((section, index) => {
        const chapter = String(index + 1).padStart(2, '0');

        if (section.kind === 'about') {
          return (
            <section key={section.id} id={section.id} className="kinetic-plane" data-kinetic-plane>
              <About personal={personal} index={index} />
            </section>
          );
        }

        if (section.kind === 'skills') {
          return (
            <section key={section.id} id={section.id} className="kinetic-plane" data-kinetic-plane>
              <Skills skills={skills} index={index} />
            </section>
          );
        }

        if (section.kind === 'contact') {
          return (
            <section key={section.id} id={section.id} className="kinetic-plane" data-kinetic-plane>
              <Contact
                email={personal?.email}
                github={socials?.github}
                linkedin={socials?.linkedin}
                website={socials?.website}
                index={index}
              />
            </section>
          );
        }

        const sectionData = getSectionEntry(section, data);
        const itemType = resolveItemType(section);

        return (
          <section
            key={section.id}
            id={section.id}
            className="kinetic-plane kinetic-dynamic"
            data-kinetic-plane
          >
            <div className="kinetic-section-head" data-reveal>
              <p className="kinetic-eyebrow">
                <span>{chapter}</span>
                <i aria-hidden="true" />
                <span>{section.name}</span>
              </p>
              <h2>{section.name}</h2>
            </div>
            <div data-reveal>
              <LayoutRenderer
                sectionData={sectionData}
                sectionId={section.id}
                layoutType={section['layout-type']}
                dataType={section['data-type']}
                itemType={itemType}
                sectionName={section.name}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}

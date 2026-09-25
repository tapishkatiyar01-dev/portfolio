'use client';

import { useMemo } from 'react';
import About from './About';
import Contact from './Contact';
import Skills from './Skills';
import LayoutRenderer from './layouts/LayoutRenderer';
import CinematicScene from './cinematic/CinematicScene';
import { buildSceneManifest } from './cinematic/buildSceneManifest';
import { recipeForKind } from './cinematic/sceneRecipes';

/**
 * Stacked cinematic reel — HUD rail navigation.
 * All scenes: flow scrub handoffs (no sticky pin).
 */
export default function SectionTabs({ personal, socials, skills, Sections = [], data = {} }) {
  const scenes = useMemo(() => buildSceneManifest({ Sections }), [Sections]);
  const sceneCount = scenes.length + 1;

  return (
    <div className="sinematic-sections sinematic-reel" id="sinematic-sections">
      {scenes.map((scene, index) => {
        const recipe = recipeForKind(scene.kind, index);
        const sceneIndex = index + 1;

        return (
          <CinematicScene
            key={scene.id}
            id={scene.id}
            index={sceneIndex}
            label={scene.label}
            recipe={recipe}
          >
            {({ compact }) => (
              <div className="sinematic-scene-body">
                <header className="sinematic-scene-meta">
                  <span>
                    {String(sceneIndex + 1).padStart(2, '0')} / {String(sceneCount).padStart(2, '0')}
                  </span>
                  <p>{scene.label}</p>
                </header>

                {scene.kind === 'about' && (
                  <About personal={personal} compact={compact} />
                )}
                {scene.kind === 'skills' && (
                  <Skills skills={skills} compact={compact} />
                )}
                {scene.kind === 'contact' && (
                  <Contact
                    email={personal?.email}
                    github={socials?.github}
                    linkedin={socials?.linkedin}
                    website={socials?.website}
                  />
                )}
                {scene.kind === 'dynamic' && scene.section && (
                  <section className="sinematic-panel sinematic-dynamic-scene">
                    <div className="sinematic-panel-number">{scene.section.name}</div>
                    <LayoutRenderer
                      sectionData={(() => {
                        const e = data[scene.section['data-source'] || scene.section.id];
                        if (!e) return { items: [], total: 0, hasMore: false };
                        return Array.isArray(e)
                          ? { items: e, total: e.length, hasMore: false }
                          : e;
                      })()}
                      sectionId={scene.section.id}
                      layoutType={scene.section['layout-type']}
                      dataType={scene.section['data-type']}
                      itemType={scene.section['data-source'] || scene.section['data-type']}
                      sectionName={scene.section.name}
                    />
                  </section>
                )}
              </div>
            )}
          </CinematicScene>
        );
      })}
    </div>
  );
}

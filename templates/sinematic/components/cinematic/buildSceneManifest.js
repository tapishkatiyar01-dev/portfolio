/**
 * Build the ordered cinematic reel from the same data contract page.js already uses.
 * Fixed bookends: about → skills → Sections[] → contact
 * (Hero is Scene 0, rendered by page.js outside SectionTabs.)
 */

export function buildSceneManifest({ Sections = [] } = {}) {
  const dynamic = (Sections || []).map((section) => ({
    id: section.id,
    kind: 'dynamic',
    label: section.name,
    section,
  }));

  return [
    { id: 'about', kind: 'about', label: 'About' },
    { id: 'skills', kind: 'skills', label: 'Skills' },
    ...dynamic,
    { id: 'contact', kind: 'contact', label: 'Contact' },
  ];
}

/** Full nav order including home — mirrors Layout navItems. */
export function buildFullSceneIds({ Sections = [] } = {}) {
  return ['home', ...buildSceneManifest({ Sections }).map((s) => s.id)];
}

'use client';

import { getRecordFields } from './layouts/layoutUtils';
import { SINEMATIC_STAGE_LIMIT } from './sceneConfig';

/**
 * Build cinematic stage cards from the active section’s real records.
 * Decorative landscape stills are not used here.
 */
export function buildStageItems({
  activeId,
  personal,
  skills = [],
  socials,
  section,
  data = {},
}) {
  if (!activeId || activeId === 'home') return [];

  if (activeId === 'about') {
    const portrait = personal?.Avatar || personal?.Logo;
    const cards = [
      {
        id: 'about-portrait',
        title: personal?.name || 'Profile',
        subtitle: personal?.designation || '',
        image: portrait || '',
        kind: 'profile',
      },
      ...(personal?.traits || []).slice(0, 3).map((trait, index) => ({
        id: `about-trait-${index}`,
        title: trait,
        subtitle: 'Focus',
        image: '',
        kind: 'trait',
      })),
    ];
    return cards.slice(0, SINEMATIC_STAGE_LIMIT);
  }

  if (activeId === 'skills') {
    return skills.slice(0, SINEMATIC_STAGE_LIMIT).map((skill, index) => ({
      id: `skill-${skill.name || index}`,
      title: skill.name || `Skill ${index + 1}`,
      subtitle: skill.level || 'Capability',
      image: '',
      kind: 'skill',
    }));
  }

  if (activeId === 'contact') {
    return [
      personal?.email && {
        id: 'contact-email',
        title: personal.email,
        subtitle: 'Email',
        image: '',
        kind: 'contact',
      },
      socials?.github && {
        id: 'contact-github',
        title: 'GitHub',
        subtitle: 'Social',
        image: '',
        kind: 'contact',
      },
      socials?.linkedin && {
        id: 'contact-linkedin',
        title: 'LinkedIn',
        subtitle: 'Social',
        image: '',
        kind: 'contact',
      },
      socials?.website && {
        id: 'contact-website',
        title: 'Website',
        subtitle: 'Link',
        image: '',
        kind: 'contact',
      },
    ]
      .filter(Boolean)
      .slice(0, SINEMATIC_STAGE_LIMIT);
  }

  if (!section) return [];

  const source = section['data-source'] || section.id;
  const itemType = section['data-source'] || section['data-type'];
  const dataType = section['data-type'];
  const entry = data[source];
  const records = Array.isArray(entry) ? entry : entry?.items || [];

  return records.slice(0, SINEMATIC_STAGE_LIMIT).map((item, index) => {
    const fields = getRecordFields(item, dataType, itemType);
    return {
      id: `${source}-${fields.title || index}-${index}`,
      title: fields.title || 'Untitled',
      subtitle: fields.subtitle || fields.date || section.name || '',
      image: fields.image || '',
      kind: itemType || 'record',
      tags: fields.tags?.slice?.(0, 2) || [],
    };
  });
}

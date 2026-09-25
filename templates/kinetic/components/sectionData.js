/**
 * Section data lookup — matches THEME_GUIDE.md:
 * primary key is `data-source || id`, then resilient fallbacks.
 */
const PRESENTATION_TYPES = ['full', 'minimal', 'listview'];

export function getSectionEntry(section, data = {}) {
  const primary = section?.['data-source'] || section?.id;
  const keys = [primary, section?.id, section?.['data-source'], section?.['data-type']].filter(
    (key, index, list) => Boolean(key) && list.indexOf(key) === index,
  );

  let entry;
  for (const key of keys) {
    if (data[key] != null) {
      entry = data[key];
      break;
    }
  }

  if (!entry) return { items: [], total: 0, hasMore: false };
  if (Array.isArray(entry)) return { items: entry, total: entry.length, hasMore: false };
  return {
    items: entry.items || [],
    total: entry.total ?? (entry.items || []).length,
    hasMore: entry.hasMore ?? false,
  };
}

/** Field-mapping type: never use presentation data-types as record shape keys. */
export function resolveItemType(section) {
  const dataType = section?.['data-type'];
  if (section?.['data-source'] && !PRESENTATION_TYPES.includes(section['data-source'])) {
    if (PRESENTATION_TYPES.includes(dataType)) return section.id;
    return dataType || section.id;
  }
  if (PRESENTATION_TYPES.includes(dataType)) return section.id;
  return dataType || section.id;
}

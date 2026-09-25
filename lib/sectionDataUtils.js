/**
 * Extract the items array from a paginated section data entry.
 * Handles both the new shape { items, total, hasMore } and legacy plain arrays.
 */
export function getSectionItems(entry) {
  if (!entry) return [];
  if (Array.isArray(entry)) return entry;
  if (Array.isArray(entry.items)) return entry.items;
  return [];
}

export function getSectionMeta(entry) {
  if (!entry) return { items: [], total: 0, hasMore: false };
  if (Array.isArray(entry)) return { items: entry, total: entry.length, hasMore: false };
  return {
    items: entry.items || [],
    total: entry.total ?? (entry.items || []).length,
    hasMore: entry.hasMore ?? false,
  };
}

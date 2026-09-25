export function getItemTitle(item, dataType) {
  if (dataType === 'project') return item.title || 'Untitled Project';
  if (dataType === 'experience') return item.role || 'Untitled Role';
  if (dataType === 'education') return item.degree || 'Untitled Degree';
  return item.name || item.title || 'Untitled';
}

export function getItemSubtitle(item, dataType) {
  if (dataType === 'project') return item.path || `~/projects/${slugify(item.title || 'project')}`;
  if (dataType === 'experience') return item.company || 'Independent';
  if (dataType === 'education') return item.institution || 'Institution';
  return item.company || item.institution || '';
}

export function getItemDate(item, dataType) {
  if (dataType === 'project') return item.date || 'Active';
  if (dataType === 'experience') return `${item.start || 'N/A'} - ${item.end || 'Present'}`;
  if (dataType === 'education') return `${item.start || 'N/A'} - ${item.end || 'Present'}`;
  return item.date || 'N/A';
}

export function getItemDescription(item) {
  if (Array.isArray(item.description)) return item.description;
  if (item.summary) return item.summary;
  if (item.description) return item.description;
  return '';
}

export function getItemTags(item, dataType) {
  if (dataType === 'project') return item.tags || [];
  if (dataType === 'experience') return item.technologies || [];
  if (dataType === 'education') return [item.fieldOfStudy, item.grade].filter(Boolean);
  return item.tags || item.technologies || [];
}

export function getItemKind(dataType) {
  if (dataType === 'project') return 'PROJECT';
  if (dataType === 'experience') return 'EXPERIENCE';
  if (dataType === 'education') return 'EDUCATION';
  return 'ITEM';
}

export function getListHeaders(dataType) {
  if (dataType === 'project') return ['Project', 'Tech Stack', 'Status'];
  if (dataType === 'experience') return ['Role', 'Company', 'Period'];
  if (dataType === 'education') return ['Degree', 'Institution', 'Period'];
  return ['Name', 'Type', 'Date'];
}

export function getItemLinks(item) {
  if (!item.links) return [];
  if (Array.isArray(item.links)) return item.links.filter((link) => link?.href);
  return Object.entries(item.links)
    .filter(([, href]) => Boolean(href))
    .map(([label, href]) => ({ label, href }));
}

export function isMinimalDataType(dataType) {
  return dataType === 'minimal';
}

/** Normalize record fields. `minimal` → title, summary, tags only. */
export function getRecordFields(item, dataType, itemType = dataType) {
  const fields = {
    title: getItemTitle(item, itemType),
    subtitle: getItemSubtitle(item, itemType),
    summary: getItemDescription(item),
    tags: getItemTags(item, itemType),
    links: getItemLinks(item),
    date: getItemDate(item, itemType),
    image: typeof item.image === 'string' ? item.image : '',
  };

  if (dataType === 'minimal') {
    return {
      title: fields.title,
      subtitle: '',
      summary: fields.summary,
      tags: fields.tags,
      links: [],
      date: '',
      image: '',
    };
  }

  return fields;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

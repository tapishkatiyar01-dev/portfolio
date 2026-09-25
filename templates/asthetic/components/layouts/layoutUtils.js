export function getItemTitle(item, dataType) {
  if (dataType === 'project') return item.title;
  if (dataType === 'experience') return item.role;
  if (dataType === 'education') return item.degree;
  return item.title || item.name || item.role || item.degree || '';
}

export function getItemSubtitle(item, dataType) {
  if (dataType === 'project') return item.path;
  if (dataType === 'experience') return item.company;
  if (dataType === 'education') return item.institution;
  return item.subtitle || item.company || item.institution || '';
}

export function getItemDate(item, dataType) {
  if (dataType === 'project') return item.date || 'Active';
  if (dataType === 'experience') return `${item.start || ''}${item.end ? ` — ${item.end}` : ''}`.trim();
  if (dataType === 'education') return `${item.start || ''}${item.end ? ` — ${item.end}` : ''}`.trim();
  return item.date || item.period || '';
}

export function getItemDescription(item) {
  if (Array.isArray(item.description)) return item.description;
  if (item.summary) return item.summary;
  if (item.description) return item.description;
  return '';
}

export function getItemTags(item, dataType) {
  if (dataType === 'experience') return item.technologies || [];
  if (dataType === 'education') return [item.fieldOfStudy, item.grade].filter(Boolean);
  return item.tags || item.technologies || [];
}

export function getItemKind(dataType) {
  if (dataType === 'project') return 'Project';
  if (dataType === 'experience') return 'Experience';
  if (dataType === 'education') return 'Education';
  return 'Record';
}

export function getListHeaders(dataType) {
  if (dataType === 'project') return ['Project', 'Summary', 'Stack', 'Links'];
  if (dataType === 'experience') return ['Role', 'Summary', 'Company', 'Period'];
  if (dataType === 'education') return ['Degree', 'Summary', 'Institution', 'Period'];
  return ['Title', 'Summary', 'Meta', 'Date'];
}

export function getItemLinks(item) {
  if (!item.links) return [];

  return Object.entries(item.links)
    .filter(([, href]) => Boolean(href))
    .map(([label, href]) => ({ label, href }));
}

export function isMinimalDataType(dataType) {
  return dataType === 'minimal';
}

export function getImageSource(value) {
  if (!value || typeof value !== 'string') return '';
  if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
  return `/${value.replace(/^\.\//, '')}`;
}

export function getRecordFields(item, dataType, itemType = dataType) {
  const fields = {
    title: getItemTitle(item, itemType),
    subtitle: getItemSubtitle(item, itemType),
    summary: getItemDescription(item),
    tags: getItemTags(item, itemType),
    links: getItemLinks(item),
    date: getItemDate(item, itemType),
    image: getImageSource(item.image),
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

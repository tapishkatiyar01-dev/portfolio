export function title(item, type) {
  if (type === 'project') return item.title || '';
  if (type === 'experience') return item.role || '';
  if (type === 'education') return item.degree || '';
  return item.title || item.name || item.role || item.degree || '';
}

export function subtitle(item, type) {
  if (type === 'project') return item.path || '';
  if (type === 'experience') return item.company || '';
  if (type === 'education') return item.institution || '';
  return item.subtitle || item.company || item.institution || '';
}

export function description(item) {
  return Array.isArray(item.description) ? item.description : item.summary || item.description || '';
}

export function tags(item, type) {
  if (type === 'experience') return item.technologies || [];
  if (type === 'education') return [item.fieldOfStudy, item.grade].filter(Boolean);
  return item.tags || item.technologies || [];
}

export function date(item, type) {
  if (type === 'project') return item.date || '';
  if (type === 'education' || type === 'experience') {
    return `${item.start || ''}${item.end ? ` — ${item.end}` : ''}`.trim();
  }
  return item.date || item.period || '';
}

export function links(item) {
  if (Array.isArray(item.links)) return item.links.filter((link) => link?.href);
  return Object.entries(item.links || {})
    .map(([label, href]) => ({ label, href }))
    .filter((link) => link.href);
}

export function imageSource(value) {
  if (!value || typeof value !== 'string') return '';
  if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
  return `/${value.replace(/^\.\//, '')}`;
}

export function isMinimalDataType(dataType) {
  return dataType === 'minimal';
}

export function getRecordFields(item, dataType, itemType = dataType) {
  const fields = {
    title: title(item, itemType),
    subtitle: subtitle(item, itemType),
    summary: description(item),
    tags: tags(item, itemType),
    links: links(item),
    date: date(item, itemType),
    image: imageSource(item.image),
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

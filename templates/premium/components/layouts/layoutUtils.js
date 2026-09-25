export function getTitle(item, dataType) {
  if (dataType === 'project') return item.title || 'Untitled project';
  if (dataType === 'experience') return item.role || 'Untitled role';
  if (dataType === 'education') return item.degree || 'Untitled degree';
  return item.title || item.name || item.role || item.degree || 'Untitled item';
}

export function getSubtitle(item, dataType) {
  if (dataType === 'project') return item.path || 'Project';
  if (dataType === 'experience') return item.company || 'Independent';
  if (dataType === 'education') return item.institution || 'Institution';
  return item.subtitle || item.company || item.institution || '';
}

export function getSummary(item) {
  return Array.isArray(item.description) ? item.description : item.summary || item.description || 'No description available.';
}

export function getTags(item, dataType) {
  if (dataType === 'experience') return item.technologies || [];
  if (dataType === 'education') return [item.fieldOfStudy, item.grade].filter(Boolean);
  return item.tags || item.technologies || [];
}

export function getDate(item, dataType) {
  if (dataType === 'project') return item.date || 'Active';
  return `${formatDatePart(item.start)} – ${formatDatePart(item.end || 'Present')}`;
}

function formatDatePart(value) {
  if (!value || value === 'Present') return 'Present';
  const match = String(value).match(/^(\d{4})(?:-(\d{1,2}))?/);
  if (!match) return value;
  const [, year, month] = match;
  if (!month) return year;
  const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1];
  return monthName ? `${monthName} ${year}` : value;
}

export function getLinks(item) {
  return Object.entries(item.links || {}).map(([label, href]) => ({ label, href })).filter((link) => link.href);
}

export function getImageSource(value) {
  if (!value || typeof value !== 'string') return '';
  if (/^(https?:|data:|blob:|\/)/i.test(value)) return value;
  return `/${value.replace(/^\.\//, '')}`;
}

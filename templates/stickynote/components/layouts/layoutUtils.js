export function title(item, type) { return type === 'project' ? item.title : type === 'experience' ? item.role : type === 'education' ? item.degree : item.title || item.name || item.role || item.degree || ''; }
export function subtitle(item, type) { return type === 'project' ? item.path : type === 'experience' ? item.company : type === 'education' ? item.institution : item.subtitle || item.company || item.institution || ''; }
export function summary(item) { return Array.isArray(item.description) ? item.description : item.summary || item.description || ''; }
export function tags(item, type) { return type === 'experience' ? item.technologies || [] : type === 'education' ? [item.fieldOfStudy, item.grade].filter(Boolean) : item.tags || item.technologies || []; }
export function image(value) { if (!value || typeof value !== 'string') return ''; return /^(https?:|data:|blob:|\/)/i.test(value) ? value : `/${value.replace(/^\.\//, '')}`; }
export function links(item) { return Object.entries(item.links || {}).filter(([, href]) => href).map(([label, href]) => ({ label, href })); }

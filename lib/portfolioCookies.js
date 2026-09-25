/**
 * Portfolio UI persistence cookies.
 * Keys are scoped per template so arcade/kinetic/etc. keep independent state.
 */

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const COLOR_THEME_PREFIX = 'portfolio_color_theme';
export const SECTION_ID_PREFIX = 'portfolio_section_id';
export const TEMPLATE_COOKIE = 'portfolio_template';

export function colorThemeCookieName(template) {
  return template ? `${COLOR_THEME_PREFIX}_${template}` : COLOR_THEME_PREFIX;
}

export function sectionIdCookieName(template) {
  return template ? `${SECTION_ID_PREFIX}_${template}` : SECTION_ID_PREFIX;
}

export function parseCookiePair(source, name) {
  if (!source || !name) return '';
  const parts = String(source).split(';');
  for (const part of parts) {
    const [rawKey, ...rest] = part.trim().split('=');
    if (rawKey === name) {
      try {
        return decodeURIComponent(rest.join('=') || '');
      } catch {
        return rest.join('=') || '';
      }
    }
  }
  return '';
}

/** Server / universal: read from a cookie store Map-like or Next cookies(). */
export function readCookieStore(cookieStore, name) {
  if (!cookieStore || !name) return '';
  try {
    const entry = typeof cookieStore.get === 'function' ? cookieStore.get(name) : null;
    if (!entry) return '';
    return typeof entry === 'string' ? entry : entry.value || '';
  } catch {
    return '';
  }
}

export function getClientCookie(name) {
  if (typeof document === 'undefined') return '';
  return parseCookiePair(document.cookie, name);
}

export function setClientCookie(name, value, maxAge = COOKIE_MAX_AGE) {
  if (typeof document === 'undefined' || !name) return;
  const encoded = encodeURIComponent(String(value ?? ''));
  const secure =
    typeof window !== 'undefined' && window.location?.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${name}=${encoded}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function normalizeColorTheme(value, fallback = 'light') {
  return value === 'dark' || value === 'light' ? value : fallback;
}

export function resolveSectionId(value, validIds = [], fallback = 'about') {
  if (value && validIds.includes(value)) return value;
  if (validIds.includes(fallback)) return fallback;
  return validIds[0] || fallback;
}

export function getPersistedColorTheme(template, fallback = 'light') {
  return normalizeColorTheme(
    getClientCookie(colorThemeCookieName(template)) || getClientCookie(COLOR_THEME_PREFIX),
    fallback,
  );
}

export function setPersistedColorTheme(template, value) {
  const theme = normalizeColorTheme(value, 'light');
  setClientCookie(colorThemeCookieName(template), theme);
  setClientCookie(COLOR_THEME_PREFIX, theme);
  return theme;
}

export function getPersistedSectionId(template, validIds = [], fallback = 'about') {
  return resolveSectionId(
    getClientCookie(sectionIdCookieName(template)) || getClientCookie(SECTION_ID_PREFIX),
    validIds,
    fallback,
  );
}

export function setPersistedSectionId(template, sectionId) {
  if (!sectionId) return;
  setClientCookie(sectionIdCookieName(template), sectionId);
  setClientCookie(SECTION_ID_PREFIX, sectionId);
}

export function setPersistedTemplate(template) {
  if (!template) return;
  setClientCookie(TEMPLATE_COOKIE, template);
}

/** Read SSR cookie values for a template (Next.js cookies()). */
export function readPortfolioPersistence(cookieStore, template) {
  const colorTheme = normalizeColorTheme(
    readCookieStore(cookieStore, colorThemeCookieName(template)) ||
      readCookieStore(cookieStore, COLOR_THEME_PREFIX),
    '',
  );
  const sectionId =
    readCookieStore(cookieStore, sectionIdCookieName(template)) ||
    readCookieStore(cookieStore, SECTION_ID_PREFIX) ||
    '';
  const savedTemplate = readCookieStore(cookieStore, TEMPLATE_COOKIE) || '';
  return {
    colorTheme: colorTheme || null,
    sectionId: sectionId || null,
    savedTemplate: savedTemplate || null,
  };
}

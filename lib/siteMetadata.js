const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;
const PRODUCTION_SITE_URL = 'https://chahak-jain.vercel.app';

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (explicit) {
    const raw = String(explicit).trim().replace(/\/$/, '');
    if (/^https?:\/\//i.test(raw)) return raw;
    return `https://${raw}`;
  }
  if (process.env.NODE_ENV === 'development') return 'http://localhost:3000';
  return PRODUCTION_SITE_URL;
}

export function getAvatarUrl(personal = {}) {
  const src = personal.Avatar || personal.Logo || '';
  return typeof src === 'string' ? src.trim() : '';
}

/** Cloudinary resize. Skips GIFs and already-transformed URLs. */
export function sizedImageUrl(url, { width, height, gravity = 'face', format } = {}) {
  if (!url || !width) return url;
  if (/^(data:|blob:)/i.test(url) || /\.gif(?:[?#]|$)/i.test(url)) return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (/\/upload\/[^/]*\bw_/.test(url)) return url;
  const bits = [`w_${Math.round(width)}`, 'c_fill', `g_${gravity}`, 'q_auto'];
  if (height) bits.splice(1, 0, `h_${Math.round(height)}`);
  bits.push(format ? `f_${format}` : 'f_auto');
  return url.replace('/upload/', `/upload/${bits.join(',')}/`);
}

function clip(text, max) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

function skillLabels(skills = []) {
  return skills
    .map((skill) => (typeof skill === 'string' ? skill : skill?.name))
    .filter(Boolean);
}

export function buildPortfolioMetadata({ personal = {}, socials = {}, skills = [] } = {}) {
  const name = personal.name?.trim() || 'Portfolio';
  const role = personal.designation?.trim() || '';
  const fullTitle = role ? `${name} · ${role}` : name;
  const description = clip(
    personal.summary || personal.description || `${name}${role ? ` — ${role}` : ''} portfolio.`,
    DESCRIPTION_MAX,
  );
  const siteUrl = getSiteUrl();
  const avatar = getAvatarUrl(personal);
  const ogImage = avatar ? sizedImageUrl(avatar, { width: 800, height: 800 }) : undefined;
  const keywords = [...new Set([
    name,
    role,
    personal.location,
    ...(personal.traits || []),
    ...skillLabels(skills).slice(0, 16),
    'portfolio',
  ].filter(Boolean))];

  const lastName = name.split(/\s+/).slice(1).join(' ');
  const verification = process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined;

  return {
    metadataBase: new URL(siteUrl),
    title: clip(fullTitle, TITLE_MAX),
    description,
    applicationName: `${name} Portfolio`,
    authors: [{ name, url: socials.website || socials.linkedin || siteUrl }],
    creator: name,
    publisher: name,
    keywords,
    category: 'portfolio',
    referrer: 'origin-when-cross-origin',
    formatDetection: { telephone: false, email: false, address: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: { canonical: '/' },
    ...(verification ? { verification } : {}),
    openGraph: {
      type: 'profile',
      url: siteUrl,
      siteName: `${name} Portfolio`,
      title: fullTitle,
      description,
      locale: 'en_US',
      firstName: name.split(/\s+/)[0],
      ...(lastName ? { lastName } : {}),
      ...(ogImage
        ? { images: [{ url: ogImage, width: 800, height: 800, alt: `${name} portrait` }] }
        : {}),
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export function buildPersonJsonLd({ personal = {}, socials = {}, skills = [] } = {}) {
  const name = personal.name?.trim() || 'Portfolio';
  const siteUrl = getSiteUrl();
  const avatar = getAvatarUrl(personal);
  const sameAs = [socials.linkedin, socials.github, socials.website, socials.twitter, socials.x]
    .filter(Boolean);

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    url: siteUrl,
    jobTitle: personal.designation || undefined,
    description: personal.summary || personal.description || undefined,
    email: personal.email || undefined,
    image: avatar || undefined,
    address: personal.location
      ? { '@type': 'PostalAddress', addressLocality: personal.location }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    knowsAbout: skillLabels(skills).slice(0, 24),
  };
}

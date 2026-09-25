const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;
  if (explicit) return String(explicit).replace(/\/$/, '');
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}

export function getAvatarUrl(personal = {}) {
  const src = personal.Avatar || personal.Logo || '';
  return typeof src === 'string' ? src.trim() : '';
}

/** Square crop for Cloudinary portraits so favicons and OG tiles are not letterboxed. */
export function sizedImageUrl(url, { width, height } = {}) {
  if (!url || !width || !height) return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  const transform = `w_${width},h_${height},c_fill,g_face,f_png,q_auto`;
  return url.replace('/upload/', `/upload/${transform}/`);
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
    openGraph: {
      type: 'profile',
      url: siteUrl,
      siteName: `${name} Portfolio`,
      title: fullTitle,
      description,
      locale: 'en_US',
      firstName: name.split(/\s+/)[0],
      lastName: name.split(/\s+/).slice(1).join(' ') || undefined,
      images: ogImage
        ? [{ url: ogImage, width: 800, height: 800, alt: `${name} portrait` }]
        : undefined,
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
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

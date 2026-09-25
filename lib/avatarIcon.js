import { ImageResponse } from 'next/og';
import { getPortfolioData } from '@/lib/portfolioRepository';
import { getAvatarUrl, sizedImageUrl } from '@/lib/siteMetadata';

export async function renderAvatarIcon({ width, height }) {
  const { personal } = await getPortfolioData();
  const avatar = getAvatarUrl(personal);
  const src = avatar ? sizedImageUrl(avatar, { width, height, format: 'png' }) : '';
  const initial = (personal?.name || 'P').trim().charAt(0).toUpperCase();

  const lettermark = () =>
    new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#17191c',
            color: '#f7f5ed',
            fontSize: Math.round(height * 0.48),
            fontWeight: 700,
          }}
        >
          {initial}
        </div>
      ),
      { width, height },
    );

  if (!src) return lettermark();

  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            overflow: 'hidden',
            background: '#111',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            width={width}
            height={height}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ),
      { width, height },
    );
  } catch (error) {
    console.error('Failed to render avatar icon', error);
    return lettermark();
  }
}

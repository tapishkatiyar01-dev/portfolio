import './globals.css';
import { getPortfolioData } from '@/lib/portfolioRepository';
import { buildPersonJsonLd, buildPortfolioMetadata } from '@/lib/siteMetadata';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const data = await getPortfolioData();
  return buildPortfolioMetadata(data);
}

export default async function RootLayout({ children }) {
  const data = await getPortfolioData();
  const jsonLd = buildPersonJsonLd(data);

  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

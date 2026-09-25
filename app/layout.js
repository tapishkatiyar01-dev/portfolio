// D:\Project_2026\portfolio\app\layout.js
import './globals.css';
import { getPortfolioData } from '@/lib/portfolioRepository';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata() {
  const data = await getPortfolioData();
  return {
    title: `${data.personal.name} - ${data.personal.designation}`,
    description: data.personal.summary,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Premium Signal Folio: ink/mist private-press portfolio — Syne + Figtree, chartreuse/cobalt signal, full-bleed architectural hero. */}
        {children}
      </body>
    </html>
  );
}

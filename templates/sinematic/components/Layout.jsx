'use client';

import './globals.css';
import { useEffect, useMemo } from 'react';
import { useEmailJsKeepalive } from '@/lib/emailjs';
import { setPersistedTemplate } from '@/lib/portfolioCookies';
import { SinematicMotionProvider, SinematicSceneProvider } from './motionConfig';
import CinematicBackground from './ui/CinematicBackground';
import DirectorSlate from './ui/DirectorSlate';
import FilmGrain from './ui/FilmGrain';
import HudChrome from './ui/HudChrome';

export default function Layout({
  children,
  personal,
  socials,
  skills = [],
  Sections = [],
  initialSectionId = null,
}) {
  useEmailJsKeepalive();
  const navItems = useMemo(
    () => [
      { id: 'home', label: personal?.homeLabel || 'Home' },
      { id: 'about', label: 'About' },
      { id: 'skills', label: 'Skills' },
      ...Sections.map((section) => ({ id: section.id, label: section.name })),
      { id: 'contact', label: personal?.contactLabel || 'Contact' },
    ],
    [Sections, personal?.contactLabel, personal?.homeLabel],
  );

  useEffect(() => {
    setPersistedTemplate('sinematic');
  }, []);

  return (
    <SinematicMotionProvider>
      <SinematicSceneProvider navItems={navItems} initialSectionId={initialSectionId}>
        <div className="sinematic-app">
          <CinematicBackground />
          <FilmGrain />
          <HudChrome personal={personal} socials={socials} navItems={navItems} />
          <DirectorSlate personal={personal} />
          <main className="sinematic-main">{children}</main>
        </div>
      </SinematicSceneProvider>
    </SinematicMotionProvider>
  );
}

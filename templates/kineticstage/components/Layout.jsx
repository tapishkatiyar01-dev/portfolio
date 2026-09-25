'use client';

import './globals.css';
import { useRef, useState } from 'react';
import { useEmailJsKeepalive } from '@/lib/emailjs';
import { usePersistedColorTheme } from '@/lib/usePortfolioPersistence';
import {
  getGsap,
  prefersReducedMotion,
  registerStageGsap,
  useGSAP,
} from './gsapSetup';
import { StageSceneProvider, useStageScene } from './sceneContext';
import StageBackdrop from './ui/StageBackdrop';
import StageCursor from './ui/StageCursor';

registerStageGsap();

const TAB_EVENT = 'kineticstage:select-tab';

function StageShell({ children, personal, Sections = [], initialColorTheme = null }) {
  useEmailJsKeepalive();
  const rootRef = useRef(null);
  const { scene, setScene } = useStageScene();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = usePersistedColorTheme('kineticstage', {
    initialValue: initialColorTheme,
    fallback: 'light',
  });
  const name = personal?.name || '';
  const initials =
    personal?.monogram ||
    personal?.logoText ||
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    ...Sections.map((section) => ({ id: section.id, label: section.name })),
    { id: 'contact', label: 'Contact' },
  ];

  // When hero is in view, restore the home backdrop scene.
  useGSAP(
    () => {
      const { ScrollTrigger } = getGsap();
      if (!ScrollTrigger) return undefined;

      const trigger = ScrollTrigger.create({
        trigger: '#home',
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => setScene('home'),
        onEnterBack: () => setScene('home'),
      });

      return () => trigger.kill();
    },
    { scope: rootRef, dependencies: [setScene] },
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return undefined;
      const { gsap } = getGsap();
      if (!gsap) return undefined;

      const line = rootRef.current?.querySelector('.kineticstage-scroll-line');
      if (!line) return undefined;

      gsap.to(line, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: rootRef },
  );

  const closeMenu = () => setMenuOpen(false);

  const goTo = (id) => {
    closeMenu();
    if (id === 'home') {
      setScene('home');
      return;
    }
    setScene(id);
    window.dispatchEvent(new CustomEvent(TAB_EVENT, { detail: id }));
  };

  return (
    <div
      className={`kineticstage-app${menuOpen ? ' is-nav-open' : ''}`}
      data-ks-theme={theme}
      data-ks-scene={scene}
      ref={rootRef}
    >
      <StageBackdrop />
      <StageCursor />

      <div className="kineticstage-scroll-track" aria-hidden="true">
        <i className="kineticstage-scroll-line" />
      </div>

      <header className={`kineticstage-header${menuOpen ? ' is-open' : ''}`}>
        <a
          className="kineticstage-brand"
          href="#home"
          aria-label={`${name} home`}
          onClick={() => goTo('home')}
        >
          <span className="kineticstage-brand-mark">{initials || 'JD'}</span>
          <strong>{name || 'Portfolio'}</strong>
        </a>

        <nav className="kineticstage-pill-nav" aria-label="Primary navigation">
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.id === 'home' ? '#home' : '#kineticstage-sections'}
                  onClick={() => goTo(link.id)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="kineticstage-header-actions">
          <div className="kineticstage-theme-toggle" role="group" aria-label="Color theme">
            <button
              type="button"
              className={theme === 'light' ? 'is-active' : ''}
              aria-pressed={theme === 'light'}
              onClick={() => setTheme('light')}
            >
              Light
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'is-active' : ''}
              aria-pressed={theme === 'dark'}
              onClick={() => setTheme('dark')}
            >
              Dark
            </button>
          </div>

          <button
            className="kineticstage-menu"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        <div className="kineticstage-mobile-nav">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.id === 'home' ? '#home' : '#kineticstage-sections'}
              onClick={() => goTo(link.id)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <main>{children}</main>

      <footer className="kineticstage-footer">
        <span>{name}</span>
        <span>{personal?.location || ''}</span>
        <span>
          © {new Date().getFullYear()}
          {personal?.footerText ? ` · ${personal.footerText}` : ''}
        </span>
        <a href="#home" onClick={() => goTo('home')}>
          Top ↑
        </a>
      </footer>
    </div>
  );
}

export default function Layout({
  children,
  personal,
  Sections = [],
  initialColorTheme = null,
  initialSectionId = null,
}) {
  return (
    <StageSceneProvider initialScene={initialSectionId}>
      <StageShell
        personal={personal}
        Sections={Sections}
        initialColorTheme={initialColorTheme}
      >
        {children}
      </StageShell>
    </StageSceneProvider>
  );
}

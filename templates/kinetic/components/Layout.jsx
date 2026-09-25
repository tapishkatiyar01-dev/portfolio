'use client';

import './globals.css';
import { useRef, useState } from 'react';
import { useEmailJsKeepalive } from '@/lib/emailjs';
import { usePersistedColorTheme } from '@/lib/usePortfolioPersistence';
import {
  getGsap,
  prefersReducedMotion,
  registerKineticGsap,
  useGSAP,
} from './gsapSetup';
import { bindHeaderScroll } from './motionConfig';
import KineticBackdrop from './ui/KineticBackdrop';
import KineticCursor from './ui/KineticCursor';

registerKineticGsap();

export default function Layout({
  children,
  personal,
  Sections = [],
  initialColorTheme = null,
}) {
  useEmailJsKeepalive();
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = usePersistedColorTheme('kinetic', {
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

  useGSAP(
    () => {
      if (prefersReducedMotion()) return undefined;
      const { gsap } = getGsap();
      if (!gsap) return undefined;

      const line = rootRef.current?.querySelector('.kinetic-scroll-line');
      if (line) {
        gsap.to(line, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
      }

      const headerTween = bindHeaderScroll(gsap, headerRef.current);

      return () => {
        headerTween?.scrollTrigger?.kill();
        headerTween?.kill();
      };
    },
    { scope: rootRef },
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      className={`kinetic-app${menuOpen ? ' is-nav-open' : ''}`}
      data-kinetic-theme={theme}
      ref={rootRef}
    >
      <KineticBackdrop />
      <KineticCursor />

      <div className="kinetic-scroll-track" aria-hidden="true">
        <i className="kinetic-scroll-line" />
      </div>

      <header className={`kinetic-header${menuOpen ? ' is-open' : ''}`} ref={headerRef}>
        <a className="kinetic-brand" href="#home" aria-label={`${name} home`} onClick={closeMenu}>
          <span className="kinetic-brand-mark">{initials || 'MK'}</span>
          <strong>{name || 'Portfolio'}</strong>
        </a>

        <nav className="kinetic-pill-nav" aria-label="Primary navigation">
          <ul>
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="kinetic-header-actions">
          <div className="kinetic-theme-toggle" role="group" aria-label="Color theme">
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
            className="kinetic-menu"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        <div className="kinetic-mobile-nav">
          {links.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={closeMenu}>
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <main>{children}</main>

      <footer className="kinetic-footer">
        <span className="kinetic-footer-brand">{name}</span>
        <span>{personal?.location || ''}</span>
        <span>
          © {new Date().getFullYear()}
          {personal?.footerText ? ` · ${personal.footerText}` : ''}
        </span>
        <a href="#home" className="kinetic-footer-top">
          Top
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M6 10V2M2.5 5.5 6 2l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </footer>
    </div>
  );
}

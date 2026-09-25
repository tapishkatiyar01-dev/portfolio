'use client';

import { useEffect } from 'react';
import { useEmailJsKeepalive } from '@/lib/emailjs';
import { usePersistedColorTheme } from '@/lib/usePortfolioPersistence';
import './globals.css';
import ScrollProgress from './ui/ScrollProgress';

export default function Layout({
  children,
  personal,
  Sections = [],
  initialColorTheme = null,
}) {
  useEmailJsKeepalive();
  const name = personal?.name || '';
  const mark =
    personal?.monogram ||
    personal?.logoText ||
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('');
  const [theme, setTheme] = usePersistedColorTheme('asthetic', {
    initialValue: initialColorTheme,
    fallback: 'dark',
  });
  const isLight = theme === 'light';
  const sectionLinks = [
    { id: 'home', name: personal?.homeLabel || 'Home' },
    { id: 'about', name: 'About' },
    { id: 'skills', name: 'Skills' },
    ...Sections.filter((section) => !['about', 'skills', 'contact', 'home'].includes(section.id)),
    { id: 'contact', name: personal?.contactLabel || 'Contact' },
  ];

  const handleSectionLink = (event, sectionId) => {
    if (sectionId === 'home') return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent('asthetic:select-tab', { detail: sectionId }));
    document
      .getElementById('aesthetic-sections')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    document.documentElement.classList.toggle('aesthetic-light', isLight);
  }, [isLight]);

  return (
    <div className="aesthetic-shell">
      <ScrollProgress />
      <header className="aesthetic-header">
        <a className="aesthetic-mark" href="#home" aria-label={`${name} home`}>
          {mark}
        </a>
        <nav className="aesthetic-nav" aria-label="Primary navigation">
          {sectionLinks.map((section) => (
            <a
              href={section.id === 'home' ? '#home' : '#aesthetic-sections'}
              onClick={(event) => handleSectionLink(event, section.id)}
              key={section.id}
            >
              {section.name}
            </a>
          ))}
        </nav>
        <div className="aesthetic-header-actions">
          <button
            className={`theme-toggle${isLight ? ' is-light' : ''}`}
            type="button"
            aria-label={isLight ? 'Use dark theme' : 'Use light theme'}
            aria-pressed={isLight}
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
          >
            <span aria-hidden="true">☼</span>
            <span aria-hidden="true">◐</span>
          </button>
          <a className="aesthetic-talk" href="#contact">
            {personal?.contactCta || "Let's Talk"}
          </a>
          <button
            className="aesthetic-menu"
            type="button"
            aria-label="Toggle navigation"
            onClick={(event) => event.currentTarget.closest('header').classList.toggle('is-open')}
          >
            ☰
          </button>
        </div>
      </header>
      <main className="aesthetic-main">{children}</main>
      <footer className="aesthetic-footer">
        <span className="aesthetic-mark">{mark}</span>
        <span>{personal?.designation}</span>
        <span>{personal?.location}</span>
        <span className="footer-copy">
          © {new Date().getFullYear()} {name}. {personal?.footerText || 'All rights reserved.'}
        </span>
        <a href="#home" aria-label="Back to top">
          ↑
        </a>
      </footer>
    </div>
  );
}

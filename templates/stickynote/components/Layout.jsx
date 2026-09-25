'use client';

import { MotionConfig } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useEmailJsKeepalive } from '@/lib/emailjs';
import { setPersistedTemplate } from '@/lib/portfolioCookies';
import './globals.css';
import PortfolioCraft from './PortfolioCraft';

export default function Layout({ children, personal, Sections = [] }) {
  useEmailJsKeepalive();
  const [menuOpen, setMenuOpen] = useState(false);
  const name = personal?.name || '';
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 3);
  const navigationLinks = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'skills', name: 'Skills' },
    ...Sections.map((section) => ({ id: section.id, name: section.name })),
    { id: 'contact', name: 'Contact' },
  ];

  useEffect(() => {
    setPersistedTemplate('stickynote');
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="stickynote-app">
        <PortfolioCraft />
        <header className="stickynote-header">
          <a className="stickynote-logo" href="#home" aria-label={`${name} home`}>
            {`{ ${initials || ''} }`}
          </a>
          <button
            className="stickynote-menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="stickynote-navigation"
            onClick={() => setMenuOpen((value) => !value)}
          >
            Menu
          </button>
          <nav id="stickynote-navigation" className={menuOpen ? 'is-open' : ''} aria-label="Primary navigation">
            {navigationLinks.map((link) => (
              <a
                href={link.id === 'home' ? '#home' : '#stickynote-sections'}
                key={link.id}
                onClick={() => {
                  setMenuOpen(false);
                  if (link.id !== 'home') {
                    window.dispatchEvent(new CustomEvent('stickynote:select-tab', { detail: link.id }));
                  }
                }}
              >
                {link.name}
              </a>
            ))}
          </nav>
          <a className="stickynote-lets-talk" href="#contact">
            Let&apos;s talk <span aria-hidden="true">☏</span>
          </a>
        </header>

        <main className="stickynote-container">{children}</main>

        <footer className="stickynote-footer">
          <span>© {new Date().getFullYear()} {name}</span>
          <span>{personal?.designation}</span>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </MotionConfig>
  );
}

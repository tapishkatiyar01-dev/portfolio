'use client';

import { useEffect, useState } from 'react';
import { useEmailJsKeepalive } from '@/lib/emailjs';
import { setPersistedTemplate } from '@/lib/portfolioCookies';
import './globals.css';
import ScrollProgress from './ui/ScrollProgress';

export default function Layout({ children, personal, Sections = [] }) {
  useEmailJsKeepalive();
  const [menuOpen, setMenuOpen] = useState(false);
  const name = personal?.name || '';
  const sectionLinks = [{ id: 'home', name: 'Home' }, ...Sections, { id: 'contact', name: 'Contact' }];

  useEffect(() => {
    setPersistedTemplate('terminal');
  }, []);

  return (
    <div className="terminal-app min-h-screen flex flex-col">
      <ScrollProgress />
      <header className={`terminal-site-header${menuOpen ? ' is-open' : ''}`}>
        <div className="terminal-site-brand">
          <div className="terminal-site-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="terminal-site-name">{name}</span>
        </div>

        {/* <nav id="terminal-site-nav" className="terminal-site-nav" aria-label="Primary navigation">
          {sectionLinks.map((section) => (
            <a
              href={`#${section.id}`}
              key={section.id}
              onClick={() => setMenuOpen(false)}
            >
              {section.name}
            </a>
          ))}
        </nav> */}

        <div className="terminal-site-status" aria-hidden="true">
          <span>{'>'}</span>
          <span>navigate</span>
        </div>
{/* 
        <button
          className="terminal-menu"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="terminal-site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          Menu
        </button> */}
      </header>

      <main className="flex-1 p-4">
        {children}
      </main>

      <footer className="terminal-site-footer">
        <span>{personal?.designation}</span>
        <span>{personal?.location}</span>
        <span className="terminal-site-online">
          status: <span aria-hidden="true">●</span> online
        </span>
      </footer>
    </div>
  );
}

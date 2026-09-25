'use client';

import './globals.css';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useEmailJsKeepalive } from '@/lib/emailjs';
import { usePersistedColorTheme } from '@/lib/usePortfolioPersistence';
import ScrollProgress from './ui/ScrollProgress';
import { premiumNavItemVariants, premiumShellVariants } from './motionConfig';

export default function Layout({
  children,
  personal,
  Sections = [],
  initialColorTheme = null,
}) {
  const [theme, setTheme] = usePersistedColorTheme('premium', {
    initialValue: initialColorTheme,
    fallback: 'dark',
  });
  useEmailJsKeepalive();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const name = personal?.name || '';
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const sectionLinks = [
    { id: 'home', name: 'Home' },
    { id: 'about', name: 'About' },
    { id: 'skills', name: 'Skills' },
    ...Sections,
    { id: 'contact', name: 'Contact' },
  ];

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 800px)');
    const syncSidebar = () => setSidebarOpen(!mobileQuery.matches);
    syncSidebar();
    mobileQuery.addEventListener('change', syncSidebar);
    return () => mobileQuery.removeEventListener('change', syncSidebar);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className={`premium-app${sidebarOpen ? '' : ' is-sidebar-collapsed'}`} data-premium-theme={theme}>
        <ScrollProgress />
        <motion.aside
          className="premium-sidebar"
          variants={shouldReduceMotion ? undefined : premiumShellVariants}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
        >
          <div className="premium-sidebar-brand">
            <span className="premium-sidebar-monogram" aria-hidden="true">
              {initials || 'P'}
            </span>
            <div>
              <strong>{name || 'Portfolio'}</strong>
              <span>{personal?.designation || 'Signal Folio'}</span>
            </div>
          </div>
          <button className="premium-sidebar-close" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}>
            <span aria-hidden="true">×</span>
            <span>Close</span>
          </button>
          <motion.div className="premium-sidebar-group premium-sidebar-theme-group" variants={shouldReduceMotion ? undefined : premiumNavItemVariants}>
            <span className="premium-sidebar-label">Edition</span>
            <div className="premium-theme-switch">
              <button className={theme === 'dark' ? 'is-active' : ''} type="button" onClick={() => setTheme('dark')}>
                Ink
              </button>
              <button className={theme === 'light' ? 'is-active' : ''} type="button" onClick={() => setTheme('light')}>
                Mist
              </button>
            </div>
          </motion.div>
          <motion.div className="premium-sidebar-group" variants={shouldReduceMotion ? undefined : premiumNavItemVariants}>
            <span className="premium-sidebar-label">Index</span>
            <nav className="premium-sidebar-nav" aria-label="Portfolio sections">
              {sectionLinks.map((section) => (
                <motion.a
                  variants={shouldReduceMotion ? undefined : premiumNavItemVariants}
                  href={`#${section.id}`}
                  key={section.id}
                  onClick={() => {
                    if (window.matchMedia('(max-width: 800px)').matches) setSidebarOpen(false);
                  }}
                >
                  <span>{section.name}</span>
                </motion.a>
              ))}
            </nav>
          </motion.div>
          <motion.div className="premium-sidebar-footer" variants={shouldReduceMotion ? undefined : premiumNavItemVariants}>
            Signal Folio
          </motion.div>
        </motion.aside>
        <button className="premium-sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />
        <div className="premium-workspace">
          <motion.header
            className="premium-topbar"
            initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              className="premium-sidebar-toggle"
              type="button"
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((open) => !open)}
            >
              <span className={`premium-menu-icon${sidebarOpen ? ' is-open' : ''}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
            <a className="premium-logo" href="#home">
              {name}
            </a>
            <button
              className="premium-header-action"
              type="button"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch
            </button>
          </motion.header>
          <motion.main
            className="premium-main"
            variants={shouldReduceMotion ? undefined : premiumShellVariants}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
          >
            {children}
          </motion.main>
          <motion.footer
            className="premium-footer"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <div className="premium-footer-inner">
              <span>{name}</span>
              <span>{personal?.designation}</span>
            </div>
          </motion.footer>
        </div>
      </div>
    </MotionConfig>
  );
}

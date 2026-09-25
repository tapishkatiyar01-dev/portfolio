'use client';

import { useRef, useState } from 'react';
import { sendPortfolioEmail, useEmailJsKeepalive } from '@/lib/emailjs';
import {
  attachHoverLift,
  attachMagnetic,
  bindItemMotion,
  getGsap,
  lightTap,
  prefersReducedMotion,
  registerKineticGsap,
  useGSAP,
} from './gsapSetup';

registerKineticGsap();

export default function Contact({ email, github, linkedin, website, index = 0 }) {
  const rootRef = useRef(null);
  const submitRef = useRef(null);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  useEmailJsKeepalive();

  useGSAP(
    () => {
      const root = rootRef.current;
      const { gsap } = getGsap();
      const cleanups = [];

      if (submitRef.current) {
        cleanups.push(attachMagnetic(submitRef.current, 0.24));
        cleanups.push(attachHoverLift(submitRef.current, { y: -5, scale: 1.035 }));
      }
      cleanups.push(
        bindItemMotion(root?.querySelectorAll('.kinetic-socials a'), {
          y: -5,
          scale: 1.045,
          tap: true,
        }),
      );

      if (gsap && root && !prefersReducedMotion()) {
        const parts = root.querySelectorAll('[data-reveal]');
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: 'top 84%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });
        tl.from(parts, {
          y: 28,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        cleanups.push(() => {
          tl.scrollTrigger?.kill();
          tl.kill();
        });
      }

      return () => cleanups.forEach((fn) => fn?.());
    },
    { scope: rootRef },
  );

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    form.elements.namedItem('time').value = new Date().toLocaleString();
    setSending(true);
    lightTap();
    try {
      await sendPortfolioEmail(form);
      form.reset();
      setStatus('Message sent.');
    } catch (error) {
      setStatus(error.message || 'Could not send. Try again.');
    } finally {
      setSending(false);
    }
  }

  const socials = [
    ['Github', github],
    ['LinkedIn', linkedin],
    ['Web', website],
  ].filter(([, href]) => href);

  return (
    <div className="kinetic-panel kinetic-contact" ref={rootRef}>
      <p className="kinetic-eyebrow" data-reveal>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <i aria-hidden="true" />
        <span>Contact</span>
      </p>
      <div className="kinetic-contact-grid">
        <div data-reveal>
          <h2>Start a thread</h2>
          <p className="kinetic-copy">
            Briefs, bugs, and build ideas — drop a line and I will reply.
          </p>
          {socials.length > 0 && (
            <div className="kinetic-socials">
              {socials.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label}
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M3 9 9 3M4.5 3H9v4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          )}
        </div>
        <form onSubmit={submit} data-reveal>
          <input type="hidden" name="to_email" value={email || ''} readOnly />
          <input type="hidden" name="time" />
          <label>
            <span>Name</span>
            <input name="name" required placeholder="Your name" autoComplete="name" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" required placeholder="you@domain.com" autoComplete="email" />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" required placeholder="What are we building?" />
          </label>
          <button
            ref={submitRef}
            className="kinetic-btn kinetic-btn-primary"
            type="submit"
            disabled={sending}
            data-kinetic-magnet
          >
            {sending ? 'Sending…' : 'Send message'}
          </button>
          {status && (
            <p className="kinetic-status" role="status">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import { sendPortfolioEmail, useEmailJsKeepalive } from '@/lib/emailjs';
import {
  attachHoverLift,
  attachMagnetic,
  bindItemMotion,
  lightTap,
  registerStageGsap,
  useGSAP,
} from './gsapSetup';

registerStageGsap();

export default function Contact({ email, github, linkedin, website, index = 0 }) {
  const rootRef = useRef(null);
  const submitRef = useRef(null);
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  useEmailJsKeepalive();

  useGSAP(
    () => {
      const cleanups = [];
      if (submitRef.current) {
        cleanups.push(attachMagnetic(submitRef.current, 0.22));
        cleanups.push(attachHoverLift(submitRef.current, { y: -4, scale: 1.03 }));
      }
      cleanups.push(
        bindItemMotion(rootRef.current?.querySelectorAll('.kineticstage-socials a'), {
          y: -4,
          scale: 1.04,
          tap: true,
        }),
      );
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
    <div className="kineticstage-panel kineticstage-contact" ref={rootRef}>
      <p className="kineticstage-eyebrow" data-reveal>
        <span>{String(index + 1).padStart(2, '0')}</span>
        <i aria-hidden="true" />
        <span>Contact</span>
      </p>
      <div className="kineticstage-contact-grid">
        <div data-reveal>
          <h2>Let’s talk</h2>
          {email ? (
            <p className="kineticstage-copy">
              Reach out at{' '}
              <a href={`mailto:${email}`}>{email}</a>
              {github || linkedin || website ? ', or use the links below.' : '.'}
            </p>
          ) : (
            <p className="kineticstage-copy">Send a note with the form.</p>
          )}
          {socials.length > 0 && (
            <div className="kineticstage-socials">
              {socials.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label} ↗
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
            <textarea name="message" required placeholder="Tell me more…" />
          </label>
          <button
            ref={submitRef}
            className="kineticstage-btn kineticstage-btn-primary"
            type="submit"
            disabled={sending}
            data-ks-magnet
          >
            {sending ? 'Sending…' : 'Send message'}
          </button>
          {status && (
            <p className="kineticstage-status" role="status">
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

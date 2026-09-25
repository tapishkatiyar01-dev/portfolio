'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { sendPortfolioEmail, useEmailJsKeepalive } from '@/lib/emailjs';
import { sinematicPressMotion } from './motionConfig';

export default function Contact({ email, github, linkedin, website }) {
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const reduced = useReducedMotion();
  useEmailJsKeepalive();
  const press = sinematicPressMotion(reduced);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    form.elements.namedItem('time').value = new Date().toLocaleString();
    setSending(true);
    setStatus('');

    try {
      await sendPortfolioEmail(form);
      form.reset();
      setStatus('Message received.');
    } catch (error) {
      setStatus(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const socialLinks = [
    ['github', github],
    ['linkedin', linkedin],
    ['website', website],
  ].filter(([, href]) => href);

  return (
    <section id="contact-panel" className="sinematic-panel sinematic-contact">
      <div className="sinematic-panel-number">Contact</div>

      <div className="sinematic-contact-grid">
        <div>
          <p className="sinematic-kicker">End credits</p>
          <h2>
            Start a <em>conversation</em>
          </h2>
          {email && <p className="sinematic-copy">{email}</p>}

          {socialLinks.length > 0 && (
            <div className="sinematic-socials">
              {socialLinks.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label} ↗
                </a>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={submit}>
          <input type="hidden" name="to_email" value={email || ''} readOnly />
          <input type="hidden" name="time" />

          <label>
            <span>Name</span>
            <input name="name" required placeholder="Your name" />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" required placeholder="you@example.com" />
          </label>
          <label>
            <span>Subject</span>
            <input name="subject" required placeholder="Subject" />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" required placeholder="Your message" />
          </label>

          <motion.button
            className="sinematic-button sinematic-button-solid"
            type="submit"
            disabled={sending}
            {...press}
          >
            {sending ? 'Sending…' : 'Send message ↗'}
          </motion.button>

          {status && (
            <p className="sinematic-status" role="status">
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

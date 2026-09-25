'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendPortfolioEmail, useEmailJsKeepalive } from '@/lib/emailjs';
import { AestheticWindowVariants, useAestheticWindowMotion } from './motionConfig';

export default function Contact({ email }) {
  const { ref: windowRef, isInView } = useAestheticWindowMotion();
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  useEmailJsKeepalive();

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    form.elements.namedItem('time').value = new Date().toLocaleString();
    setStatus('');
    setIsSending(true);
    try {
      await sendPortfolioEmail(form);
      form.reset();
      setStatus('Thanks — your message has been sent.');
    } catch (error) {
      setStatus(error.message || 'We could not send your message. Please try again.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <motion.section id="contact" className="aesthetic-window aesthetic-contact" variants={AestheticWindowVariants} ref={windowRef} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      <div className="aesthetic-content aesthetic-contact-layout">
        <div className="aesthetic-contact-copy"><p className="aesthetic-about-kicker">Let&apos;s connect</p><h2>Have a project in mind?</h2><p>Tell me a little about what you&apos;re building and I&apos;ll get back to you soon.</p></div>
        <div className="aesthetic-contact-form">
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="to_email" value={email || ''} readOnly />
            <label className="aesthetic-form-row"><span>Name</span><input name="name" required placeholder="Your name" className="aesthetic-input" /></label>
            <label className="aesthetic-form-row"><span>Email</span><input name="email" type="email" required placeholder="you@example.com" className="aesthetic-input" /></label>
            <label className="aesthetic-form-row"><span>Subject</span><input name="subject" required placeholder="What can I help with?" className="aesthetic-input" /></label>
            <label className="aesthetic-form-row aesthetic-form-row-top"><span>Message</span><textarea name="message" required placeholder="Share a few details" className="aesthetic-input" /></label>
            <input type="hidden" name="time" />
            <div className="aesthetic-form-submit"><button type="submit" disabled={isSending} className="aesthetic-button aesthetic-button-primary">{isSending ? 'Sending…' : 'Send message'} <span aria-hidden="true">→</span></button></div>
            {status && <p role="status" className="aesthetic-form-status">{status}</p>}
          </form>
        </div>
      </div>
    </motion.section>
  );
}

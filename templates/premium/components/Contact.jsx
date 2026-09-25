'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { sendPortfolioEmail, useEmailJsKeepalive } from '@/lib/emailjs';
import { premiumItemVariants, usePremiumInView } from './motionConfig';

export default function Contact({ email }) {
  const [status, setStatus] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { ref, isInView } = usePremiumInView(0.12);
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
      setStatus('Message sent successfully.');
    } catch (error) {
      setStatus(error.message || 'Unable to send message.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <motion.section id="contact" ref={ref} className="premium-section premium-contact-card" variants={premiumItemVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      <div className="premium-section-heading">
        <div>
          <span className="premium-eyebrow">Correspondence</span>
          <h2>Contact</h2>
        </div>
        <p>{email}</p>
      </div>
      <form className="premium-contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" required placeholder="Your name" />
        </label>
        <label>
          Email
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
        <label>
          Message
          <textarea name="message" required placeholder="Tell me about your project" />
        </label>
        <input type="hidden" name="time" />
        <button className="premium-button premium-button-primary" type="submit" disabled={isSending}>
          {isSending ? 'Sending...' : 'Send message'}
        </button>
        <AnimatePresence mode="wait" initial={false}>
          {status ? (
            <motion.p
              key={status}
              className="premium-form-status"
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {status}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </form>
    </motion.section>
  );
}

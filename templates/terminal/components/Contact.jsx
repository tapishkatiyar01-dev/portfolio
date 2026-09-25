'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendPortfolioEmail, useEmailJsKeepalive } from '@/lib/emailjs';
import { terminalWindowVariants, useTerminalWindowMotion } from './motionConfig';

export default function Contact({ email }) {
  const { ref: windowRef, isInView } = useTerminalWindowMotion();
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
      setStatus('message sent successfully');
    } catch (error) {
      setStatus(error.message || 'unable to send message');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <motion.section className="terminal-window" variants={terminalWindowVariants} ref={windowRef} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      <div className="terminal-title-bar"><div className="terminal-dots"><span></span><span></span><span></span></div><div className="terminal-title">contact.sh</div><div className="terminal-actions">_ [] x</div></div>
      <div className="terminal-content">
        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="terminal-form-row"><span>$ to:</span><input name="to_email" type="email" value={email || ''} readOnly className="terminal-input" /></label>
            <label className="terminal-form-row"><span>$ name:</span><input name="name" required placeholder="Your name" className="terminal-input" /></label>
            <label className="terminal-form-row"><span>$ email:</span><input name="email" type="email" required placeholder="you@example.com" className="terminal-input" /></label>
            <label className="terminal-form-row"><span>$ subject:</span><input name="subject" required placeholder="Enter subject" className="terminal-input" /></label>
            <label className="terminal-form-row terminal-form-row-top"><span>$ body:</span><textarea name="message" required placeholder="Enter your message" className="terminal-input min-h-28 resize-y" /></label>
            <input type="hidden" name="time" />
            <div className="flex justify-end"><button type="submit" disabled={isSending} className="terminal-button terminal-button-primary">[ {isSending ? 'sending...' : 'send'} ]</button></div>
            {status && <p role="status" className="text-sm text-green-400">{status}</p>}
          </form>
        </div>
      </div>
    </motion.section>
  );
}

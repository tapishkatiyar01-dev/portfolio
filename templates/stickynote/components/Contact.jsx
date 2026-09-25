'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { sendPortfolioEmail, useEmailJsKeepalive } from '@/lib/emailjs';

export default function Contact({ email, socials = {} }) {
  const formRef = useRef(null); const [status, setStatus] = useState('');
  useEmailJsKeepalive();
  async function submit(event) { event.preventDefault(); setStatus('Sending…'); try { await sendPortfolioEmail(formRef.current); setStatus('Message sent.'); formRef.current.reset(); } catch (error) { setStatus(error.message || 'Unable to send message.'); } }
  return <motion.section id="contact" className="stickynote-note stickynote-note-pink stickynote-contact" whileHover={{ y: -5, rotate: .8 }} transition={{ duration: .2 }}><h2>Contact me</h2><p>Let&apos;s build something amazing together!</p>{email && <a className="stickynote-contact-email" href={`mailto:${email}`}>{email}</a>}<form ref={formRef} onSubmit={submit}><label>Your name<input name="name" required /></label><label>Your email<input name="email" type="email" required /></label><label>Message<textarea name="message" rows="4" required /></label><button className="stickynote-button button-purple" type="submit">Send message ↗</button><p className="stickynote-form-status" role="status">{status}</p></form><div className="stickynote-socials">{Object.entries(socials).filter(([, href]) => href).map(([label, href]) => <motion.a whileHover={{ y: -2 }} href={href} target="_blank" rel="noreferrer" key={label}>{label}</motion.a>)}</div></motion.section>;
}

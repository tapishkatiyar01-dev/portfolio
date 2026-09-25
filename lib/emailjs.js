'use client';

import emailjs from '@emailjs/browser';
import { useEffect } from 'react';

const KEEPALIVE_STORAGE_KEY = 'portfolio-emailjs-keepalive';
const KEEPALIVE_INTERVAL_MS = 14 * 24 * 60 * 60 * 1000;

let keepaliveInFlight = false;

function getEmailJsConfig() {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS environment variables are not configured.');
  }

  return { serviceId, templateId, publicKey };
}

function markEmailJsActivity(timestamp = Date.now()) {
  try {
    window.localStorage.setItem(KEEPALIVE_STORAGE_KEY, String(timestamp));
  } catch {
    /* ignore private-mode storage failures */
  }
}

function isKeepaliveDue() {
  try {
    const last = Number(window.localStorage.getItem(KEEPALIVE_STORAGE_KEY));
    if (Number.isFinite(last) && Date.now() - last < KEEPALIVE_INTERVAL_MS) {
      return false;
    }
  } catch {
    /* treat missing storage as due */
  }
  return true;
}

export async function sendPortfolioEmail(form) {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();
  const result = await emailjs.sendForm(serviceId, templateId, form, { publicKey });
  markEmailJsActivity();
  fetch('/api/emailjs/keepalive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'touch' }),
  }).catch(() => {});
  return result;
}

export async function sendKeepaliveEmail() {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();
  const sentAt = new Date().toLocaleString();

  return emailjs.send(
    serviceId,
    templateId,
    {
      name: 'Portfolio keepalive',
      email: 'keepalive@example.com',
      to_email: 'keepalive@example.com',
      subject: 'EmailJS keepalive',
      message:
        'Automated demo email to keep the EmailJS service active. Ignore this message.',
      time: sentAt,
    },
    { publicKey },
  );
}

async function pingKeepalive() {
  if (typeof window === 'undefined' || keepaliveInFlight || !isKeepaliveDue()) return;
  keepaliveInFlight = true;

  try {
    let shouldSend = true;
    try {
      const response = await fetch('/api/emailjs/keepalive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'claim' }),
      });
      if (response.ok) {
        const payload = await response.json();
        shouldSend = Boolean(payload?.send);
      }
    } catch {
      shouldSend = isKeepaliveDue();
    }

    if (!shouldSend) {
      markEmailJsActivity();
      return;
    }

    await sendKeepaliveEmail();
    markEmailJsActivity();
    fetch('/api/emailjs/keepalive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'touch' }),
    }).catch(() => {});
  } finally {
    keepaliveInFlight = false;
  }
}

export function useEmailJsKeepalive() {
  useEffect(() => {
    let cancelled = false;

    pingKeepalive().catch(() => {
      if (!cancelled) {
        /* keepalive must never block the contact form */
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);
}

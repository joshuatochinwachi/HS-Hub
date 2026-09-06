'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_LEAD_CAPTURE_URL || '';
const SECRET = process.env.NEXT_PUBLIC_LEAD_CAPTURE_SECRET || '';
const STORAGE_KEY = 'hs_lead_modal_dismissed';
const RESHOW_DAYS = 14;

export default function LeadCaptureModal() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    // Respect exclusion on privacy policy or compliance pages
    if (pathname === '/privacy-policy' || pathname === '/privacy') {
      return;
    }

    try {
      const dismissedAt = localStorage.getItem(STORAGE_KEY);
      if (dismissedAt && Date.now() - Number(dismissedAt) < RESHOW_DAYS * 86400000) {
        return;
      }
    } catch {
      // localStorage may be unavailable in private/sandboxed modes
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore storage errors
    }
    setVisible(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        secret: SECRET,
        sourcePage: typeof window !== 'undefined' ? window.location.pathname : pathname,
      };

      // Using mode: 'no-cors' with text/plain to avoid preflight OPTIONS issues with Google Apps Script
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      setStatus('sent');
      try {
        localStorage.setItem(STORAGE_KEY, String(Date.now()));
      } catch {
        // ignore storage errors
      }
      setTimeout(() => {
        setVisible(false);
      }, 1800);
    } catch {
      setStatus('error');
    }
  };

  // Do not render if not visible or if visiting excluded routes
  if (!visible || pathname === '/privacy-policy' || pathname === '/privacy') {
    return null;
  }

  return (
    <aside
      aria-label="Early access updates"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] sm:w-96 animate-in fade-in slide-in-from-bottom-5 duration-500"
    >
      <div className="relative rounded-2xl border border-white/10 bg-[#0c0c0c]/95 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl ring-1 ring-white/5">
        {/* Subtle HollowScan ambient glow at top */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-[oklch(0.62_0.24_35)] to-transparent opacity-80" />

        {/* Dismiss / Close Button */}
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 inline-flex h-7 w-7 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[oklch(0.62_0.24_35)]/20 text-[oklch(0.62_0.24_35)] border border-[oklch(0.62_0.24_35)]/40">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h4 className="font-semibold text-base text-white">You're on the list</h4>
            <p className="mt-1 text-xs text-white/60">Thanks for joining. We'll be in touch with early updates.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3.5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[oklch(0.62_0.24_35)]/15 px-2.5 py-0.5 text-[11px] font-medium text-[oklch(0.62_0.24_35)] border border-[oklch(0.62_0.24_35)]/30 mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.62_0.24_35)] animate-pulse" />
                HollowScan Early Access
              </div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Get early access updates
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                Join our exclusive radar list for real-time arbitrage alerts and app releases.
              </p>
            </div>

            <div className="space-y-2">
              <div>
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition focus:border-[oklch(0.62_0.24_35)] focus:ring-1 focus:ring-[oklch(0.62_0.24_35)]"
                />
              </div>

              <div>
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition focus:border-[oklch(0.62_0.24_35)] focus:ring-1 focus:ring-[oklch(0.62_0.24_35)]"
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition focus:border-[oklch(0.62_0.24_35)] focus:ring-1 focus:ring-[oklch(0.62_0.24_35)]"
                />
              </div>
            </div>

            {/* GDPR Consent - Mandatory unchecked */}
            <label className="flex items-start gap-2.5 pt-0.5 text-[11px] text-white/65 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                defaultChecked={false}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-white/20 bg-white/5 accent-[oklch(0.62_0.24_35)] cursor-pointer"
              />
              <span className="leading-snug">
                I agree to be contacted per the{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/90 underline decoration-white/30 underline-offset-2 hover:text-[oklch(0.62_0.24_35)] hover:decoration-[oklch(0.62_0.24_35)] transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {status === 'error' && (
              <p className="text-xs text-red-400">
                Something went wrong. Please check your connection and try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full inline-flex items-center justify-center rounded-lg bg-[oklch(0.62_0.24_35)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition"
            >
              {status === 'sending' ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                'Get Early Access'
              )}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}

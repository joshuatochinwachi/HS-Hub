'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_LEAD_CAPTURE_URL || '';
const SECRET = process.env.NEXT_PUBLIC_LEAD_CAPTURE_SECRET || '';
const DISMISSED_KEY = 'hs_lead_modal_dismissed';
const SUBMITTED_KEY = 'hs_lead_submitted';
const RESHOW_DAYS = 14;

export default function LeadCaptureModal() {
  const pathname = usePathname();
  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [isNudged, setIsNudged] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // Helper to check if already submitted
  const hasSubmitted = () => {
    try {
      return localStorage.getItem(SUBMITTED_KEY) === 'true';
    } catch {
      return false;
    }
  };

  // Helper to check if recently dismissed
  const isDismissed = () => {
    try {
      const dismissedAt = localStorage.getItem(DISMISSED_KEY);
      return Boolean(dismissedAt && Date.now() - Number(dismissedAt) < RESHOW_DAYS * 86400000);
    } catch {
      return false;
    }
  };

  // Timer-based automatic display (15s default)
  useEffect(() => {
    if (pathname === '/privacy-policy' || pathname === '/privacy') {
      return;
    }

    if (hasSubmitted() || isDismissed()) {
      return;
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Professional click interceptor: lets visitors scroll, but nudges them to register on button clicks
  useEffect(() => {
    if (pathname === '/privacy-policy' || pathname === '/privacy') {
      return;
    }

    const handleGlobalClick = (e: MouseEvent) => {
      // If already submitted, allow all actions seamlessly
      if (hasSubmitted()) {
        return;
      }

      // Check if the clicked element is an interactive button or action link
      const target = (e.target as HTMLElement).closest(
        'button, a, [role="button"], input[type="submit"]'
      ) as HTMLElement | null;

      if (!target) return;

      // Allow interactions within the modal itself (inputs, checkboxes, close, submit)
      if (modalRef.current && modalRef.current.contains(target)) {
        return;
      }

      const href = target.getAttribute('href');

      // Allow privacy policy and legal routes
      if (href === '/privacy-policy' || href === '/privacy') {
        return;
      }

      // Allow in-page scroll anchor links (e.g. #yieldsage-section) so visitors can freely navigate and scroll
      if (href && href.startsWith('#')) {
        return;
      }

      // Intercept action button / external link click
      e.preventDefault();
      e.stopPropagation();

      if (href) {
        setPendingUrl(href);
      }

      // Open the modal if closed
      setVisible(true);

      // Trigger refined highlight/nudge state
      setIsNudged(true);
      setTimeout(() => {
        setIsNudged(false);
      }, 2500);

      // Focus the name input
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 150);
    };

    // Use capture phase to intercept before component handlers fire
    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [pathname]);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      // Ignore storage errors
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
        localStorage.setItem(SUBMITTED_KEY, 'true');
        localStorage.setItem(DISMISSED_KEY, String(Date.now()));
      } catch {
        // Ignore storage errors
      }

      setTimeout(() => {
        setVisible(false);
        // If the user had clicked an external action link, execute it now that they are registered
        if (pendingUrl) {
          if (pendingUrl.startsWith('http')) {
            window.open(pendingUrl, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = pendingUrl;
          }
        }
      }, 2000);
    } catch {
      setStatus('error');
    }
  };

  if (!visible || pathname === '/privacy-policy' || pathname === '/privacy') {
    return null;
  }

  return (
    <aside
      ref={modalRef}
      aria-label="HollowScan Early Access"
      className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-[370px] transition-all duration-500 ease-out"
    >
      <div
        className={`relative overflow-hidden rounded-xl border bg-[#080808]/95 p-6 backdrop-blur-2xl transition-all duration-500 ${
          isNudged
            ? 'border-[var(--hollowscan)] shadow-[0_0_50px_rgba(255,79,24,0.35),0_24px_64px_rgba(0,0,0,0.9)] scale-[1.02]'
            : 'border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.85),0_0_1px_1px_rgba(255,255,255,0.05)]'
        }`}
      >
        {/* Subtle architectural hairline border on top */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--hollowscan)]/40 to-transparent pointer-events-none" />

        {/* Minimal Hairline Dismiss Button */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss modal"
          className="absolute top-4 right-4 p-1 text-white/30 hover:text-white/90 transition-colors"
        >
          <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
          </svg>
        </button>

        {status === 'sent' ? (
          <div className="py-6 text-center">
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[var(--hollowscan)]">
              Confirmed
            </span>
            <h4 className="mt-2 text-2xl font-serif font-light text-white tracking-tight">
              You are on the radar.
            </h4>
            <p className="mt-2 text-xs text-white/50 font-sans font-light leading-relaxed">
              Access unlocked. You will receive notifications as new arbitrage drops and coverage areas go live.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col gap-4">
            {/* Header Section */}
            <div>
              {isNudged ? (
                <div className="flex items-center gap-2 mb-2 rounded-md bg-[var(--hollowscan)]/15 border border-[var(--hollowscan)]/30 px-2.5 py-1 text-[10px] font-mono text-[var(--hollowscan)] animate-in fade-in slide-in-from-top-1 duration-200">
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Early Access Required · Register to unlock</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-[var(--hollowscan)]">
                    HollowScan · Access
                  </span>
                  <span className="text-white/20 text-xs">|</span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Radar Feed
                  </span>
                </div>
              )}

              <h3 className="mt-1.5 text-2xl font-serif font-light text-white tracking-tight leading-tight">
                Find deals before everyone else.
              </h3>
              <p className="mt-1 text-xs text-white/50 font-sans font-light leading-relaxed">
                Direct alerts on mispriced retail inventory, store drops, and release announcements.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="space-y-2.5 pt-1">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                  Name <span className="text-[var(--hollowscan)]">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  required
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder-white/25 outline-none transition-colors duration-200 focus:border-[var(--hollowscan)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                  Email <span className="text-[var(--hollowscan)]">*</span>
                </label>
                <input
                  required
                  type="email"
                  placeholder="name@domain.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder-white/25 outline-none transition-colors duration-200 focus:border-[var(--hollowscan)]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1">
                  Phone <span className="text-white/25">(optional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-xs text-white placeholder-white/25 outline-none transition-colors duration-200 focus:border-[var(--hollowscan)]"
                />
              </div>
            </div>

            {/* GDPR Consent Checkbox (Strictly required & unchecked by default) */}
            <label className="flex items-start gap-2.5 pt-1 text-[11px] text-white/50 cursor-pointer select-none font-sans font-light leading-snug">
              <input
                type="checkbox"
                required
                defaultChecked={false}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border border-white/20 bg-black accent-[var(--hollowscan)] cursor-pointer"
              />
              <span>
                I agree to be contacted with updates in accordance with the{' '}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 underline decoration-white/25 underline-offset-2 hover:text-[var(--hollowscan)] hover:decoration-[var(--hollowscan)] transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            {status === 'error' && (
              <p className="text-[11px] font-mono text-red-400">
                Transmission error. Please try again.
              </p>
            )}

            {/* Bespoke Pill CTA Matching Site Button System */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-1 w-full rounded-full bg-[var(--hollowscan)] py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-[var(--hollowscan)]/85 hover:shadow-[0_0_24px_rgba(255,79,24,0.35)] active:scale-[0.99] disabled:opacity-50"
            >
              {status === 'sending' ? 'Submitting...' : 'Request Access'}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
}

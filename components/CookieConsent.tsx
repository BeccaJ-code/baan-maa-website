'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

// =============================================================================
// Cookie Consent Component
// =============================================================================

const CONSENT_KEY = 'baan-maa-cookie-consent';

export type ConsentStatus = 'accepted' | 'declined' | 'pending';

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [isVisible, setIsVisible] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      setStatus(stored);
    } else {
      // Small delay before showing banner
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setStatus('accepted');
    setIsVisible(false);
    // Dispatch event for analytics component to pick up
    window.dispatchEvent(new CustomEvent('cookie-consent', { detail: 'accepted' }));
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setStatus('declined');
    setIsVisible(false);
  };

  if (!isVisible || status !== 'pending') {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-sand-200 shadow-lg animate-fade-up"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 text-sm text-sand-700">
          <p>
            We use cookies to improve your experience and analyze website traffic.
            By clicking &quot;Accept&quot;, you consent to our use of cookies.{' '}
            <a href="/privacy" className="text-teal-600 hover:underline">
              Learn more
            </a>
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="ghost" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Hook to check consent status
// =============================================================================

export function useConsentStatus(): ConsentStatus {
  const [status, setStatus] = useState<ConsentStatus>('pending');

  useEffect(() => {
    const checkConsent = () => {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted') {
        setStatus('accepted');
      } else if (stored === 'declined') {
        setStatus('declined');
      }
    };

    // Check on mount
    checkConsent();

    // Listen for consent changes
    const handleConsent = (e: CustomEvent) => {
      setStatus(e.detail);
    };

    window.addEventListener('cookie-consent', handleConsent as EventListener);
    return () => {
      window.removeEventListener('cookie-consent', handleConsent as EventListener);
    };
  }, []);

  return status;
}

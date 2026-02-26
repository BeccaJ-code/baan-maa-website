'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

interface NewsletterSignupProps {
  variant?: 'default' | 'compact' | 'banner';
  source?: string;
  className?: string;
}

export default function NewsletterSignup({
  variant = 'default',
  source = 'website',
  className = '',
}: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setMessage('Thanks for subscribing! Check your inbox for confirmation.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (variant === 'compact') {
    return (
      <div className={className}>
        {status === 'success' ? (
          <p className="text-green-600 text-sm">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-sand-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
            <Button type="submit" size="sm" disabled={status === 'loading'}>
              {status === 'loading' ? '...' : 'Subscribe'}
            </Button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-red-600 text-sm mt-1">{message}</p>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-teal-600 text-white py-4 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Get rescue updates in your inbox</p>
              <p className="text-teal-100 text-sm">Join our community of dog lovers</p>
            </div>
            {status === 'success' ? (
              <p className="text-teal-100">{message}</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 sm:w-64 px-4 py-2 rounded-lg text-sand-900 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
          {status === 'error' && (
            <p className="text-red-200 text-sm mt-2 text-center sm:text-right">{message}</p>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-blue-900 rounded-xl p-6 md:p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="font-display text-2xl font-bold text-white mb-2">
          Stay Updated
        </h3>
        <p className="text-blue-200">
          Get monthly rescue updates, success stories, and ways to help directly in your inbox.
        </p>
      </div>

      {status === 'success' ? (
        <div className="text-center">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckIcon className="w-6 h-6 text-white" />
          </div>
          <p className="text-white font-medium">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <Button
            type="submit"
            fullWidth
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe to Updates'}
          </Button>
          <p className="text-blue-300 text-xs text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-300 text-sm mt-4 text-center">{message}</p>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

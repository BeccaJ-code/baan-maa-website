'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Appeal {
  id: string;
  slug: string;
  title: string;
  dogName: string | null;
  summary: string;
  goalAmount: number;
  raisedAmount: number;
  featuredImage: string | null;
  deadline: string | null;
}

interface UrgentAppealBannerProps {
  className?: string;
}

export function UrgentAppealBanner({ className = '' }: UrgentAppealBannerProps) {
  const [appeal, setAppeal] = useState<Appeal | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session
    const isDismissed = sessionStorage.getItem('urgentAppealDismissed');
    if (isDismissed) {
      setDismissed(true);
      return;
    }

    // Fetch urgent appeal
    fetch('/api/appeals?urgent=true&limit=1')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setAppeal(data.data[0]);
        }
      })
      .catch(console.error);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('urgentAppealDismissed', 'true');
  };

  if (dismissed || !appeal) return null;

  const progress = Math.min(100, Math.round((appeal.raisedAmount / appeal.goalAmount) * 100));

  return (
    <div className={`bg-red-600 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="shrink-0 flex items-center gap-2">
              <HeartPulseIcon className="w-5 h-5 animate-pulse" />
              <span className="font-semibold text-sm uppercase tracking-wide">Urgent</span>
            </span>
            <p className="text-sm truncate">
              {appeal.summary}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-sm">
              <span className="font-semibold">£{appeal.raisedAmount.toLocaleString()}</span>
              <span className="text-red-200"> / £{appeal.goalAmount.toLocaleString()}</span>
            </div>
            <Link
              href={`/appeals/${appeal.slug}`}
              className="px-4 py-1.5 bg-white text-red-600 font-semibold text-sm rounded-full hover:bg-red-50 transition-colors"
            >
              Help Now
            </Link>
            <button
              onClick={handleDismiss}
              className="text-red-200 hover:text-white p-1"
              aria-label="Dismiss"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UrgentAppealCardProps {
  appeal: Appeal;
  variant?: 'default' | 'compact';
}

export function UrgentAppealCard({ appeal, variant = 'default' }: UrgentAppealCardProps) {
  const progress = Math.min(100, Math.round((appeal.raisedAmount / appeal.goalAmount) * 100));
  const remaining = appeal.goalAmount - appeal.raisedAmount;

  if (variant === 'compact') {
    return (
      <Link
        href={`/appeals/${appeal.slug}`}
        className="block bg-white rounded-lg border-2 border-red-200 p-4 hover:border-red-400 transition-colors"
      >
        <div className="flex items-center gap-2 mb-2">
          <HeartPulseIcon className="w-4 h-4 text-red-500" />
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Urgent Appeal</span>
        </div>
        <h3 className="font-semibold text-blue-900 mb-2 line-clamp-2">{appeal.title}</h3>
        <div className="w-full h-2 bg-sand-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-red-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-sand-600">{progress}% funded</span>
          <span className="font-semibold text-red-600">£{remaining.toLocaleString()} needed</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-red-200">
      {appeal.featuredImage && (
        <div className="relative aspect-video">
          <Image
            src={appeal.featuredImage}
            alt={appeal.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
            <HeartPulseIcon className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-semibold">Urgent Appeal</span>
          </div>
        </div>
      )}
      <div className="p-6">
        <h3 className="font-display text-xl font-bold text-blue-900 mb-2">
          {appeal.title}
        </h3>
        <p className="text-sand-700 mb-4">{appeal.summary}</p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-blue-900">
              £{appeal.raisedAmount.toLocaleString()} raised
            </span>
            <span className="text-sand-600">
              of £{appeal.goalAmount.toLocaleString()} goal
            </span>
          </div>
          <div className="w-full h-3 bg-sand-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-red-600 font-medium mt-2">
            £{remaining.toLocaleString()} still needed
          </p>
        </div>

        {appeal.deadline && (
          <p className="text-sm text-sand-600 mb-4">
            <ClockIcon className="w-4 h-4 inline mr-1" />
            Deadline: {new Date(appeal.deadline).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long'
            })}
          </p>
        )}

        <Link
          href={`/appeals/${appeal.slug}`}
          className="block w-full text-center bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
        >
          Donate to Help
        </Link>
      </div>
    </div>
  );
}

// Export a section component for homepage
export function UrgentAppealsSection() {
  const [appeals, setAppeals] = useState<Appeal[]>([]);

  useEffect(() => {
    fetch('/api/appeals?active=true&limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAppeals(data.data);
        }
      })
      .catch(console.error);
  }, []);

  if (appeals.length === 0) return null;

  return (
    <section className="bg-red-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <HeartPulseIcon className="w-4 h-4" />
            Urgent Appeals
          </span>
          <h2 className="font-display text-3xl font-bold text-blue-900 mb-2">
            Dogs Who Need Your Help Now
          </h2>
          <p className="text-sand-700">
            These dogs are in critical need of medical care or support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appeals.map(appeal => (
            <UrgentAppealCard key={appeal.id} appeal={appeal} />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/appeals"
            className="text-red-600 font-semibold hover:text-red-700 transition-colors"
          >
            View All Appeals →
          </Link>
        </div>
      </div>
    </section>
  );
}

// Icons
function HeartPulseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      <path d="M7 10h2v4H7zM11 8h2v8h-2zM15 11h2v3h-2z" fill="white" opacity="0.7"/>
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

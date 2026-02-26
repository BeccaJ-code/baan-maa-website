'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import CurrencySwitcher from '@/components/CurrencySwitcher';
import { formatAmountShort, getCurrencyConfig, validateAmount } from '@/lib/currency';
import type { Currency, DonationConfig } from '@/types';

// =============================================================================
// Donation Form Component
// =============================================================================

const DEFAULT_AMOUNTS = {
  gbp: [
    { amount: 25, label: 'Feeds 5 dogs' },
    { amount: 50, label: 'Medical care' },
    { amount: 100, label: 'Emergency surgery' },
    { amount: 250, label: 'Full rehabilitation' },
    { amount: 500, label: 'Save multiple dogs' },
    { amount: 1000, label: 'Sponsor our shelter' },
  ],
  usd: [
    { amount: 30, label: 'Feeds 5 dogs' },
    { amount: 60, label: 'Medical care' },
    { amount: 120, label: 'Emergency surgery' },
    { amount: 300, label: 'Full rehabilitation' },
    { amount: 600, label: 'Save multiple dogs' },
    { amount: 1200, label: 'Sponsor our shelter' },
  ],
  eur: [
    { amount: 30, label: 'Feeds 5 dogs' },
    { amount: 60, label: 'Medical care' },
    { amount: 115, label: 'Emergency surgery' },
    { amount: 290, label: 'Full rehabilitation' },
    { amount: 580, label: 'Save multiple dogs' },
    { amount: 1150, label: 'Sponsor our shelter' },
  ],
  thb: [
    { amount: 1000, label: 'Feeds 5 dogs' },
    { amount: 2000, label: 'Medical care' },
    { amount: 4000, label: 'Emergency surgery' },
    { amount: 10000, label: 'Full rehabilitation' },
    { amount: 20000, label: 'Save multiple dogs' },
    { amount: 40000, label: 'Sponsor our shelter' },
  ],
};

export interface DonationFormProps {
  config?: Partial<DonationConfig>;
  projectId?: string;
  projectName?: string;
  initialCurrency?: Currency;
  className?: string;
  variant?: 'default' | 'compact' | 'embedded';
}

export default function DonationForm({
  config,
  projectId,
  projectName,
  initialCurrency = 'gbp',
  className,
  variant = 'default',
}: DonationFormProps) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [donationType, setDonationType] = useState<'once' | 'monthly'>(
    config?.defaultType || 'once'
  );
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amounts = config?.presetAmounts || DEFAULT_AMOUNTS[currency];
  const currencyConfig = getCurrencyConfig(currency);
  const allowCustom = config?.allowCustomAmount !== false;
  const oneTimeAvailable = config?.oneTimeAvailable !== false;
  const monthlyAvailable = config?.monthlyAvailable !== false;

  // Get the current amount (either selected or custom)
  const currentAmount = customAmount
    ? parseFloat(customAmount)
    : selectedAmount || 0;

  const isValidAmount = validateAmount(currentAmount, currency);

  // Handle preset amount selection
  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError(null);
  };

  // Handle custom amount input
  const handleCustomChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitized = value.replace(/[^\d.]/g, '');
    setCustomAmount(sanitized);
    setSelectedAmount(null);
    setError(null);
  };

  // Handle donation submission
  const handleSubmit = async () => {
    if (!isValidAmount) {
      setError(`Minimum donation is ${formatAmountShort(currencyConfig.minAmount, currency)}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentAmount,
          currency,
          donationType,
          projectId,
          projectName,
          successUrl: `${window.location.origin}/donate/success`,
          cancelUrl: `${window.location.origin}/donate/cancelled`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      'bg-white rounded-2xl shadow-xl',
      variant === 'embedded' ? 'p-0' : 'p-6 md:p-8',
      className
    )}>
      {/* Header */}
      {variant !== 'embedded' && (
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-blue-800 mb-2">
            {config?.title || 'Save a Life Today'}
          </h2>
          {config?.description && (
            <p className="text-sand-600">{config.description}</p>
          )}
        </div>
      )}

      {/* Currency Switcher */}
      <div className="mb-6">
        <CurrencySwitcher value={currency} onChange={setCurrency} />
      </div>

      {/* Donation Type Toggle */}
      {(oneTimeAvailable && monthlyAvailable) && (
        <div className="flex gap-2 p-1 bg-sand-100 rounded-lg mb-6">
          {oneTimeAvailable && (
            <button
              onClick={() => setDonationType('once')}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all',
                donationType === 'once'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-sand-600 hover:text-sand-800'
              )}
            >
              One-time
            </button>
          )}
          {monthlyAvailable && (
            <button
              onClick={() => setDonationType('monthly')}
              className={cn(
                'flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all',
                donationType === 'monthly'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-sand-600 hover:text-sand-800'
              )}
            >
              Monthly
            </button>
          )}
        </div>
      )}

      {/* Amount Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {amounts.map(({ amount, label }) => (
          <button
            key={amount}
            onClick={() => handlePresetClick(amount)}
            className={cn(
              'p-3 rounded-lg border-2 text-left transition-all',
              selectedAmount === amount
                ? 'border-teal-600 bg-teal-50'
                : 'border-sand-200 hover:border-blue-300'
            )}
          >
            <div className="font-bold text-lg">
              {formatAmountShort(amount, currency)}
            </div>
            {label && (
              <div className="text-xs text-sand-600 mt-0.5">{label}</div>
            )}
          </button>
        ))}
      </div>

      {/* Custom Amount */}
      {allowCustom && (
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-500">
              {currencyConfig.symbol}
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => handleCustomChange(e.target.value)}
              className={cn(
                'w-full pl-8 pr-4 py-3 border rounded-lg text-sand-900',
                'placeholder:text-sand-400 focus:outline-none focus:ring-2',
                customAmount
                  ? 'border-teal-500 focus:ring-teal-500/20'
                  : 'border-sand-200 focus:border-teal-500 focus:ring-teal-500/20'
              )}
            />
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isValidAmount || isLoading}
        loading={isLoading}
        fullWidth
        size="lg"
      >
        {isValidAmount
          ? `Donate ${formatAmountShort(currentAmount, currency)}${donationType === 'monthly' ? '/month' : ''}`
          : 'Select an amount'
        }
      </Button>

      {/* Security Note */}
      <p className="mt-4 text-center text-sm text-sand-500 flex items-center justify-center gap-1">
        <LockIcon />
        Secure payment via Stripe
      </p>
    </div>
  );
}

// =============================================================================
// Lock Icon
// =============================================================================

function LockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

'use client';

import { cn } from '@/lib/utils';
import { CURRENCIES, type Currency } from '@/types';

// =============================================================================
// Currency Switcher Component
// =============================================================================

export interface CurrencySwitcherProps {
  value: Currency;
  onChange: (currency: Currency) => void;
  className?: string;
}

const CURRENCY_ORDER: Currency[] = ['gbp', 'usd', 'eur', 'thb'];

export default function CurrencySwitcher({
  value,
  onChange,
  className,
}: CurrencySwitcherProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-sand-100 rounded-lg', className)}>
      {CURRENCY_ORDER.map((currency) => {
        const config = CURRENCIES[currency];
        const isActive = value === currency;

        return (
          <button
            key={currency}
            onClick={() => onChange(currency)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
              isActive
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-sand-600 hover:text-sand-800'
            )}
            aria-pressed={isActive}
          >
            <span>{config.symbol}</span>
            <span className="uppercase">{currency}</span>
          </button>
        );
      })}
    </div>
  );
}

// =============================================================================
// Compact Currency Switcher (for header/footer)
// =============================================================================

export function CurrencySwitcherCompact({
  value,
  onChange,
  className,
}: CurrencySwitcherProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Currency)}
      className={cn(
        'px-2 py-1 bg-transparent border border-sand-300 rounded text-sm',
        'focus:outline-none focus:border-teal-500',
        className
      )}
    >
      {CURRENCY_ORDER.map((currency) => {
        const config = CURRENCIES[currency];
        return (
          <option key={currency} value={currency}>
            {config.symbol} {currency.toUpperCase()}
          </option>
        );
      })}
    </select>
  );
}

import type { Currency, CurrencyConfig } from '@/types';
import { CURRENCIES } from '@/types';

// =============================================================================
// Currency Detection
// =============================================================================

// Map of country codes to currencies
const COUNTRY_CURRENCY_MAP: Record<string, Currency> = {
  // GBP countries
  GB: 'gbp',
  UK: 'gbp',
  // EUR countries
  AT: 'eur', BE: 'eur', CY: 'eur', EE: 'eur', FI: 'eur',
  FR: 'eur', DE: 'eur', GR: 'eur', IE: 'eur', IT: 'eur',
  LV: 'eur', LT: 'eur', LU: 'eur', MT: 'eur', NL: 'eur',
  PT: 'eur', SK: 'eur', SI: 'eur', ES: 'eur',
  // THB
  TH: 'thb',
  // USD for US and default
  US: 'usd',
};

// Map of timezones to currencies (fallback)
const TIMEZONE_CURRENCY_MAP: Record<string, Currency> = {
  'Europe/London': 'gbp',
  'Europe/Paris': 'eur',
  'Europe/Berlin': 'eur',
  'Europe/Amsterdam': 'eur',
  'Europe/Rome': 'eur',
  'Europe/Madrid': 'eur',
  'Asia/Bangkok': 'thb',
  'America/New_York': 'usd',
  'America/Los_Angeles': 'usd',
  'America/Chicago': 'usd',
};

/**
 * Detect currency from Accept-Language header
 */
export function detectCurrencyFromLanguage(acceptLanguage: string | null): Currency | null {
  if (!acceptLanguage) return null;

  // Parse Accept-Language header (e.g., "en-GB,en;q=0.9,th;q=0.8")
  const languages = acceptLanguage.split(',').map(lang => {
    const [code, q] = lang.trim().split(';q=');
    return {
      code: code.trim(),
      quality: q ? parseFloat(q) : 1,
    };
  });

  // Sort by quality
  languages.sort((a, b) => b.quality - a.quality);

  // Check for country codes in language tags
  for (const { code } of languages) {
    const parts = code.split('-');
    if (parts.length > 1) {
      const country = parts[1].toUpperCase();
      if (country in COUNTRY_CURRENCY_MAP) {
        return COUNTRY_CURRENCY_MAP[country];
      }
    }
  }

  return null;
}

/**
 * Detect currency from timezone
 */
export function detectCurrencyFromTimezone(timezone: string | null): Currency | null {
  if (!timezone) return null;
  return TIMEZONE_CURRENCY_MAP[timezone] || null;
}

/**
 * Get the best currency based on available signals
 */
export function detectCurrency(
  acceptLanguage: string | null,
  timezone: string | null
): Currency {
  // Try language first
  const fromLanguage = detectCurrencyFromLanguage(acceptLanguage);
  if (fromLanguage) return fromLanguage;

  // Try timezone
  const fromTimezone = detectCurrencyFromTimezone(timezone);
  if (fromTimezone) return fromTimezone;

  // Default to GBP (Baan Maa's primary currency)
  return 'gbp';
}

// =============================================================================
// Currency Formatting
// =============================================================================

export function getCurrencyConfig(currency: Currency): CurrencyConfig {
  return CURRENCIES[currency];
}

export function formatAmount(amount: number, currency: Currency): string {
  const config = getCurrencyConfig(currency);
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: config.decimalDigits,
    maximumFractionDigits: config.decimalDigits,
  });
  return formatter.format(amount);
}

export function formatAmountShort(amount: number, currency: Currency): string {
  const config = getCurrencyConfig(currency);
  if (config.decimalDigits === 0) {
    return `${config.symbol}${Math.round(amount)}`;
  }
  return `${config.symbol}${amount.toFixed(config.decimalDigits)}`;
}

// =============================================================================
// Validation
// =============================================================================

export function isValidCurrency(value: string): value is Currency {
  return value in CURRENCIES;
}

export function validateAmount(amount: number, currency: Currency): boolean {
  const config = getCurrencyConfig(currency);
  return amount >= config.minAmount;
}

export function getMinAmount(currency: Currency): number {
  return getCurrencyConfig(currency).minAmount;
}

// =============================================================================
// Cookie Helpers (for client-side preference storage)
// =============================================================================

export const CURRENCY_COOKIE_NAME = 'baan-maa-currency';

export function getCurrencyFromCookie(cookieValue: string | undefined): Currency | null {
  if (!cookieValue) return null;
  return isValidCurrency(cookieValue) ? cookieValue : null;
}

import { LRUCache } from 'lru-cache';

// =============================================================================
// Rate Limiting Configuration
// =============================================================================

interface RateLimitConfig {
  interval: number;  // Time window in milliseconds
  maxRequests: number;  // Maximum requests per window
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// =============================================================================
// Rate Limiter Class
// =============================================================================

export class RateLimiter {
  private cache: LRUCache<string, RateLimitEntry>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.cache = new LRUCache<string, RateLimitEntry>({
      max: 10000, // Maximum number of keys to store
      ttl: config.interval, // Auto-expire entries
    });
  }

  /**
   * Check if a request should be allowed
   * @param key - Unique identifier (usually IP address)
   * @returns Object with allowed status and remaining requests
   */
  check(key: string): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    const entry = this.cache.get(key);

    if (!entry || now >= entry.resetAt) {
      // First request or window expired
      const newEntry: RateLimitEntry = {
        count: 1,
        resetAt: now + this.config.interval,
      };
      this.cache.set(key, newEntry);
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetAt: newEntry.resetAt,
      };
    }

    if (entry.count >= this.config.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    // Increment count
    entry.count += 1;
    this.cache.set(key, entry);

    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.cache.delete(key);
  }
}

// =============================================================================
// Pre-configured Rate Limiters
// =============================================================================

// Form submissions: 10 per minute
export const formRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 10,
});

// Authentication: 5 attempts per minute
export const authRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 5,
});

// API requests: 100 per minute
export const apiRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 100,
});

// Stripe checkout: 20 per minute
export const checkoutRateLimiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 20,
});

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  // Check various headers for the real IP
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Fallback
  return 'unknown';
}

/**
 * Rate limit check for API routes
 * @returns Error response if rate limited, null if allowed
 */
export function checkRateLimit(
  limiter: RateLimiter,
  key: string
): Response | null {
  const result = limiter.check(key);

  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Too many requests. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': result.resetAt.toString(),
          'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null;
}

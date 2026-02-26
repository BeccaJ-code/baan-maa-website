import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createCheckoutSession } from '@/lib/stripe';
import { isValidCurrency, validateAmount } from '@/lib/currency';
import { checkoutRateLimiter, getClientIP, checkRateLimit } from '@/lib/rate-limit';
import type { Currency } from '@/types';

const checkoutSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().refine((val): val is Currency => isValidCurrency(val), {
    message: 'Invalid currency',
  }),
  donationType: z.enum(['once', 'monthly']),
  projectId: z.string().optional(),
  projectName: z.string().optional(),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request.headers);
  const rateLimitResponse = checkRateLimit(checkoutRateLimiter, ip);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const body = await request.json();
    const data = checkoutSchema.parse(body);

    // Validate amount meets minimum
    if (!validateAmount(data.amount, data.currency)) {
      return NextResponse.json(
        { success: false, error: 'Amount below minimum allowed' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const checkoutUrl = await createCheckoutSession({
      amount: data.amount,
      currency: data.currency,
      donationType: data.donationType,
      projectId: data.projectId,
      projectName: data.projectName,
      successUrl: data.successUrl,
      cancelUrl: data.cancelUrl,
    });

    return NextResponse.json({
      success: true,
      url: checkoutUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || 'Invalid request data' },
        { status: 400 }
      );
    }

    console.error('Checkout error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

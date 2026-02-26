import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import type { Currency, CheckoutRequest } from '@/types';

// =============================================================================
// Stripe Client (lazy-loaded to prevent build errors when env vars are not set)
// =============================================================================

let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2026-01-28.clover',
    });
  }
  return stripeInstance;
}

// Export getter for backwards compatibility
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

// =============================================================================
// Currency Configuration
// =============================================================================

const CURRENCY_NAMES: Record<Currency, string> = {
  gbp: 'GBP',
  usd: 'USD',
  eur: 'EUR',
  thb: 'THB',
};

// Convert amount to Stripe's smallest currency unit (cents/pence/satang)
function toStripeAmount(amount: number, currency: Currency): number {
  // THB has different decimal handling
  if (currency === 'thb') {
    return Math.round(amount * 100); // Stripe still expects satang
  }
  return Math.round(amount * 100);
}

// =============================================================================
// Checkout Session Creation
// =============================================================================

export async function createCheckoutSession(request: CheckoutRequest): Promise<string> {
  const { amount, currency, donationType, projectId, projectName, successUrl, cancelUrl } = request;

  const stripeAmount = toStripeAmount(amount, currency);
  const isSubscription = donationType === 'monthly';

  // Build product name
  const productName = projectName
    ? `Donation to ${projectName}`
    : 'Donation to Baan Maa Dog Rescue';

  // Common session parameters
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    mode: isSubscription ? 'subscription' : 'payment',
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      projectId: projectId || '',
      appealId: request.appealId || '',
      projectName: projectName || 'General Fund',
      donationType,
    },
    ...(isSubscription
      ? {
          line_items: [
            {
              price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                  name: productName,
                  description: `Monthly donation to support our rescue dogs`,
                },
                unit_amount: stripeAmount,
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            },
          ],
        }
      : {
          line_items: [
            {
              price_data: {
                currency: currency.toLowerCase(),
                product_data: {
                  name: productName,
                  description: 'One-time donation to support our rescue dogs',
                },
                unit_amount: stripeAmount,
              },
              quantity: 1,
            },
          ],
        }),
  };

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  return session.url;
}

// =============================================================================
// Webhook Handling
// =============================================================================

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not configured');
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const { projectId, appealId, projectName, donationType } = session.metadata || {};

  // Convert from Stripe smallest unit (pence/cents) to pounds/dollars
  const amountInCurrency = (session.amount_total || 0) / 100;

  console.log('Donation received:', {
    sessionId: session.id,
    amount: amountInCurrency,
    currency: session.currency,
    projectId,
    appealId,
    projectName,
    donationType,
    customerEmail: session.customer_details?.email,
  });

  // Update appeal raised amount
  if (appealId) {
    try {
      await prisma.appeal.update({
        where: { id: appealId },
        data: { raisedAmount: { increment: amountInCurrency } },
      });
      console.log(`Updated appeal ${appealId}: +£${amountInCurrency}`);
    } catch (error) {
      console.error('Failed to update appeal raised amount:', error);
    }
  }

  // Update project raised amount
  if (projectId) {
    try {
      await prisma.project.update({
        where: { id: projectId },
        data: { raisedAmount: { increment: amountInCurrency } },
      });
      console.log(`Updated project ${projectId}: +£${amountInCurrency}`);
    } catch (error) {
      console.error('Failed to update project raised amount:', error);
    }
  }
}

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
): Promise<void> {
  console.log('Subscription created:', {
    subscriptionId: subscription.id,
    status: subscription.status,
    customerId: subscription.customer,
  });
}

// =============================================================================
// Utilities
// =============================================================================

export function formatStripeAmount(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
  return formatter.format(amount / 100);
}

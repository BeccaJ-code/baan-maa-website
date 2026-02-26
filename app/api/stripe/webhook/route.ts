import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, handleCheckoutCompleted, handleSubscriptionCreated } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    const body = await request.text();
    const event = constructWebhookEvent(body, signature);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;

      case 'invoice.payment_succeeded':
        // Handle successful subscription payment
        console.log('Subscription payment succeeded:', event.data.object.id);
        break;

      case 'invoice.payment_failed':
        // Handle failed subscription payment
        console.log('Subscription payment failed:', event.data.object.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}


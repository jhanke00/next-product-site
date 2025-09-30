import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;

// Only initialize Stripe if secret key exists
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!stripe) {
      // mocking response if Stripe is not available
      return NextResponse.json({
        clientSecret: 'mock_client_secret',
        message: 'Stripe is mocked - no real payment intent created.',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('Internal Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

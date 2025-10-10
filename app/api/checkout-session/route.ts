import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe( process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2025-09-30.clover',
  });

export async function POST(req: Request, res: any) {
  try {

    const data = await req.json();

    const items = data.items;
    if (!items || !Array.isArray(items)) {
      throw new Error('Not valid input');
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
    success_url: 'http://localhost:3000/Success',
    cancel_url: 'http://localhost:3000/Cancel',
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
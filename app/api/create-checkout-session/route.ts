// app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: Request) {
  try {
    console.log('✅ API HIT');

    const body = await req.json();
    console.log('✅ Body:', body);

    const items = body.items;
    if (!items || !Array.isArray(items)) {
      throw new Error('Invalid items array');
    }

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name || 'Unnamed Product',
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    console.log('✅ Line Items:', line_items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    console.log('✅ Stripe Session Created:', session.id);
    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('❌ Stripe Session Creation Failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { sendPaymentConfirmationEmail } from '../lib/email'; // Adjust the path as necessary

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    console.log('✅ Payment completed webhook triggered');

    const session = event.data.object as Stripe.Checkout.Session;

    const customerEmail = session.customer_details?.email;
    const customerName = session.customer_details?.name || 'Customer';
    const amount = (session.amount_total! / 100).toFixed(2);

    console.log('Sending email to:', customerEmail);

    if (customerEmail) {
      await sendPaymentConfirmationEmail(customerEmail, customerName, `$${amount}`);
    } else {
      console.error('❌ Customer email is missing');
    }

    console.log('✅ Email sent successfully');
  }

  return new Response('OK', { status: 200 });
}

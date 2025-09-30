'use client';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '@/src/context/CartContext';
import CheckoutForm from '@/src/components/CheckoutForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function Payment() {
  const { state } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    // create PaymentIntent on server when page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Math.round(total * 100) }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
      });
  }, [total]);

  if (!clientSecret) return <div className='p-6 max-w-2xl mx-auto'>Loading payment…</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className='p-6 max-w-2xl mx-auto'>
        <h2 className='text-2xl font-bold mb-6'>Payment Information</h2>

        <div className='mb-6 p-4 bg-gray-50 rounded'>
          <h3 className='font-medium mb-2'>Order Summary</h3>
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className='flex justify-between font-bold'>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <CheckoutForm />
      </div>
    </Elements>
  );
}

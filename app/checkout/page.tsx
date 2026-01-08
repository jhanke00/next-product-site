'use client';
import React, { useState } from 'react';
import { useCart } from '../../src/context/CartContext';
import { useRouter } from 'next/navigation';

type Shipping = {
  name: string;
  address: string;
  city: string;
  postal: string;
  email: string;
};

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState<number>(1);
  const [shipping, setShipping] = useState<Shipping>({ name: '', address: '', city: '', postal: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailPreview, setEmailPreview] = useState<string | null>(null);

  const placeOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shipping, total: subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.error || 'Failed to create order';
        setError(msg);
        setOrderId(null);
        setStep(4);
        return;
      }

      setOrderId(data.id || 'mock-' + Date.now());
      setError(null);
      setEmailPreview(data.emailPreview || null);
      clear();
      setStep(4);
    } catch (e) {
      console.error(e);
      setError('Failed to create order. Please try again.');
      setOrderId(null);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  if (items.length === 0 && step === 1) {
    return (
      <div className='p-6'>
        <p>Your cart is empty. Add items before checkout.</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex gap-4 text-black'>
        <div className={`px-3 py-2 rounded ${step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Review</div>
        <div className={`px-3 py-2 rounded ${step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Shipping</div>
        <div className={`px-3 py-2 rounded ${step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>Payment</div>
        <div className={`px-3 py-2 rounded ${step === 4 ? 'bg-green-600 text-black' : 'bg-gray-100'}`}>
          Confirmation
        </div>
      </div>

      {step === 1 && (
        <section className='p-4 border rounded text-white'>
          <h2 className='font-semibold mb-4'>Order review</h2>
          <ul className='space-y-2'>
            {items.map((it) => (
              <li key={it.id} className='flex justify-between'>
                <div>
                  {it.name} x {it.quantity}
                </div>
                <div>${(it.price * it.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className='mt-4 flex justify-between font-semibold'>
            Total <div>${subtotal.toFixed(2)}</div>
          </div>
          <div className='mt-4 flex gap-2'>
            <button
              className='px-4 py-2 border rounded'
              onClick={() => {
                router.push('/cart');
              }}
            >
              Edit cart
            </button>
            <button className='px-4 py-2 bg-blue-600 text-white rounded' onClick={() => setStep(2)}>
              Continue
            </button>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className='p-4 border rounded text-white'>
          <h2 className='font-semibold mb-4'>Shipping information</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className='space-y-3'
          >
            <div>
              <label className='block text-sm'>Full name</label>
              <input
                required
                value={shipping.name}
                onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                className='w-full border rounded px-2 py-1'
              />
            </div>
            <div>
              <label className='block text-sm'>Address</label>
              <input
                required
                value={shipping.address}
                onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                className='w-full border rounded px-2 py-1'
              />
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <div>
                <label className='block text-sm'>City</label>
                <input
                  required
                  value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                  className='w-full border rounded px-2 py-1'
                />
              </div>
              <div>
                <label className='block text-sm'>Postal</label>
                <input
                  required
                  value={shipping.postal}
                  onChange={(e) => setShipping({ ...shipping, postal: e.target.value })}
                  className='w-full border rounded px-2 py-1'
                />
              </div>
              <div>
                <label className='block text-sm'>Email</label>
                <input
                  required
                  type='email'
                  value={shipping.email}
                  onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                  className='w-full border rounded px-2 py-1'
                />
              </div>
            </div>

            <div className='flex gap-2'>
              <button type='button' className='px-4 py-2 border rounded' onClick={() => setStep(1)}>
                Back
              </button>
              <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded'>
                Continue to payment
              </button>
            </div>
          </form>
        </section>
      )}

      {step === 3 && (
        <section className='p-4 border rounded text-white'>
          <h2 className='font-semibold mb-4'>Payment</h2>
          <p className='text-sm text-gray-600'>
            We use a mock payment gateway for this demo. Enter any card-like values.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              placeOrder();
            }}
            className='space-y-3 mt-3'
          >
            <div>
              <label className='block text-sm'>Card number</label>
              <input required placeholder='4242 4242 4242 4242' className='w-full border rounded px-2 py-1' />
            </div>
            <div className='grid grid-cols-3 gap-2'>
              <div>
                <label className='block text-sm'>Expiry</label>
                <input required placeholder='12/34' className='w-full border rounded px-2 py-1' />
              </div>
              <div>
                <label className='block text-sm'>CVC</label>
                <input required placeholder='123' className='w-full border rounded px-2 py-1' />
              </div>
              <div>
                <label className='block text-sm'>Name on card</label>
                <input required placeholder={shipping.name} className='w-full border rounded px-2 py-1' />
              </div>
            </div>

            <div className='flex gap-2'>
              <button type='button' className='px-4 py-2 border rounded' onClick={() => setStep(2)}>
                Back
              </button>
              <button type='submit' className='px-4 py-2 bg-blue-600 text-white rounded' disabled={loading}>
                {loading ? 'Processing...' : 'Pay & place order'}
              </button>
            </div>
          </form>
        </section>
      )}

      {step === 4 && (
        <section
          className={`p-4 border rounded ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-600'}`}
        >
          <h2 className='font-semibold'>{error ? 'Order Error' : 'Order confirmed'}</h2>
          {error ? (
            <p className='mt-2'>{error}</p>
          ) : (
            <div>
              <p className='mt-2'>
                Thank you! Your order {orderId ? <strong>{orderId}</strong> : null} has been received. A confirmation
                email was sent (mock).
              </p>
              {emailPreview ? (
                <p className='mt-2'>
                  Preview email:{' '}
                  <a className='underline' href={emailPreview} target='_blank' rel='noreferrer'>
                    {emailPreview}
                  </a>
                </p>
              ) : null}
            </div>
          )}
          <div className='mt-4'>
            <button
              className='px-4 py-2 bg-blue-600 text-white rounded'
              onClick={() => {
                router.push('/products');
              }}
            >
              Back to shopping
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

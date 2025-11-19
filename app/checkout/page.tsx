'use client';
import React, { useState, useEffect } from 'react';
import ShippingForm from '@/src/components/checkout/shipping/ShippingForm';
import PaymentForm from '@/src/components/checkout/payment/PaymentForm';
import OrderConfirmation from '@/src/components/checkout/confirmation/OrderConfirmation';

const STORAGE_KEY = 'checkout_state';

type CheckoutState = {
  step: number;
  shipping: any;
  payment: any;
  cart: null | { items: any };
};

export default function CheckoutPage() {
  const [state, setState] = useState<CheckoutState>({
    step: 1,
    shipping: null,
    payment: null,
    cart: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setState(JSON.parse(stored));
    } else {
      const cart = localStorage.getItem('cart');
      setState({
        step: 1,
        shipping: null,
        payment: null,
        cart: cart ? { items: JSON.parse(cart) } : { items: [] },
      });
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (state.step === 2 && !state.shipping) {
      setState((s: any) => ({ ...s, step: 1 }));
    }
    if (state.step === 3 && (!state.shipping || !state.payment)) {
      setState((s: any) => ({ ...s, step: 1 }));
    }
  }, [state.step, state.shipping, state.payment, isLoaded]);

  if (!isLoaded) return <div>Loading checkout...</div>;

  return (
    <div>
      <div>Current step: {state.step}</div>
      {state.step === 1 && (
        <ShippingForm
          onNext={(data) => setState((s: any) => ({ ...s, shipping: data, step: 2 }))}
          onBack={() => (window.location.href = '/cart')}
          initialData={state.shipping}
        />
      )}
      {state.step === 2 && (
        <PaymentForm
          onNext={(data) => setState((s: any) => ({ ...s, payment: data, step: 3 }))}
          onBack={() => setState((s: any) => ({ ...s, step: 1 }))}
          initialData={state.payment}
        />
      )}
      {state.step === 3 && (
        <OrderConfirmation
          shipping={state.shipping}
          payment={state.payment}
          cart={state.cart}
          onBack={() => setState((s: any) => ({ ...s, step: 2 }))}
        />
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/src/context/CartContext';

export default function CheckoutForm() {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { state } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      // Save order details before payment processing
      const shippingInfo = localStorage.getItem('shipping-info');

      const parsedShippingInfo = JSON.parse(shippingInfo || '{}');
      const orderDetails = {
        items: state.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shipping: parsedShippingInfo,
        payment: {
          last4: '****',
          total: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        },
        orderDate: new Date().toISOString(),
      };

      localStorage.setItem('last-order', JSON.stringify(orderDetails));

      // Process payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/confirmation`,
        },
      });

      if (confirmError) {
        // If payment fails, remove the saved order
        localStorage.removeItem('last-order');
        setError(confirmError.message ?? 'An error occurred');
      }
    } catch (error) {
      console.error('Error processing order:', error);
      setError('Failed to process order. Please try again.');
      localStorage.removeItem('last-order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <PaymentElement />

      {error && <div className='text-red-500 text-sm mt-1'>{error}</div>}

      <div className='flex justify-end space-x-4 pt-4'>
        <button
          type='button'
          onClick={() => router.back()}
          className='px-4 py-2 text-gray-600 hover:text-gray-800'
          disabled={isProcessing}
        >
          Back
        </button>
        <button
          type='submit'
          className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300'
          disabled={isProcessing || !stripe}
        >
          {isProcessing ? 'Processing...' : 'Complete Order'}
        </button>
      </div>
    </form>
  );
}

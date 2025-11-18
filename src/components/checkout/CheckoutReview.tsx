'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/contexts/CartContext';

export const CheckoutReview: React.FC = () => {
  const { cart } = useCart();
  const router = useRouter();

  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = cart.totalPrice > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  const handleContinue = () => {
    router.push('/checkout/shipping');
  };

  const handleBack = () => {
    router.push('/cart');
  };

  if (cart.items.length === 0) {
    return (
      <div className='max-w-4xl mx-auto p-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Your cart is empty</h2>
          <button
            onClick={() => router.push('/products')}
            className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Order Review</h2>

      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Order Items ({cart.totalItems})</h3>

        <div className='space-y-4'>
          {cart.items.map((item) => {
            const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;

            return (
              <div
                key={item.product.id}
                className='flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0'
              >
                <div className='flex-1'>
                  <p className='font-medium text-gray-900 dark:text-white'>{item.product.name}</p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Quantity: {item.quantity}</p>
                </div>
                <p className='font-semibold text-gray-900 dark:text-white'>${(price * item.quantity).toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Order Summary</h3>

        <div className='space-y-2'>
          <div className='flex justify-between text-gray-700 dark:text-gray-300'>
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-gray-700 dark:text-gray-300'>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className='flex justify-between text-gray-700 dark:text-gray-300'>
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className='border-t border-gray-200 dark:border-gray-700 pt-2 mt-2'>
            <div className='flex justify-between text-xl font-bold text-gray-900 dark:text-white'>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {cart.totalPrice < 100 && (
        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6'>
          <p className='text-sm text-yellow-800 dark:text-yellow-200'>
            Add ${(100 - cart.totalPrice).toFixed(2)} more to get free shipping!
          </p>
        </div>
      )}

      <div className='flex gap-4'>
        <button
          onClick={handleBack}
          className='flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
        >
          Back to Cart
        </button>
        <button
          onClick={handleContinue}
          className='flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
        >
          Continue to Shipping
        </button>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/contexts/CartContext';
import { CartItem } from './CartItem';

export const CartDisplay: React.FC = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const handleCheckout = () => {
    router.push('/checkout/review');
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  if (cart.items.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[400px] p-8'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>Your cart is empty</h2>
          <p className='text-gray-600 dark:text-gray-400 mb-8'>Add some products to get started!</p>
          <button
            onClick={handleContinueShopping}
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
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Shopping Cart</h1>
        <button
          onClick={clearCart}
          className='px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors'
        >
          Clear Cart
        </button>
      </div>

      <div className='space-y-4 mb-6'>
        {cart.items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      <div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
        <div className='flex justify-between items-center mb-4'>
          <div className='text-gray-600 dark:text-gray-400'>
            <p className='text-sm'>Total Items: {cart.totalItems}</p>
          </div>
          <div className='text-right'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>Subtotal</p>
            <p className='text-3xl font-bold text-gray-900 dark:text-white'>${cart.totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <div className='flex gap-4'>
          <button
            onClick={handleContinueShopping}
            className='flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
          >
            Continue Shopping
          </button>
          <button
            onClick={handleCheckout}
            className='flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

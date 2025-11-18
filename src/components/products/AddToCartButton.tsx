'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/contexts/CartContext';
import { Product } from '@/src/type/products';

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product }) => {
  const { addToCart, updateQuantity, removeFromCart, getItemQuantity } = useCart();
  const router = useRouter();

  const inCart = getItemQuantity(product.id) > 0;
  const quantity = getItemQuantity(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleIncrement = () => {
    if (quantity < product.countInStock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleQuantityInput = (value: number) => {
    if (value >= 1 && value <= product.countInStock) {
      updateQuantity(product.id, value);
    } else if (value < 1) {
      removeFromCart(product.id);
    }
  };

  const handleViewCart = () => {
    router.push('/cart');
  };

  if (product.countInStock === 0) {
    return (
      <div className='mt-6'>
        <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4'>
          <p className='text-red-800 dark:text-red-200 font-semibold'>Out of Stock</p>
        </div>
        <button
          onClick={handleViewCart}
          className='w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
        >
          View Cart
        </button>
      </div>
    );
  }

  return (
    <div className='mt-6'>
      {inCart ? (
        <div className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4'>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3'>Quantity</label>
          <div className='flex items-center gap-3'>
            <button
              onClick={handleDecrement}
              className='w-12 h-12 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xl font-semibold'
              aria-label='Decrease quantity'
            >
              -
            </button>
            <input
              type='number'
              min='1'
              max={product.countInStock}
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                handleQuantityInput(value);
              }}
              className='w-24 text-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={handleIncrement}
              disabled={quantity >= product.countInStock}
              className='w-12 h-12 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xl font-semibold'
              aria-label='Increase quantity'
            >
              +
            </button>
            <span className='text-sm text-gray-600 dark:text-gray-400 ml-2'>/ {product.countInStock} available</span>
          </div>
        </div>
      ) : (
        <button
          onClick={handleAddToCart}
          className='w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-4'
        >
          Add to Cart
        </button>
      )}

      <button
        onClick={handleViewCart}
        className='w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
      >
        View Cart
      </button>
    </div>
  );
};

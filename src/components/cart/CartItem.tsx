'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/src/type/cart';
import { useCart } from '@/src/contexts/CartContext';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity } = item;

  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;

  const itemTotal = price * quantity;

  const handleIncrement = () => {
    if (quantity < product.countInStock) {
      updateQuantity(product.id, quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      // Remove item when quantity would go below 1
      removeFromCart(product.id);
    }
  };

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  return (
    <div className='flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:shadow-md transition-shadow'>
      <div className='flex-1'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>{product.name}</h3>
        <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{product.description}</p>
        <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>Category: {product.category}</p>
        <p className='text-lg font-bold text-gray-900 dark:text-white mt-2'>${price.toFixed(2)}</p>
      </div>

      <div className='flex flex-col items-center gap-2'>
        <div className='flex items-center gap-2'>
          <button
            onClick={handleDecrement}
            className='w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
            aria-label='Decrease quantity'
          >
            -
          </button>
          <span className='w-12 text-center font-semibold text-gray-900 dark:text-white'>{quantity}</span>
          <button
            onClick={handleIncrement}
            disabled={quantity >= product.countInStock}
            className='w-8 h-8 flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            aria-label='Increase quantity'
          >
            +
          </button>
        </div>
        <p className='text-xs text-gray-500 dark:text-gray-500'>{product.countInStock} in stock</p>
      </div>

      <div className='flex flex-col items-end gap-2'>
        <p className='text-xl font-bold text-gray-900 dark:text-white'>${itemTotal.toFixed(2)}</p>
        <button
          onClick={handleRemove}
          className='px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors'
        >
          Remove
        </button>
      </div>
    </div>
  );
};

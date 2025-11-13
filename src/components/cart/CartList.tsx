'use client';

import React from 'react';
import { useCart } from '@/src/context/CartContext';
import CartItem from './CartItem';

export default function CartList() {
  const { state, updateQty, removeItem } = useCart();

  const handleIncrease = (productId: string, currentQty: number) => {
    updateQty(productId, currentQty + 1);
  };

  const handleDecrease = (productId: string, currentQty: number) => {
    if (currentQty > 1) {
      updateQty(productId, currentQty - 1);
    } else {
      removeItem(productId);
    }
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  if (state.items.length === 0) {
    return (
      <div className='py-8 text-center'>
        <p className='text-gray-500 text-lg'>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {state.items.map((item) => (
        <CartItem
          key={item.productId}
          item={item}
          onIncrease={() => handleIncrease(item.productId, item.qty)}
          onDecrease={() => handleDecrease(item.productId, item.qty)}
          onRemove={() => handleRemove(item.productId)}
        />
      ))}
    </div>
  );
}

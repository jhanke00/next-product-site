'use client';
import React from 'react';
import { useCart } from '../../src/context/CartContext';
import CartDisplay from '../../src/components/cart/cartDisplay/CartDisplay';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { state, dispatch } = useCart();
  const router = useRouter();

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div style={{ minHeight: '50%', padding: '2rem' }}>
      <CartDisplay
        items={state.items}
        onRemove={handleRemove}
        onQuantityChange={handleQuantityChange}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default CartPage;

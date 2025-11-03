'use client';
import React, { useState } from 'react';
import { useCart } from '@/src/context/CartContext';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { CartSidebar } from './CartSidebar';

export const CartButton: React.FC = () => {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      <button
        onClick={openCart}
        className='relative p-2 text-gray-700 hover:text-blue-600 transition-colors'
        aria-label={`Shopping cart with ${cart.totalItems} items`}
      >
        <ShoppingBagIcon className='w-6 h-6' />
        {cart.totalItems > 0 && (
          <span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse border-2 border-white shadow-lg min-w-[1.25rem]'>
            <span className='text-white font-extrabold leading-none'>
              {cart.totalItems > 99 ? '99+' : cart.totalItems}
            </span>
          </span>
        )}
      </button>

      <CartSidebar isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

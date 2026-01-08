'use client';
import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function CartView() {
  const { items, updateQty, removeItem, subtotal } = useCart();

  if (!items || items.length === 0) {
    return (
      <div className='p-6'>
        <h2 className='text-lg font-medium'>Your cart is empty</h2>
        <p className='mt-2 text-sm text-gray-600'>Add products to get started.</p>
      </div>
    );
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>Cart</h2>
        <div className='relative flex items-center'>
          <span className='sr-only'>Cart items</span>
          <svg
            width='28'
            height='28'
            viewBox='0 0 24 24'
            fill='currentColor'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden
          >
            <path d='M7 4h-2l-1 2h2l3.6 7.59-1.35 2.44A1 1 0 0 0 9 17h8v-2H10.42c.03 0 .06-.02.09-.04L11 14h7a1 1 0 0 0 .9-.56l3-6A1 1 0 0 0 21 5H6.21l-.94-2H1v2h2l3.6 7.59L6.27 15H19v2H6a1 1 0 0 1-.9-.57L2 6H7z' />
          </svg>
        </div>
      </div>
      <ul className='space-y-4'>
        {items.map((it) => (
          <li key={it.id} className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <img src={it.image || '/Cart.png'} alt={it.name} className='w-16 h-16 object-cover rounded' />
              <div>
                <div className='font-medium'>{it.name}</div>
                <div className='text-sm text-gray-600'>${Number(it.price).toFixed(2)}</div>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <input
                aria-label={`Quantity for ${it.name}`}
                type='number'
                min={1}
                value={it.quantity}
                onChange={(e) => updateQty(it.id, Number(e.target.value))}
                className='w-20 border rounded px-2 py-1'
              />
              <div className='w-24 text-right font-medium'>${(Number(it.price) * it.quantity).toFixed(2)}</div>
              <button className='text-red-600 text-sm' onClick={() => removeItem(it.id)}>
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className='mt-6 flex items-center justify-between'>
        <div className='text-lg font-semibold'>Subtotal</div>
        <div className='text-lg font-semibold'>${Number(subtotal).toFixed(2)}</div>
      </div>

      <div className='mt-6 flex gap-3'>
        <Link href='/products' className='px-4 py-2 border rounded'>
          Continue shopping
        </Link>
        <Link href='/checkout' className='px-4 py-2 bg-blue-600 text-white rounded'>
          Checkout
        </Link>
      </div>
    </div>
  );
}

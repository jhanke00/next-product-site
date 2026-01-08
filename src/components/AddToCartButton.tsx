'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';

type Props = {
  id: string;
  name: string;
  price: number | string;
  image?: string;
  countInStock?: number;
};

export default function AddToCartButton({ id, name, price, image, countInStock = 999 }: Props) {
  const { addItem } = useCart();   // customReact-hook exposed cart actions & here destructure the addItem
  const [qty, setQty] = useState<number>(1);  // local state for quantity input
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false); // local state to prevent multiple duplicate adds

  const handleAdd = async () => {
    if (isAdding) return;
    setIsAdding(true);
    addItem({ id, name, price: Number(price), quantity: qty, image });
    // reset local qty to sensible default
    setQty(1);
    // await navigation to avoid double-add from rapid user actions
    try {
      // router.push returns a Promise in App Router
      // @ts-ignore
      await router.push('/cart');
    } catch {
      // ignore navigation errors
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className='mt-4 flex items-center gap-3'>
      <input
        aria-label='quantity'
        type='number'
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, parseInt(String(e.target.value)) || 1))}
        className='w-20 border rounded px-2 py-1'
      />
      <button
        onClick={handleAdd}
        disabled={countInStock <= 0 || isAdding}
        className='px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50'
      >
        Add to cart
      </button>
    </div>
  );
}

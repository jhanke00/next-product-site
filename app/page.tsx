// app/page.tsx
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import products from '../src/mock/small/products.json';
import Homepage from './homepage';

export default function HomePage() {
  const cartContext = useContext(CartContext);

  if (!cartContext) return <p>Loading...</p>;

  const { cart, addItem, removeItem, updateQuantity } = cartContext;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCartItem = (id: string) => cart.find((c) => c.id === id);

  const handleAdd = (product: any) => {
    const existing = getCartItem(product.id);
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      addItem({ id: product.id, name: product.name, price: Number(product.price), quantity: 1 });
    }
  };

  const handleRemove = (id: string) => {
    const existing = getCartItem(id);
    if (!existing) return;
    if (existing.quantity > 1) updateQuantity(id, existing.quantity - 1);
    else removeItem(id);
  };

  return (
    <main className='p-8'>
      <Homepage />
      {/* 
      <header className="flex items-center justify-between mb-6 mt-6">
        <h1 className="text-3xl font-bold">Stationery & Supplies</h1>
        <div className="flex gap-3">
          <Link href="/cart">
            <button className="px-4 py-2 bg-blue-600 text-white rounded">View Cart ({totalItems})</button>
          </Link>
          <Link href="/checkout">
            <button className="px-4 py-2 bg-green-600 text-white rounded">Checkout</button>
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p: any) => (
          <article key={p.id} className="border p-4 rounded">
            <h2 className="font-semibold mb-2">{p.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{p.description}</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold">${p.price}</span>
                <div className="text-xs text-gray-500">In stock: {p.countInStock}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemove(p.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  -
                </button>
                <span className="px-2">
                  {getCartItem(p.id)?.quantity ?? 0}
                </span>
                <button
                  onClick={() => handleAdd(p)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  +
                </button>
              </div>
            </div>
          </article>
        ))}
      </section> */}
    </main>
  );
}

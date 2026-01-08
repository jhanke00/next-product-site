'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  // shape of a cart item
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartContextType = {
  // shape of the cart context
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined); // create context

export const useCart = () => {
  // custom hook for consuming cart context
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      if (typeof window === 'undefined') return [];
      const raw = localStorage.getItem('cart:v1');
      const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
      // Ensure price and quantity values are numbers (in case stored as strings)
      return parsed.map((i) => ({ ...i, price: Number(i.price), quantity: Number((i as any).quantity || 0) }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart:v1', JSON.stringify(items));
    } catch {}
  }, [items]);

  // updates localStorage synchronously inside the setItems callback using the computed next array, ensuring persistence even before React state actually re-renders
  const addItem = (item: CartItem) => {
    // coerce price and quantity to numbers
    const normalized = {
      ...item,
      price: Number(item.price),
      quantity: Math.max(1, Number((item as any).quantity || 1)),
    } as CartItem;

    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === normalized.id);
      let next: CartItem[];
      if (idx >= 0) {
        const copy = [...prev];
        const prevQty = Number(copy[idx].quantity || 0);
        copy[idx] = { ...copy[idx], quantity: Math.max(1, prevQty + normalized.quantity) }; // normalizes price/quantity, if item exists increments quantity (clamped to >=1), otherwise appends; writes updated array to localStorage
        next = copy;
      } else {
        next = [...prev, normalized];
      }

      try {
        localStorage.setItem('cart:v1', JSON.stringify(next));
      } catch {}

      return next;
    });
  };

  const updateQty = (id: string, qty: number) => {
    const n = Math.max(1, Number(qty));
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: n } : p)));
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  //  to avoid recomputing on unrelated renders.
  const subtotal = useMemo(() => items.reduce((s, i) => s + Number(i.price) * i.quantity, 0), [items]); // Computes subtotal with useMemo for cheap derived state.

  // provide context value And can be used by any child component
  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

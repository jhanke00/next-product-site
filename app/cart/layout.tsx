import React from 'react';
import { CartProvider } from '@/src/context/CartContext';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

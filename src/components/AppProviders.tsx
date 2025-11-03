'use client';

import React from 'react';
import { CartProvider } from '@/src/context/CartContext';
import { AdminProvider } from '@/src/context/AdminContext';
import { AdminPanel } from '@/src/components/AdminPanel';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AdminProvider>
      <CartProvider>
        <AdminPanel />
        {children}
      </CartProvider>
    </AdminProvider>
  );
};

export default AppProviders;

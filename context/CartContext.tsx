'use client';

// context/CartContext.tsx
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(savedCart);
    } catch {
      setCart([]);
    }

    try {
      const savedOrder = JSON.parse(localStorage.getItem('currentOrder') || 'null');
      setCurrentOrder(savedOrder);
    } catch {
      setCurrentOrder(null);
    }

    try {
      const savedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
      setAddresses(savedAddresses);
    } catch {
      setAddresses([]);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Persist order
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (currentOrder) {
      localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    } else {
      localStorage.removeItem('currentOrder');
    }
  }, [currentOrder]);

  // Persist saved addresses
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  // Cross-tab sync
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'cart') {
        try {
          setCart(JSON.parse(e.newValue || '[]'));
        } catch {}
      }
      if (e.key === 'currentOrder') {
        try {
          setCurrentOrder(JSON.parse(e.newValue || 'null'));
        } catch {}
      }
      if (e.key === 'addresses') {
        try {
          setAddresses(JSON.parse(e.newValue || '[]'));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addItem = (item: any) => setCart((prev) => [...prev, item]);
  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));
  const updateQuantity = (id: string, qty: number) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));

  const addAddress = (address: any) => setAddresses((prev) => [...prev, address]);
  const removeAddress = (id: string) => setAddresses((prev) => prev.filter((address) => address.id !== id));

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const clearOrder = () => {
    setCurrentOrder(null);
    localStorage.removeItem('currentOrder');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        currentOrder,
        setCurrentOrder,
        clearOrder,
        addresses,
        addAddress,
        removeAddress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

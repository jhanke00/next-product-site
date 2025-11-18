'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, CartContextType } from '@/src/type/cart';
import { Product } from '@/src/type/products';

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopping_cart';

const initialCart: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return { totalItems, totalPrice };
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [intialLoaded, setIntialLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setIntialLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (intialLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, intialLoaded]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.items.findIndex((item) => item.product.id === product.id);

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
      } else {
        // Add new item
        newItems = [...prevCart.items, { product, quantity }];
      }

      const { totalItems, totalPrice } = calculateCartTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.product.id !== productId);
      const { totalItems, totalPrice } = calculateCartTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
      const { totalItems, totalPrice } = calculateCartTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalPrice,
      };
    });
  };

  const clearCart = () => {
    setCart(initialCart);
  };

  const isInCart = (productId: string): boolean => {
    return cart.items.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId: string): number => {
    const item = cart.items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

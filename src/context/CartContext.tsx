'use client';
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Cart, CartItem, CartContextType } from '@/src/type/cart';

// Cart Actions
type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Omit<CartItem, 'quantity' | 'addedAt'>; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: Cart };

// Cart Reducer
const cartReducer = (state: Cart, action: CartAction): Cart => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === product.id);

      let newItems: CartItem[];
      if (existingItemIndex > -1) {
        // Update existing item quantity
        newItems = state.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          quantity,
          addedAt: new Date(),
        };
        newItems = [...state.items, newItem];
      }

      return calculateCartTotals({ items: newItems });
    }

    case 'REMOVE_FROM_CART': {
      const newItems = state.items.filter((item) => item.id !== action.payload.productId);
      return calculateCartTotals({ items: newItems });
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        const newItems = state.items.filter((item) => item.id !== productId);
        return calculateCartTotals({ items: newItems });
      }

      const newItems = state.items.map((item) => (item.id === productId ? { ...item, quantity } : item));
      return calculateCartTotals({ items: newItems });
    }

    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalPrice: 0 };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
};

// Calculate cart totals
const calculateCartTotals = (cart: { items: CartItem[] }): Cart => {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  return {
    items: cart.items,
    totalItems,
    totalPrice: Math.round(totalPrice * 100) / 100, // Round to 2 decimal places
  };
};

// Initial cart state
const initialCartState: Cart = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Convert addedAt strings back to Date objects
        const cartWithDates = {
          ...parsedCart,
          items: parsedCart.items.map((item: any) => ({
            ...item,
            addedAt: new Date(item.addedAt),
          })),
        };
        dispatch({ type: 'LOAD_CART', payload: cartWithDates });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shopping-cart', JSON.stringify(cart));
  }, [cart]);

  // Cart actions
  const addToCart = (product: Omit<CartItem, 'quantity' | 'addedAt'>, quantity: number = 1) => {
    // Check if product is in stock
    if (product.countInStock === 0) {
      alert('Sorry, this product is out of stock!');
      return;
    }

    // Check if adding this quantity would exceed stock
    const currentQuantity = getCartItemQuantity(product.id);
    if (currentQuantity + quantity > product.countInStock) {
      alert(`Sorry, only ${product.countInStock} items available in stock!`);
      return;
    }

    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = cart.items.find((item) => item.id === productId);
    if (item && quantity > item.countInStock) {
      alert(`Sorry, only ${item.countInStock} items available in stock!`);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const isInCart = (productId: string): boolean => {
    return cart.items.some((item) => item.id === productId);
  };

  const getCartItemQuantity = (productId: string): number => {
    const item = cart.items.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

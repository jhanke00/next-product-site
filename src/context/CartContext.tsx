'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}

export interface CartState {
  items: CartItem[];
  shipping?: any;
}

// Action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: { id: string; name: string; price: number | string }; qty?: number } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; qty: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SHIPPING'; payload: { shipping: any } }
  | { type: 'HYDRATE_CART'; payload: CartState };

// Initial state
const initialState: CartState = {
  items: [],
  shipping: undefined,
};

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, qty = 1 } = action.payload;
      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
      const existingItem = state.items.find((item) => item.productId === product.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) => (item.productId === product.id ? { ...item, qty: item.qty + qty } : item)),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price,
            qty,
          },
        ],
      };
    }

    case 'UPDATE_QTY': {
      const { productId, qty } = action.payload;
      if (qty <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.productId !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) => (item.productId === productId ? { ...item, qty } : item)),
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== action.payload.productId),
      };
    }

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        shipping: undefined,
      };
    }

    case 'SET_SHIPPING': {
      return {
        ...state,
        shipping: action.payload.shipping,
      };
    }

    case 'HYDRATE_CART': {
      return action.payload;
    }

    default:
      return state;
  }
}

// Context
interface CartContextType {
  state: CartState;
  addItem: (product: { id: string; name: string; price: number | string }, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  setShipping: (shipping: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Hydrate from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          dispatch({ type: 'HYDRATE_CART', payload: parsedCart });
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Persist to localStorage on every state change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [state]);

  // Methods
  const addItem = (product: { id: string; name: string; price: number | string }, qty: number = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, qty } });
  };

  const updateQty = (productId: string, qty: number) => {
    dispatch({ type: 'UPDATE_QTY', payload: { productId, qty } });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setShipping = (shipping: any) => {
    dispatch({ type: 'SET_SHIPPING', payload: { shipping } });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        setShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({ state: { items: [] }, dispatch: () => null });

const loadInitialState = (): CartState => {
  if (typeof window !== 'undefined') {
    try {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        return { items };
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }
  return { items: [] };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((item) => item.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) => {
            if (item.id === action.item.id) {
              return {
                ...item,
                quantity: item.quantity + action.item.quantity,
              };
            } else {
              return item;
            }
          }),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) => {
          if (item.id === action.id) {
            return {
              ...item,
              quantity: action.quantity,
            };
          } else {
            return item;
          }
        }),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, null, loadInitialState);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state.items));
    }
  }, [state.items]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
};

export default CartProvider;

export const useCart = () => useContext(CartContext);

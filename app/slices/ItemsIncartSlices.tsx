import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { items, ShippingInfo, PaymentInfo } from '../types/types'

export interface MySliceState {
  items: items[];
}

interface CheckoutState {
  currentStep: 'cart' | 'shipping' | 'payment' | 'confirmation';
  items: items[];
  shippingInfo: ShippingInfo | null;
  paymentInfo: PaymentInfo | null;
  orderConfirmed: boolean;
}
const initialState: CheckoutState = {
  currentStep: 'cart',
  items: [],
  shippingInfo: null,
  paymentInfo: null,
  orderConfirmed: false,
};

const ItemsIncartSlice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {
    // Reducer to add a product
    addProductInCart: (state, action: PayloadAction<items>) => {
      const newItem = action.payload;
      const itemExists = state.items.find(item => item.id === newItem.id);
      if (itemExists) {
        return state;
      }
      state.items.push(newItem);
    },
    // Reducer to remove a product
    removeProductInCart: (state, action) => {
      state.items = state.items.filter(
        (product ) => product.id !== action.payload
      );
    },
    //Increment count
    incrementItem: (state, action: PayloadAction<items>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementItem: (state, action: PayloadAction<items>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    setShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
      state.currentStep = 'payment';
    },
    setPaymentInfo: (state, action: PayloadAction<PaymentInfo>) => {
      state.paymentInfo = action.payload;
      state.currentStep = 'confirmation';
    },
    confirmOrder: (state) => {
      state.orderConfirmed = true;
    },
    goToStep: (state, action: PayloadAction<CheckoutState['currentStep']>) => {
      state.currentStep = action.payload;
    },
    setCartItems: (state, action: PayloadAction<items[]>) => {
      state.items = action.payload;
    },
    resetCheckout: (state) => {
      Object.assign(state, initialState);
    },
    resetCartItems: (state) => {
      return initialState; 
    },
  },
});

export const { addProductInCart, removeProductInCart, incrementItem, decrementItem, setCartItems,
  setShippingInfo,
  setPaymentInfo,
  confirmOrder,
  goToStep,
  resetCartItems,
  resetCheckout } = ItemsIncartSlice.actions; // Export actions
export default ItemsIncartSlice.reducer; // Export the reducer

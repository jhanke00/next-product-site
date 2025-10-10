import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { items } from '../types/types'

export interface MySliceState {
  items: items[];
  isLoading: false,
  error: null  
}

const initialState: MySliceState = {
  items: [],
  isLoading: false,
  error: null
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Reducer to add a product
    addProduct: (state, action: PayloadAction<items>) => {
      const newItem = action.payload;
      const itemExists = state.items.find(item => item.id === newItem.id);
      if (itemExists) {
        return state;
      }
      state.items.push(newItem);
    },

    setResult: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearResult: (state) => {
      state.items = [];
      state.error = null;
    },
    
  },
});

export const { addProduct } = productsSlice.actions; // Export actions
export default productsSlice.reducer; // Export the reducer

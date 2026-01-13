import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import smallData from '@/src/mock/small/products.json';


interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  countInStock:number;
  numReviews:number;
  rating:number;
}

interface ProductsState {
  items: Product[];
}

const initialState: ProductsState = {
  items: smallData,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.items.push(action.payload);
    },
  },
});

export const { addProduct } = productsSlice.actions;
export default productsSlice.reducer;

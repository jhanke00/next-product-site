import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import  cartReducer from "./cartSlice"
import wishlistReducer from "./wishlistSlice"

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    wishlist: wishlistReducer
  },
});

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

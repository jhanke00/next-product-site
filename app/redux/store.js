import { configureStore } from '@reduxjs/toolkit';
import cartSlice from './features/cartSlice'; // Adjust the path as necessary
const store = configureStore({
  reducer: {
    cartItem: cartSlice,
  },
});

export default store;

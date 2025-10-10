import { configureStore, combineReducers  } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import ItemsIncartSlices from './slices/ItemsIncartSlices';
// import checkoutSlice from './slices/checkoutSlice';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  products: productsReducer,
  cartItem: ItemsIncartSlices,
//   checkout: checkoutSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  // blacklist: ['products'],
  // whitelist: ['cartItem']
  // Optionally, you can whitelist or blacklist specific reducers
  // whitelist: ['counter'], // Only persist the 'counter' slice
  // blacklist: ['someOtherSlice'], // Do not persist 'someOtherSlice'
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
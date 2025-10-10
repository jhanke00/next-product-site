'use client';
import React, { useState, useEffect} from 'react';
import HeaderComponent  from '../src/components/HeaderComponent/HeaderComponent';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import  ProductList  from '../src/components/ProductList/ProductList';

export default function Home() {
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HeaderComponent />
        <main>
          <ProductList />
        </main>
        </PersistGate>
    </Provider>
  );
}

'use client';
import React from 'react';
import HeaderComponent  from '../../src/components/HeaderComponent/HeaderComponent';
import { Provider } from 'react-redux';
import { store } from '../store';
import 'bootstrap/dist/css/bootstrap.min.css';
import CartShipping from '../../src/components/ShippingDetails/ShippingDetails';

export default function Home() {

  return (
    <Provider store={store}>
        <HeaderComponent />
        <main>
          <CartShipping />
        </main>
    </Provider>
  );
}

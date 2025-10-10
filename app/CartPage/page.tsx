'use client';
// import React, { useState, useEffect} from 'react';
import HeaderComponent  from '../../src/components/HeaderComponent/HeaderComponent';
import { Provider } from 'react-redux';
import { store } from '../store';
import 'bootstrap/dist/css/bootstrap.min.css';
import CartComponent from '../../src/components/CartComponent/CartComponent';

export default function Home() {
  return (
    <Provider store={store}>
        <HeaderComponent />
        <main>
          <CartComponent />
        </main>
    </Provider>
  );
}

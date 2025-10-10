'use client';
// import React, { useState, useEffect} from 'react';
import HeaderComponent  from '../../src/components/HeaderComponent/HeaderComponent';
import { Provider } from 'react-redux';
import { store } from '../store';
import 'bootstrap/dist/css/bootstrap.min.css';
import CartReview from '../../src/components/CartReview/CartReview';

export default function Home() {

  return (
    <Provider store={store}>
        <HeaderComponent />
        <main>
          <CartReview />
        </main>
    </Provider>
  );
}

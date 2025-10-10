'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import SendMail from '../../src/components/SendMail/SendMail';

export default function SuccessPage() {
    
    return <Provider store={store}>
        <SendMail />
    </Provider>;
}
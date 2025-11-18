'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckoutData, CheckoutContextType, ShippingInfo, BillingInfo, PaymentInfo } from '@/src/type/checkout';

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const initialCheckoutData: CheckoutData = {
  shipping: null,
  billing: null,
  payment: null,
  currentStep: 0,
};

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(initialCheckoutData);

  const updateShipping = (shipping: ShippingInfo) => {
    setCheckoutData((prev) => ({
      ...prev,
      shipping,
    }));
  };

  const updateBilling = (billing: BillingInfo) => {
    setCheckoutData((prev) => ({
      ...prev,
      billing,
    }));
  };

  const updatePayment = (payment: PaymentInfo) => {
    setCheckoutData((prev) => ({
      ...prev,
      payment,
    }));
  };

  const setCurrentStep = (step: number) => {
    setCheckoutData((prev) => ({
      ...prev,
      currentStep: step,
    }));
  };

  const resetCheckout = () => {
    setCheckoutData(initialCheckoutData);
  };

  const value: CheckoutContextType = {
    checkoutData,
    updateShipping,
    updateBilling,
    updatePayment,
    setCurrentStep,
    resetCheckout,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};

export const useCheckout = (): CheckoutContextType => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

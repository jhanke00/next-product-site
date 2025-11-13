'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import styles from '@/src/styles/checkout.module.css';

interface PaymentFormData {
  cardNumber: string;
  expiry: string;
  cvc: string;
  name: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function PaymentForm() {
  const router = useRouter();
  const { state } = useCart();
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const calculateTotal = (): number => {
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.18;
    const platformCharge = subtotal * 0.02;
    return subtotal + tax + platformCharge;
  };

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Card number must be at least 13 digits';
    }

    if (!formData.expiry) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const [month, year] = formData.expiry.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
      } else {
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        if (monthNum < 1 || monthNum > 12) {
          newErrors.expiry = 'Month must be between 01 and 12';
        }
      }
    }

    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required';
    } else if (formData.cvc.length < 3) {
      newErrors.cvc = 'CVC must be at least 3 digits';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear submit error
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const amount = calculateTotal();
      const cardNumber = formData.cardNumber.replace(/\s/g, '');

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardNumber, amount }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          setSubmitError('Card declined. Please use a different payment method.');
        } else {
          setSubmitError(data.error || 'Payment failed. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      if (data.success && data.paymentId) {
        // Validate required data before creating order
        if (!state.shipping) {
          setSubmitError('Please add products and fill shipping details before payment.');
          setIsLoading(false);
          return;
        }

        if (!state.items || state.items.length === 0) {
          setSubmitError('Your cart is empty. Please add items before checkout.');
          setIsLoading(false);
          return;
        }

        // Create order via API
        try {
          const orderPayload = {
            paymentId: data.paymentId,
            cart: { items: state.items },
            shipping: state.shipping,
          };

          console.log('Sending order data:', orderPayload);

          const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderPayload),
          });

          const orderResponseData = await orderResponse.json();

          if (!orderResponse.ok) {
            // Show the actual error message from the API
            const errorMessage = orderResponseData.error || 'Order creation failed. Please contact support.';
            console.error('Order creation error:', errorMessage, orderResponseData);
            setSubmitError(`Payment successful but order creation failed: ${errorMessage}`);
            setIsLoading(false);
            return;
          }

          // Success - redirect to confirmation
          if (orderResponseData.success && orderResponseData.orderId) {
            router.push(`/checkout/confirmation?orderId=${orderResponseData.orderId}`);
          } else {
            setSubmitError('Payment successful but order creation failed. Please contact support.');
            setIsLoading(false);
          }
        } catch (orderError) {
          console.error('Order creation exception:', orderError);
          setSubmitError('Payment successful but order creation failed. Please contact support.');
          setIsLoading(false);
        }
      } else {
        setSubmitError('Payment failed. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      setSubmitError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer} role='form' aria-label='Payment information form'>
      <div className={styles.formField}>
        <label htmlFor='cardNumber' className={styles.label}>
          Card Number{' '}
          <span className='text-red-500' aria-label='required'>
            *
          </span>
        </label>
        <input
          type='text'
          id='cardNumber'
          name='cardNumber'
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder='1234 5678 9012 3456'
          maxLength={19}
          className={styles.input}
          aria-invalid={errors.cardNumber ? 'true' : 'false'}
          aria-describedby={errors.cardNumber ? 'cardNumber-error' : undefined}
          aria-label='Card number'
        />
        {errors.cardNumber && (
          <p id='cardNumber-error' className={styles.errorMessage} role='alert'>
            {errors.cardNumber}
          </p>
        )}
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor='expiry' className={styles.label}>
            Expiry Date{' '}
            <span className='text-red-500' aria-label='required'>
              *
            </span>
          </label>
          <input
            type='text'
            id='expiry'
            name='expiry'
            value={formData.expiry}
            onChange={handleChange}
            placeholder='MM/YY'
            maxLength={5}
            className={styles.input}
            aria-invalid={errors.expiry ? 'true' : 'false'}
            aria-describedby={errors.expiry ? 'expiry-error' : undefined}
            aria-label='Card expiry date'
          />
          {errors.expiry && (
            <p id='expiry-error' className={styles.errorMessage} role='alert'>
              {errors.expiry}
            </p>
          )}
        </div>

        <div className={styles.formField}>
          <label htmlFor='cvc' className={styles.label}>
            CVC{' '}
            <span className='text-red-500' aria-label='required'>
              *
            </span>
          </label>
          <input
            type='text'
            id='cvc'
            name='cvc'
            value={formData.cvc}
            onChange={handleChange}
            placeholder='123'
            maxLength={4}
            className={styles.input}
            aria-invalid={errors.cvc ? 'true' : 'false'}
            aria-describedby={errors.cvc ? 'cvc-error' : undefined}
            aria-label='Card security code'
          />
          {errors.cvc && (
            <p id='cvc-error' className={styles.errorMessage} role='alert'>
              {errors.cvc}
            </p>
          )}
        </div>
      </div>

      <div className={styles.formField}>
        <label htmlFor='name' className={styles.label}>
          Cardholder Name{' '}
          <span className='text-red-500' aria-label='required'>
            *
          </span>
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={formData.name}
          onChange={handleChange}
          placeholder='Jeffrey Hanke'
          className={styles.input}
          aria-invalid={errors.name ? 'true' : 'false'}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-label='Cardholder name'
        />
        {errors.name && (
          <p id='name-error' className={styles.errorMessage} role='alert'>
            {errors.name}
          </p>
        )}
      </div>

      {submitError && (
        <div className={`${styles.alert} ${styles.alertError}`} role='alert' aria-live='polite'>
          <p className='text-sm'>{submitError}</p>
        </div>
      )}

      <div className='pt-4'>
        <button
          type='submit'
          disabled={isLoading}
          className={`${styles.button} ${styles.buttonPrimary}`}
          aria-label={isLoading ? 'Processing payment' : 'Complete payment'}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden='true'></span>
              <span>Processing...</span>
            </>
          ) : (
            'Complete Payment'
          )}
        </button>
      </div>
    </form>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/src/contexts/CheckoutContext';
import { PaymentInfo, ValidationErrors } from '@/src/type/checkout';
import { validatePaymentForm, formatCardNumber, formatExpiryDate } from '@/src/utils/validation';

export const PaymentForm: React.FC = () => {
  const { checkoutData, updatePayment, setCurrentStep } = useCheckout();
  const router = useRouter();

  const [formData, setFormData] = useState<PaymentInfo>(
    checkoutData.payment || {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
    }
  );

  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    }

    // Format expiry date as MM/YY
    if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    }

    // Limit CVV to 4 digits
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validatePaymentForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    updatePayment(formData);
    setCurrentStep(4);
    router.push('/checkout/confirmation');
  };

  const handleBack = () => {
    router.push('/checkout/billing');
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl mx-auto p-6'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Payment Information</h2>

      <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
        <p className='text-sm text-blue-800 dark:text-blue-200 mb-2'>
          <strong>Test Card Numbers:</strong>
        </p>
        <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
          <li>• Visa: 4532 1488 0343 6467</li>
          <li>• Mastercard: 5425 2334 3010 9903</li>
          <li>• Use any future expiry date and any 3-digit CVV</li>
        </ul>
      </div>

      <div className='mb-4'>
        <label htmlFor='cardNumber' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
          Card Number *
        </label>
        <input
          type='text'
          id='cardNumber'
          name='cardNumber'
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder='1234 5678 9012 3456'
          maxLength={19}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
            errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.cardNumber && <p className='text-red-500 text-sm mt-1'>{errors.cardNumber}</p>}
      </div>

      <div className='mb-4'>
        <label htmlFor='cardholderName' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
          Cardholder Name *
        </label>
        <input
          type='text'
          id='cardholderName'
          name='cardholderName'
          value={formData.cardholderName}
          onChange={handleChange}
          placeholder='John Doe'
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
            errors.cardholderName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.cardholderName && <p className='text-red-500 text-sm mt-1'>{errors.cardholderName}</p>}
      </div>

      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div>
          <label htmlFor='expiryDate' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Expiry Date *
          </label>
          <input
            type='text'
            id='expiryDate'
            name='expiryDate'
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder='MM/YY'
            maxLength={5}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
              errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.expiryDate && <p className='text-red-500 text-sm mt-1'>{errors.expiryDate}</p>}
        </div>

        <div>
          <label htmlFor='cvv' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            CVV *
          </label>
          <input
            type='text'
            id='cvv'
            name='cvv'
            value={formData.cvv}
            onChange={handleChange}
            placeholder='123'
            maxLength={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
              errors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.cvv && <p className='text-red-500 text-sm mt-1'>{errors.cvv}</p>}
        </div>
      </div>

      <div className='flex gap-4'>
        <button
          type='button'
          onClick={handleBack}
          className='flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
        >
          Back
        </button>
        <button
          type='submit'
          className='flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'
        >
          Review Order
        </button>
      </div>
    </form>
  );
};

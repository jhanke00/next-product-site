'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckout } from '@/src/contexts/CheckoutContext';
import { BillingInfo, ValidationErrors } from '@/src/type/checkout';
import { validateBillingForm } from '@/src/utils/validation';

export const BillingForm: React.FC = () => {
  const { checkoutData, updateBilling, setCurrentStep } = useCheckout();
  const router = useRouter();

  const [formData, setFormData] = useState<BillingInfo>(
    checkoutData.billing || {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      sameAsShipping: true,
    }
  );

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Auto-fill from shipping if sameAsShipping is true
  useEffect(() => {
    if (formData.sameAsShipping && checkoutData.shipping) {
      setFormData({
        firstName: checkoutData.shipping.firstName,
        lastName: checkoutData.shipping.lastName,
        address: checkoutData.shipping.address,
        city: checkoutData.shipping.city,
        state: checkoutData.shipping.state,
        zipCode: checkoutData.shipping.zipCode,
        country: checkoutData.shipping.country,
        sameAsShipping: true,
      });
    }
  }, [formData.sameAsShipping, checkoutData.shipping]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateBillingForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    updateBilling(formData);
    setCurrentStep(3);
    router.push('/checkout/payment');
  };

  const handleBack = () => {
    router.push('/checkout/shipping');
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-2xl mx-auto p-6'>
      <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>Billing Information</h2>

      <div className='mb-6'>
        <label className='flex items-center gap-2 cursor-pointer'>
          <input
            type='checkbox'
            name='sameAsShipping'
            checked={formData.sameAsShipping}
            onChange={handleChange}
            className='w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500'
          />
          <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>Same as shipping address</span>
        </label>
      </div>

      {!formData.sameAsShipping && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <div>
              <label htmlFor='firstName' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                First Name *
              </label>
              <input
                type='text'
                id='firstName'
                name='firstName'
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.firstName && <p className='text-red-500 text-sm mt-1'>{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor='lastName' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Last Name *
              </label>
              <input
                type='text'
                id='lastName'
                name='lastName'
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.lastName && <p className='text-red-500 text-sm mt-1'>{errors.lastName}</p>}
            </div>
          </div>

          <div className='mb-4'>
            <label htmlFor='address' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Address *
            </label>
            <input
              type='text'
              id='address'
              name='address'
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                errors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.address && <p className='text-red-500 text-sm mt-1'>{errors.address}</p>}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div>
              <label htmlFor='city' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                City *
              </label>
              <input
                type='text'
                id='city'
                name='city'
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                  errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.city && <p className='text-red-500 text-sm mt-1'>{errors.city}</p>}
            </div>

            <div>
              <label htmlFor='state' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                State *
              </label>
              <input
                type='text'
                id='state'
                name='state'
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                  errors.state ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.state && <p className='text-red-500 text-sm mt-1'>{errors.state}</p>}
            </div>

            <div>
              <label htmlFor='zipCode' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                Zip Code *
              </label>
              <input
                type='text'
                id='zipCode'
                name='zipCode'
                value={formData.zipCode}
                onChange={handleChange}
                placeholder='12345'
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                  errors.zipCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.zipCode && <p className='text-red-500 text-sm mt-1'>{errors.zipCode}</p>}
            </div>
          </div>

          <div className='mb-6'>
            <label htmlFor='country' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Country *
            </label>
            <select
              id='country'
              name='country'
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${
                errors.country ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              <option value='United States'>United States</option>
              <option value='Canada'>Canada</option>
              <option value='United Kingdom'>United Kingdom</option>
              <option value='Australia'>Australia</option>
            </select>
            {errors.country && <p className='text-red-500 text-sm mt-1'>{errors.country}</p>}
          </div>
        </>
      )}

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
          Continue to Payment
        </button>
      </div>
    </form>
  );
};

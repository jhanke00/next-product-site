'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import styles from '@/src/styles/checkout.module.css';

interface ShippingFormData {
  fullName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ShippingForm() {
  const router = useRouter();
  const { setShipping } = useCart();

  const [formData, setFormData] = useState<ShippingFormData>({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Phone is optional
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.address1.trim()) {
      newErrors.address1 = 'Address line 1 is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Optional but validated fields
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setShipping(formData);
      router.push('/checkout/payment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer} role='form' aria-label='Shipping information form'>
      <div className={styles.formField}>
        <label htmlFor='fullName' className={styles.label}>
          Full Name{' '}
          <span className='text-red-500' aria-label='required'>
            *
          </span>
        </label>
        <input
          type='text'
          id='fullName'
          name='fullName'
          value={formData.fullName}
          onChange={handleChange}
          className={styles.input}
          aria-invalid={errors.fullName ? 'true' : 'false'}
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
        />
        {errors.fullName && (
          <p id='fullName-error' className={styles.errorMessage} role='alert'>
            {errors.fullName}
          </p>
        )}
      </div>

      <div className={styles.formField}>
        <label htmlFor='address1' className={styles.label}>
          Address Line 1{' '}
          <span className='text-red-500' aria-label='required'>
            *
          </span>
        </label>
        <input
          type='text'
          id='address1'
          name='address1'
          value={formData.address1}
          onChange={handleChange}
          className={styles.input}
          aria-invalid={errors.address1 ? 'true' : 'false'}
          aria-describedby={errors.address1 ? 'address1-error' : undefined}
        />
        {errors.address1 && (
          <p id='address1-error' className={styles.errorMessage} role='alert'>
            {errors.address1}
          </p>
        )}
      </div>

      <div className={styles.formField}>
        <label htmlFor='address2' className={styles.label}>
          Address Line 2
        </label>
        <input
          type='text'
          id='address2'
          name='address2'
          value={formData.address2}
          onChange={handleChange}
          className={styles.input}
          aria-invalid='false'
        />
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor='city' className={styles.label}>
            City{' '}
            <span className='text-red-500' aria-label='required'>
              *
            </span>
          </label>
          <input
            type='text'
            id='city'
            name='city'
            value={formData.city}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={errors.city ? 'true' : 'false'}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && (
            <p id='city-error' className={styles.errorMessage} role='alert'>
              {errors.city}
            </p>
          )}
        </div>

        <div className={styles.formField}>
          <label htmlFor='state' className={styles.label}>
            State/Province
          </label>
          <input
            type='text'
            id='state'
            name='state'
            value={formData.state}
            onChange={handleChange}
            className={styles.input}
            aria-invalid='false'
          />
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor='postalCode' className={styles.label}>
            Postal Code{' '}
            <span className='text-red-500' aria-label='required'>
              *
            </span>
          </label>
          <input
            type='text'
            id='postalCode'
            name='postalCode'
            value={formData.postalCode}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={errors.postalCode ? 'true' : 'false'}
            aria-describedby={errors.postalCode ? 'postalCode-error' : undefined}
          />
          {errors.postalCode && (
            <p id='postalCode-error' className={styles.errorMessage} role='alert'>
              {errors.postalCode}
            </p>
          )}
        </div>

        <div className={styles.formField}>
          <label htmlFor='country' className={styles.label}>
            Country{' '}
            <span className='text-red-500' aria-label='required'>
              *
            </span>
          </label>
          <input
            type='text'
            id='country'
            name='country'
            value={formData.country}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={errors.country ? 'true' : 'false'}
            aria-describedby={errors.country ? 'country-error' : undefined}
          />
          {errors.country && (
            <p id='country-error' className={styles.errorMessage} role='alert'>
              {errors.country}
            </p>
          )}
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <label htmlFor='phone' className={styles.label}>
            Phone
          </label>
          <input
            type='tel'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={errors.phone ? 'true' : 'false'}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id='phone-error' className={styles.errorMessage} role='alert'>
              {errors.phone}
            </p>
          )}
        </div>

        <div className={styles.formField}>
          <label htmlFor='email' className={styles.label}>
            Email{' '}
            <span className='text-red-500' aria-label='required'>
              *
            </span>
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id='email-error' className={styles.errorMessage} role='alert'>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className='pt-4'>
        <button
          type='submit'
          className={`${styles.button} ${styles.buttonPrimary}`}
          aria-label='Continue to payment step'
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}

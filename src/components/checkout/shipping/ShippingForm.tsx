import React, { useState } from 'react';
import styles from './ShippingForm.module.css';
import BillingForm from './BillingForm';

import { ShippingFormProps } from '../../../type/checkout/index';

export default function ShippingForm({ onNext, onBack, initialData }: ShippingFormProps) {
  const [form, setForm] = useState(
    initialData?.shipping || {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    }
  );
  const [useForBilling, setUseForBilling] = useState(true);
  const [billingForm, setBillingForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingForm({ ...billingForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.address || !form.city || !form.postalCode || !form.country) {
      setError('Please fill in all shipping fields.');
      return;
    }
    if (!useForBilling) {
      if (
        !billingForm.firstName ||
        !billingForm.lastName ||
        !billingForm.address ||
        !billingForm.city ||
        !billingForm.postalCode ||
        !billingForm.country
      ) {
        setError('Please fill in all billing fields.');
        return;
      }
    }
    setError('');
    onNext({
      shipping: form,
      billing: useForBilling ? form : billingForm,
    });
  };

  const showBoth = !useForBilling;
  const formClass = `${styles.formContainer} ${showBoth ? styles.double : styles.single}`;

  return (
    <>
      <form className={formClass} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>Shipping Information</h2>

        <div className={styles.flexRow}>
          <div className={styles.flexCol}>
            <h3 className={styles.formSubtitle}>Shipping Address</h3>
            <input
              className={styles.inputField}
              name='firstName'
              placeholder='First Name'
              value={form.firstName}
              onChange={handleChange}
            />
            <input
              className={styles.inputField}
              name='lastName'
              placeholder='Last Name'
              value={form.lastName}
              onChange={handleChange}
            />
            <input
              className={styles.inputField}
              name='address'
              placeholder='Address'
              value={form.address}
              onChange={handleChange}
            />
            <input
              className={styles.inputField}
              name='city'
              placeholder='City'
              value={form.city}
              onChange={handleChange}
            />
            <input
              className={styles.inputField}
              name='postalCode'
              placeholder='Postal Code'
              value={form.postalCode}
              onChange={handleChange}
            />
            <input
              className={styles.inputField}
              name='country'
              placeholder='Country'
              value={form.country}
              onChange={handleChange}
            />
            <label style={{ margin: '1rem 0' }}>
              <input type='checkbox' checked={useForBilling} onChange={() => setUseForBilling((v) => !v)} /> Use
              shipping address as billing address
            </label>
            {error && <div className={styles.errorMsg}>{error}</div>}
          </div>
          {showBoth && (
            <>
              <div
                style={{
                  borderLeft: '2px solid rgba(0,0,0,0.08)',
                  margin: '0 2rem',
                  minHeight: '100%',
                }}
              />
              <div className={styles.flexCol}>
                <h3 className={styles.formSubtitle}>Billing Address</h3>
                <BillingForm form={billingForm} onChange={handleBillingChange} />
              </div>
            </>
          )}
        </div>
        <div className={styles.buttonRow}>
          <button type='button' className={styles.nextBtn} style={{ marginRight: '1rem' }} onClick={onBack}>
            Back to Cart
          </button>
          <button className={styles.nextBtn} type='submit'>
            Next
          </button>
        </div>
      </form>
    </>
  );
}

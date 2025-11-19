import React from 'react';
import styles from '../shipping/ShippingForm.module.css';
import { BillingFormProps } from '../../../type/checkout/index';

export default function BillingForm({ form, onChange }: BillingFormProps) {
  return (
    <div className={styles.flexCol}>
      <input
        className={styles.inputField}
        name='firstName'
        placeholder='First Name'
        value={form.firstName}
        onChange={onChange}
      />
      <input
        className={styles.inputField}
        name='lastName'
        placeholder='Last Name'
        value={form.lastName}
        onChange={onChange}
      />
      <input
        className={styles.inputField}
        name='address'
        placeholder='Address'
        value={form.address}
        onChange={onChange}
      />
      <input className={styles.inputField} name='city' placeholder='City' value={form.city} onChange={onChange} />
      <input
        className={styles.inputField}
        name='postalCode'
        placeholder='Postal Code'
        value={form.postalCode}
        onChange={onChange}
      />
      <input
        className={styles.inputField}
        name='country'
        placeholder='Country'
        value={form.country}
        onChange={onChange}
      />
    </div>
  );
}

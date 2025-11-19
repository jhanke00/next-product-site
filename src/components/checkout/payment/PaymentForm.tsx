import React, { useState, useEffect } from 'react';
import styles from '../shipping/ShippingForm.module.css';
import { PaymentFormProps } from '../../../type/checkout/index';

function isValidCardNumber(cardNumber: string) {
  const sanitized = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return (sanitized.length === 16 || sanitized.length === 15) && sum % 10 === 0;
}

function isValidExpiry(expiry: string) {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
  const [mm, yy] = expiry.split('/').map(Number);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (yy < currentYear || (yy === currentYear && mm < currentMonth)) return false;
  return true;
}

export default function PaymentForm({ onNext, onBack, initialData }: PaymentFormProps) {
  const [method, setMethod] = useState('card');
  const [form, setForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    upiId: '',
  });
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setMethod(initialData.method || 'card');
      setForm(
        initialData.form || {
          cardName: '',
          cardNumber: '',
          expiry: '',
          cvc: '',
          upiId: '',
        }
      );
    }
  }, [initialData]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16); // allow up to 16
    setForm({ ...form, cardNumber: value });
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setForm({ ...form, cvc: value });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
    setForm({ ...form, expiry: value });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (method === 'card') {
      if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvc) {
        setError('Please fill in all card fields.');
        return;
      }
      if (!isValidCardNumber(form.cardNumber)) {
        setError('Invalid credit card number.');
        return;
      }
      if (!isValidExpiry(form.expiry)) {
        setError('Invalid expiry date.');
        return;
      }
      if (!/^\d{3}$/.test(form.cvc)) {
        setError('CVV must be 3 digits.');
        return;
      }
    } else if (method === 'upi') {
      if (!form.upiId) {
        setError('Please enter your UPI ID.');
        return;
      }
    }
    setError('');
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      onNext({ method, form, paymentStatus: 'mock_success' });
    }, 1500);
  };

  return (
    <form className={styles.paymentformContainer} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Payment Information</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type='radio'
            name='method'
            value='card'
            checked={method === 'card'}
            onChange={() => setMethod('card')}
            disabled={processing}
          />{' '}
          Credit/Debit Card
        </label>
        <label style={{ marginLeft: '2rem' }}>
          <input
            type='radio'
            name='method'
            value='upi'
            checked={method === 'upi'}
            onChange={() => setMethod('upi')}
            disabled={processing}
          />{' '}
          UPI
        </label>
      </div>

      {method === 'card' && (
        <>
          <input
            className={styles.inputField}
            name='cardName'
            placeholder='Name on Card'
            value={form.cardName}
            onChange={handleChange}
            disabled={processing}
          />
          <input
            className={styles.inputField}
            name='cardNumber'
            placeholder='Card Number'
            value={form.cardNumber}
            onChange={handleCardNumberChange}
            disabled={processing}
          />
          <input
            className={styles.inputField}
            name='expiry'
            placeholder='MM/YY'
            value={form.expiry}
            onChange={handleExpiryChange}
            maxLength={5}
            disabled={processing}
          />
          <input
            className={styles.inputField}
            name='cvc'
            placeholder='CVV'
            value={form.cvc}
            onChange={handleCvcChange}
            maxLength={3}
            disabled={processing}
          />
        </>
      )}

      {method === 'upi' && (
        <input
          className={styles.inputField}
          name='upiId'
          placeholder='Enter your UPI ID'
          value={form.upiId}
          onChange={handleChange}
          disabled={processing}
        />
      )}
      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.buttonRow}>
        <button
          type='button'
          className={styles.nextBtn}
          style={{ background: '#888', marginRight: '1rem' }}
          onClick={onBack}
          disabled={processing}
        >
          Back
        </button>
        <button className={styles.nextBtn} type='submit' disabled={processing}>
          {processing ? 'Processing...' : 'Next'}
        </button>
      </div>
    </form>
  );
}

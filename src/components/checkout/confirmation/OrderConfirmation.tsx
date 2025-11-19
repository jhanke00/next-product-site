import React, { useEffect, useState } from 'react';
import styles from './orderConfirmation.module.css';
import { OrderConfirmationProps, CheckoutState } from '../../../type/checkout/index';
const STORAGE_KEY = 'checkout_state';

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ onBack }) => {
  const [checkout, setCheckout] = useState<CheckoutState>({
    shipping: null,
    payment: null,
    cart: null,
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCheckout(JSON.parse(stored));
    }
  }, []);

  const subtotal = checkout.cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0;

  const handleSubmitOrder = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const payload = {
        shipping: checkout.shipping,
        payment: checkout.payment,
        cart: checkout.cart,
        subtotal,
      };
      await fetch('/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await new Promise((resolve) => setTimeout(resolve, 1200)); // simulate delay
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('cart');
      setCheckout({
        shipping: null,
        payment: null,
        cart: null,
      });
      setOrderPlaced(true);
    } catch (err) {
      setApiError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className={styles.confirmationContainer}>
        <h1 className={styles.headtitle}>Thank you for shopping with us!!</h1>
        <div className={styles.sectionContent1}>
          <div>Your order is placed successfully.</div>
          <div style={{ marginTop: 8 }}>
            Want to shop more?{' '}
            <a href='/products' style={{ textDecoration: 'underline' }}>
              Browse our products
            </a>
            !
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.confirmationContainer}>
      <h1 className={styles.headtitle}>Order Review</h1>

      <div className={styles.section}>
        <div className={styles.sectionTitle1}>Profile Info</div>
        <div className={styles.sectionContent}>
          <div>
            <strong>Name:</strong>sushma
          </div>
          <div>
            <strong>Mobile:</strong> +91 9876543210
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle1}>Address Information</div>
        <div className={styles.sectionContent}>
          {checkout.shipping ? (
            <>
              <div>{checkout.shipping.shipping.address}</div>
              <div>{checkout.shipping.shipping.city}</div>
              <div>
                {checkout.shipping.shipping.postalCode}, {checkout.shipping.shipping.country}
              </div>
            </>
          ) : (
            <div>No address found.</div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle1}>Payment Details</div>
        <div className={styles.sectionContent}>
          {checkout.payment ? (
            <>
              {checkout.payment.method === 'card' ? (
                <>
                  <div>
                    <strong>Credit/Debit:</strong>
                  </div>
                  <div>{checkout.payment.form?.cardName || 'No card name'}</div>
                  <div>
                    **** **** ****{' '}
                    {checkout.payment.form?.cardNumber ? checkout.payment.form.cardNumber.slice(-4) : '----'}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>UPI:</strong>
                  </div>
                  <div>{checkout.payment.form?.upiId || 'No UPI ID'}</div>
                </>
              )}
            </>
          ) : (
            <div>No payment details found.</div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle1}>Order Details</div>
        <div className={styles.sectionContent}>
          {checkout.cart?.items?.length ? (
            <ul className={styles.orderList}>
              {checkout.cart.items.map((item) => (
                <li key={item.id} className={styles.orderItem}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>x{item.quantity}</span>
                  <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div>No items in cart.</div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle1}>Summary</div>
        <div className={styles.sectionContent}>
          <div className={styles.subtotalRow}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {apiError && <div style={{ color: 'red', marginBottom: 8 }}>{apiError}</div>}
          <div className={styles.buttonRow}>
            <button className={styles.submitBtn} onClick={onBack} type='button' disabled={loading}>
              Back
            </button>
            <button className={styles.submitBtn} onClick={handleSubmitOrder} type='button' disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

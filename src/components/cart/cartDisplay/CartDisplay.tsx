import React from 'react';
import CartItem from '../cartItem/CartItem';
import styles from './CartDisplay.module.css';
import { useRouter } from 'next/navigation';
import { CartDisplayProps } from '../../../type/cart/index';

const CartDisplay: React.FC<CartDisplayProps> = ({ items, onRemove, onQuantityChange, onCheckout }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const router = useRouter();
  return (
    <div className={styles.cartContainer}>
      <h2 className={styles.cartTitle}>My Cart</h2>
      {items.length === 0 ? (
        <>
          <p className={styles.emptyText}>Your cart is empty.</p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1.5rem',
            }}
          >
            <button
              className={styles.checkoutBtn}
              style={{ background: '#1778b4ff', width: '20%' }}
              onClick={() => router.push('/products')}
            >
              Back to Shopping
            </button>
          </div>
        </>
      ) : (
        <>
          {items.map((item) => (
            <CartItem key={item.id} {...item} onRemove={onRemove} onQuantityChange={onQuantityChange} />
          ))}
          <div className={styles.subtotalRow}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              marginTop: '1.5rem',
            }}
          >
            <button
              className={styles.checkoutBtn}
              style={{ background: '#888', width: '20%' }}
              onClick={() => router.push('/products')}
            >
              Back to Shopping
            </button>
            <button className={styles.checkoutBtn} style={{ width: '20%' }} onClick={onCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDisplay;

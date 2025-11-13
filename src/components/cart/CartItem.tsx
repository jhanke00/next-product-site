'use client';

import React from 'react';
import { CartItem as CartItemType } from '@/src/context/CartContext';
import styles from '@/src/styles/checkout.module.css';

interface CartItemProps {
  item: CartItemType;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function CartItem({ item, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const subtotal = item.price * item.qty;

  return (
    <div className={styles.cartItem} role='listitem'>
      <div className={styles.cartItemContent}>
        <h3 className='text-lg font-semibold'>{item.name}</h3>
        <p className='text-sm text-gray-600'>Unit Price: ₹{item.price.toFixed(2)}</p>
        <p className='text-sm text-gray-600'>Quantity: {item.qty}</p>
        <p className='text-base font-medium mt-2'>Subtotal: ₹{subtotal.toFixed(2)}</p>
      </div>
      <div className={styles.cartItemActions} role='group' aria-label='Cart item actions'>
        <button
          onClick={onDecrease}
          className={styles.quantityButton}
          aria-label={`Decrease quantity of ${item.name}`}
          type='button'
        >
          -
        </button>
        <button
          onClick={onIncrease}
          className={styles.quantityButton}
          aria-label={`Increase quantity of ${item.name}`}
          type='button'
        >
          +
        </button>
        <button
          onClick={onRemove}
          className={`${styles.button} ${styles.buttonDanger}`}
          aria-label={`Remove ${item.name} from cart`}
          type='button'
        >
          Remove
        </button>
      </div>
    </div>
  );
}

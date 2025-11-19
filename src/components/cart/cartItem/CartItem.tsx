import React from 'react';
import styles from './CartItem.module.css';
import { CartItemProps } from '../../../type/cart/index';

const CartItem: React.FC<CartItemProps> = ({ id, name, price, quantity, onRemove, onQuantityChange }) => (
  <div className={styles.cartItem}>
    <div className={styles.itemInfo}>
      <span className={styles.itemName}>{name}</span>
      <span className={styles.itemPrice}>${price?.toFixed(2)}</span>
    </div>
    <div className={styles.quantityControls}>
      <button className={styles.qtyBtn} onClick={() => onQuantityChange(id, quantity - 1)} disabled={quantity <= 1}>
        -
      </button>
      <span>{quantity}</span>
      <button className={styles.qtyBtn} onClick={() => onQuantityChange(id, quantity + 1)}>
        +
      </button>
    </div>
    <button className={styles.removeBtn} onClick={() => onRemove(id)}>
      Remove
    </button>
  </div>
);

export default CartItem;

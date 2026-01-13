'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { removeFromCart, clearCart, updateQuantity } from '../../store/cartSlice';
import styles from './page.module.css';
import Link from 'next/link';

export default function CartPage() {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch<AppDispatch>();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const increment = (id: string, currentQty: number) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const decrement = (id: string, currentQty: number) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Your Cart</h1>

      <div className={styles.tableHeader}>
        <span>Item</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Action</span>
      </div>

      {cartItems.map((item) => (
        <div key={item.id} className={styles.row}>
          <span className={styles.name}>{item.name}</span>
          <span>${item.price}</span>
          <span className={styles.quantityt}>
            <div className={styles.qtyContainer}>
              <button className={styles.qtyBtn} onClick={() => decrement(item.id, item.quantity)}>
                -
              </button>

              <input type='number' value={item.quantity} min={1} readOnly className={styles.qtyInput} />

              <button className={styles.qtyBtn} onClick={() => increment(item.id, item.quantity)}>
                +
              </button>
            </div>
          </span>

          <button className={styles.removeBtn} onClick={() => dispatch(removeFromCart(item.id))}>
            Remove
          </button>
        </div>
      ))}

      <div className={styles.totalSection}>
        <strong>Total:</strong>
        <span>${total}</span>
      </div>

      <button className={styles.clearBtn} onClick={() => dispatch(clearCart())}>
        Clear Cart
      </button>
      <Link href='/checkout' className={styles.checkoutbtn}>
        Checkout Products
      </Link>
    </div>
  );
}

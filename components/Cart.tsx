import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { state, dispatch } = useCart();

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  };

  if (state.items.length === 0) {
    return <div>Your cart is empty.</div>;
  }

  return (
    <div>
      <h2>Shopping Cart</h2>
      <ul>
        {state.items.map((item) => (
          <li key={item.id} style={{ marginBottom: 16 }}>
            <div>
              <strong>{item.name}</strong> - ${item.price} x {item.quantity}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', justifyContent: 'center' }}>
              <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
              <input
                type='number'
                value={item.quantity}
                min={1}
                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                style={{ width: '60px', textAlign: 'center', color: 'black' }}
              />
              <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => handleRemove(item.id)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <strong>Total: ${state.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</strong>
      </div>
      <div style={{ marginTop: 24 }}>
        <Link href='/checkout/'>Go to Checkout</Link>
      </div>
    </div>
  );
};

export default Cart;

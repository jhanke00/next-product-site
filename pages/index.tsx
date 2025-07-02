import React from 'react';
import { CartItem, useCart } from '../context/CartContext';
import Link from 'next/link';

const products = [
  { id: '1', name: 'Product A', price: 19.99 },
  { id: '2', name: 'Product B', price: 29.99 },
  { id: '3', name: 'Product C', price: 39.99 },
];

export default function HomePage() {
  const { state, dispatch } = useCart();

  const addToCart = (product: CartItem) => {
    dispatch({
      type: 'ADD_ITEM',
      item: { ...product, quantity: 1 },
    });
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ margin: 0 }}>Products</h1>
        <Link href='/cart' style={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
          Go to Cart&nbsp;
          <span
            style={{
              background: '#635bff',
              color: '#fff',
              borderRadius: '50%',
              width: 22,
              height: 22,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            {state.items.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </Link>
      </div>
      <ul>
        {products.map((product) => {
          const cartItem = state.items.find((item) => item.id === product.id);
          return (
            <li key={product.id} style={{ marginBottom: 16 }}>
              <div>
                <strong>{product.name}</strong> - ${product.price}
              </div>
              {cartItem ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => {
                      if (cartItem.quantity <= 1) {
                        dispatch({
                          type: 'REMOVE_ITEM',
                          id: cartItem.id,
                        });
                      } else {
                        dispatch({
                          type: 'UPDATE_QUANTITY',
                          id: cartItem.id,
                          quantity: cartItem.quantity - 1,
                        });
                      }
                    }}
                    style={{ width: 28 }}
                  >
                    -
                  </button>
                  <span>{cartItem.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'ADD_ITEM',
                        item: { ...product, quantity: 1 },
                      })
                    }
                    style={{ width: 28 }}
                  >
                    +
                  </button>
                </div>
              ) : (
                <button onClick={() => addToCart({ ...product, quantity: 1 })}>Add to Cart</button>
              )}
            </li>
          );
        })}
      </ul>
      <div style={{ marginTop: 16, fontWeight: 600 }}>
        Total: ${state.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
      </div>
    </div>
  );
}

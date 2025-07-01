'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, updateItem } from '../redux/features/cartSlice';

interface ProductItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string; // Ensure category is included in the interface
}

const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const stateData = useSelector((state: { cartItem: { items: ProductItem[] } }) => state.cartItem.items);
  const [cartItems, setCartItems] = useState<ProductItem[]>([]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    } else if (stateData.length > 0) {
      setCartItems(stateData); // fallback to Redux
    }
  }, []);

  useEffect(() => {
    if (stateData.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(stateData));
      setCartItems(stateData);
    }
  }, [stateData]);

  const increaseQuantity = (id: number) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)));
    dispatch(updateItem(cartItems));
  };

  const decreaseQuantity = (id: number) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item)));
    dispatch(updateItem(cartItems));
  };
  const deleteItem = (id: number) => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      const updatedCartItems = JSON.parse(storedCartItems).filter((item: ProductItem) => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      setCartItems(updatedCartItems);
    }
    dispatch(removeItem(id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem('cartItems', JSON.stringify([]));
  };
  const subtotal = cartItems.length > 0 ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) : 0.0;
  const discount = cartItems.length > 0 ? 10 : 0.0; // Define your discount logic here

  const total = cartItems.length > 0 ? subtotal - discount : 0.0;

  const handleCheckout = async () => {
    router.push('/shippingAddress');
  };

  return (
    <div className='w-full h-full p-5 bg-white rounded-lg shadow-lg m-6 flex flex-col items-center'>
      <button
        onClick={() => router.push('/products')}
        className='mb-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center'
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-5 w-5 mr-2'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
        Back to Products
      </button>

      <h1 className='text-3xl md:text-5xl font-bold text-center mb-6 text-black'>Your Shopping Cart</h1>
      <div className='grid gap-4 w-full max-w-2xl'>
        {cartItems?.map((item) => (
          <div
            key={item.id}
            className='flex flex-col md:flex-row justify-between items-center p-4 border border-gray-300 rounded-lg shadow-lg bg-gray-100 transition-all duration-200 hover:shadow-xl'
          >
            <div className='flex-1'>
              <h2 className='text-lg md:text-xl font-semibold text-black'>{item.name}</h2>
              <p className='text-md text-gray-600 mt-1'>
                ${item.price} × {item.quantity} ={' '}
                <span className='font-bold text-black'>${item.price * item.quantity}</span>
              </p>
              <p className='text-sm text-gray-500 mt-1'>Category: {item.category}</p>
            </div>

            <div className='flex items-center space-x-2 mt-2 md:mt-0'>
              <button
                onClick={() => decreaseQuantity(item.id)}
                className='bg-gray-200 text-black rounded-full px-3 py-1 hover:bg-gray-300 transition'
              >
                <span>-</span>
              </button>
              <span className='px-2 font-medium'>{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className='bg-gray-200 text-black rounded-full px-3 py-1 hover:bg-gray-300 transition'
              >
                <span>+</span>
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                aria-label='Delete item'
                className='ml-4 text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-full transition'
              >
                <span>&times;</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className='text-lg md:text-xl font-semibold' style={{ color: 'black' }}>
        Subtotal: <span style={{ color: 'gray' }}>${subtotal.toFixed(2)} </span>
      </h2>
      <h2 className='text-lg md:text-xl font-semibold' style={{ color: 'black' }}>
        Discount: <span style={{ color: 'red' }}>-${discount.toFixed(2)}</span>
      </h2>
      <h2 className='text-lg md:text-xl font-bold' style={{ color: 'black' }}>
        Total: <span style={{ color: 'green' }}>${total.toFixed(2)} </span>
      </h2>

      <div className='flex flex-row md:flex-row justify-between mt-8 '>
        <button
          onClick={clearCart}
          className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 mb-4 md:mb-0'
        >
          Clear Cart
        </button>
        <button
          onClick={handleCheckout}
          className='ml-0 md:ml-6  bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200'
          style={{ padding: '5px' }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;

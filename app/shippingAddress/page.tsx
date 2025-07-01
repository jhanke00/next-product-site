'use client';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ProductItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string; // Ensure category is included in the interface
}
const ShippingAddressForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<ProductItem[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Step 1: Load from localStorage on mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name || !formData.address || !formData.city || !formData.zip) {
      alert('Please fill in all fields');
      return;
    }
    // Submit form data (you can replace this with your submission logic)
    console.log('Form submitted:', formData);
    localStorage.setItem('shippingAddress', JSON.stringify(formData));

    setLoading(true);
    const stripe = await stripePromise;

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems }),
    });

    const data = await res.json();

    if (data.id) {
      stripe?.redirectToCheckout({ sessionId: data.id });
    } else {
      alert('Failed to initiate checkout');
    }
    setLoading(false);
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-black p-4'>
      <form className='bg-gray-100 p-6 rounded-lg shadow-md w-full max-w-md' onSubmit={handleSubmit}>
        <h2 className='text-2xl font-bold mb-4 text-center' style={{ color: 'black' }}>
          Shipping Address
        </h2>
        <div className='mb-4'>
          <label className='block text-gray-700' htmlFor='name'>
            Full Name
          </label>
          <input
            type='text'
            id='name'
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            placeholder='John Doe'
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700' htmlFor='address'>
            Address
          </label>
          <input
            type='text'
            id='address'
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            placeholder='123 Main St'
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700' htmlFor='city'>
            City
          </label>
          <input
            type='text'
            id='city'
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            placeholder='City'
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700' htmlFor='zip'>
            Zip Code
          </label>
          <input
            type='text'
            id='zip'
            className='mt-1 p-2 w-full border border-gray-300 rounded'
            placeholder='Zip Code'
            value={formData.zip}
            onChange={handleChange}
            required
          />
        </div>
        <button disabled={loading} type='submit' className='w-full bg-black text-white p-2 rounded hover:bg-gray-800'>
          {loading ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </form>
    </div>
  );
};

export default ShippingAddressForm;

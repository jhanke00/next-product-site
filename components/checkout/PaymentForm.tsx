'use client';

import { FormEvent, useState, useContext } from 'react';
import { CartContext } from '../../context/CartContext';

type ContactAddress = {
  id?: string;
  name: string;
  address: string;
  email: string;
};

type Props = {
  shippingAddress: ContactAddress | null;
  onSuccess: () => void;
};

export default function PaymentForm({ shippingAddress, onSuccess }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cartContext = useContext(CartContext);

  if (!cartContext || !shippingAddress) return null;

  const { cart, setCurrentOrder, clearCart } = cartContext;
  const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (billingName.trim().length === 0 || billingAddress.trim().length === 0 || billingEmail.trim().length === 0) {
      setError('Please enter billing address information.');
      return;
    }

    if (cardNumber.length < 12 || expiry.length < 4 || cvc.length < 3) {
      setError('Please enter valid card information.');
      return;
    }

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const orderDetails = {
        items: cart,
        totalPrice,
        totalItems,
        shippingAddress,
        billingAddress: {
          name: billingName,
          address: billingAddress,
          email: billingEmail,
        },
        createdAt: new Date().toISOString(),
      };

      setCurrentOrder(orderDetails);
      clearCart();
      onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Unable to complete payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-8 shadow-sm'
    >
      <h2 className='text-2xl font-semibold mb-4'>Payment Details</h2>
      <p className='text-sm text-gray-600 mb-6'>
        This is a mock payment. No card details are stored; this only simulates a payment flow.
      </p>

      <div className='space-y-4 rounded-3xl border border-gray-200 bg-gray-50 p-5 mb-6'>
        <p className='text-sm font-semibold text-gray-900'>Billing address</p>

        <label className='block text-sm font-medium text-gray-700'>
          Full name
          <input
            type='text'
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
            placeholder='Jane Doe'
            className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          />
        </label>

        <label className='block text-sm font-medium text-gray-700'>
          Address
          <input
            type='text'
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            placeholder='123 Billing St, City, State'
            className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          />
        </label>

        <label className='block text-sm font-medium text-gray-700'>
          Email
          <input
            type='email'
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            placeholder='billing@example.com'
            className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          />
        </label>
      </div>

      <label className='block mb-4 text-sm font-medium text-gray-700'>
        Card number
        <input
          type='text'
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder='4242 4242 4242 4242'
          className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        />
      </label>

      <div className='grid gap-4 sm:grid-cols-2'>
        <label className='block text-sm font-medium text-gray-700'>
          Expiry date
          <input
            type='text'
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            placeholder='MM/YY'
            className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          />
        </label>
        <label className='block text-sm font-medium text-gray-700'>
          CVC
          <input
            type='text'
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            placeholder='123'
            className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          />
        </label>
      </div>

      {error && <p className='mt-4 text-sm text-red-600'>{error}</p>}

      <button
        type='submit'
        disabled={isProcessing}
        className='mt-6 w-full rounded-2xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400'
      >
        {isProcessing ? 'Processing payment...' : 'Pay Now'}
      </button>
    </form>
  );
}

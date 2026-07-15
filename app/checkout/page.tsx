'use client';

import { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CartContext } from '@/context/CartContext';
import PaymentForm from '@/components/checkout/PaymentForm';
import ShippingForm from '@/components/checkout/ShippingForm';

type ShippingAddress = {
  id: string;
  name: string;
  email: string;
  address: string;
};

export default function Checkout() {
  const cartContext = useContext(CartContext);
  const router = useRouter();

  if (!cartContext) return <p>Loading...</p>;

  const { cart, addresses, addAddress } = cartContext;
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const selectedAddress = useMemo(
    () => addresses.find((address: ShippingAddress) => address.id === selectedAddressId) || null,
    [addresses, selectedAddressId]
  );

  const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const handleAddressSaved = (address: Omit<ShippingAddress, 'id'>) => {
    const newAddress = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      ...address,
    };
    addAddress(newAddress);
    setSelectedAddressId(newAddress.id);
    setShowNewAddressForm(false);
    setStep('payment');
  };

  const handleProceedToPayment = () => {
    if (selectedAddress) {
      setStep('payment');
    }
  };

  if (cart.length === 0) {
    return (
      <main className='min-h-screen bg-gray-50 p-6 lg:p-8'>
        <div className='mx-auto max-w-2xl'>
          <div className='rounded-lg border border-gray-200 bg-white p-8 text-center'>
            <h1 className='text-2xl font-semibold text-gray-900 mb-2'>Your cart is empty</h1>
            <p className='text-sm text-gray-600 mb-6'>Add items to your cart before proceeding to checkout.</p>
            <a
              href='/'
              className='inline-flex rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700'
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className='min-h-screen bg-gray-50 p-6 lg:p-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
          <p className='mt-1 text-sm text-gray-600'>Complete your purchase in a few steps</p>
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {step === 'address' ? (
            <div className='lg:col-span-2'>
              <div className='rounded-lg border border-gray-200 bg-white p-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-4'>Delivery Address</h2>

                {addresses.length > 0 && !showNewAddressForm ? (
                  <div className='space-y-2'>
                    {addresses.map((address: ShippingAddress) => (
                      <label
                        key={address.id}
                        className={`block rounded-lg border p-4 transition cursor-pointer ${
                          selectedAddressId === address.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type='radio'
                          name='deliveryAddress'
                          className='mr-3'
                          checked={selectedAddressId === address.id}
                          onChange={() => setSelectedAddressId(address.id)}
                        />
                        <div className='inline-block align-middle text-sm'>
                          <p className='font-semibold text-gray-900'>{address.name}</p>
                          <p className='text-gray-700'>{address.address}</p>
                          <p className='text-gray-500'>{address.email}</p>
                        </div>
                      </label>
                    ))}

                    <div className='flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200'>
                      <button
                        type='button'
                        onClick={handleProceedToPayment}
                        className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50'
                        disabled={!selectedAddress}
                      >
                        Continue to Payment
                      </button>
                      <button
                        type='button'
                        onClick={() => setShowNewAddressForm(true)}
                        className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100'
                      >
                        Add New Address
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <ShippingForm onSubmit={handleAddressSaved} onCancel={() => setShowNewAddressForm(false)} />
                    {addresses.length > 0 && (
                      <button
                        type='button'
                        onClick={() => setShowNewAddressForm(false)}
                        className='rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100'
                      >
                        Back to Saved Addresses
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className='lg:col-span-2'>
              <div className='rounded-lg border border-gray-200 bg-white p-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-4'>Payment Details</h2>

                {selectedAddress && (
                  <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm'>
                    <p className='font-semibold text-blue-900 mb-2'>Delivering to:</p>
                    <p className='text-blue-900'>{selectedAddress.name}</p>
                    <p className='text-blue-800'>{selectedAddress.address}</p>
                    <p className='text-blue-800'>{selectedAddress.email}</p>
                    <button
                      type='button'
                      onClick={() => setStep('address')}
                      className='mt-3 inline-flex rounded-md border border-blue-600 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100'
                    >
                      Change Address
                    </button>
                  </div>
                )}

                <PaymentForm shippingAddress={selectedAddress} onSuccess={() => router.push('/order-details')} />
              </div>
            </div>
          )}

          {/* Order Summary Sidebar */}
          <div className='lg:col-span-1'>
            <div className='sticky top-8 rounded-lg border border-gray-200 bg-white p-5'>
              <h3 className='text-sm font-semibold text-gray-900 mb-4'>Order Summary</h3>

              <div className='space-y-3 text-sm border-b border-gray-200 pb-4 mb-4'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Items:</span>
                  <span className='font-medium text-gray-900'>{totalItems}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal:</span>
                  <span className='font-medium text-gray-900'>${totalPrice.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping:</span>
                  <span className='font-medium text-gray-900'>Free</span>
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <span className='font-semibold text-gray-900'>Total:</span>
                <span className='text-lg font-bold text-blue-600'>${totalPrice.toFixed(2)}</span>
              </div>

              <div className='mt-4 space-y-2 max-h-64 overflow-y-auto'>
                {cart.map((item: any) => (
                  <div key={item.id} className='flex justify-between text-xs'>
                    <span className='text-gray-600 truncate'>{item.name}</span>
                    <span className='text-gray-900 font-medium'>
                      {item.quantity}x ${item.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

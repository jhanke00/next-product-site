'use client';
import React, { useState } from 'react';
import { useCart } from '@/src/context/CartContext';
import Navigation from '@/src/components/Navigation';
import { ArrowLeftIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckoutFormData, ShippingAddress } from '@/src/type/orders';
import Image from 'next/image';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    shippingAddress: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate totals
  const shipping = cart.totalPrice > 50 ? 0 : 9.99;
  const tax = cart.totalPrice * 0.08;
  const finalTotal = cart.totalPrice + shipping + tax;

  // Redirect if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <Navigation />
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center'>
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>Your cart is empty</h1>
          <p className='text-gray-600 mb-8'>Add some products to your cart before checking out.</p>
          <Link
            href='/products'
            className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const { shippingAddress, agreedToTerms } = formData;

    // Shipping validation
    if (!shippingAddress.firstName) newErrors.firstName = 'First name is required';
    if (!shippingAddress.lastName) newErrors.lastName = 'Last name is required';
    if (!shippingAddress.email) newErrors.email = 'Email is required';
    if (!shippingAddress.phone) newErrors.phone = 'Phone number is required';
    if (!shippingAddress.address) newErrors.address = 'Address is required';
    if (!shippingAddress.city) newErrors.city = 'City is required';
    if (!shippingAddress.state) newErrors.state = 'State is required';
    if (!shippingAddress.zipCode) newErrors.zipCode = 'ZIP code is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shippingAddress.email && !emailRegex.test(shippingAddress.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Terms validation
    if (!agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order
      const orderData = {
        items: cart.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category,
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: 'cod' as const,
        subtotal: cart.totalPrice,
        shipping,
        tax,
        total: finalTotal,
      };

      // Send to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Clear cart and redirect
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navigation />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='flex items-center mb-8'>
          <Link href='/cart' className='flex items-center text-gray-600 hover:text-gray-900 mr-4'>
            <ArrowLeftIcon className='w-5 h-5 mr-2' />
            Back to Cart
          </Link>
          <h1 className='text-3xl font-bold text-gray-900'>Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Checkout Form */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Shipping Information */}
            <div className='bg-white rounded-2xl shadow-sm p-6'>
              <div className='flex items-center mb-6'>
                <TruckIcon className='w-6 h-6 text-blue-600 mr-3' />
                <h2 className='text-xl font-bold text-gray-900'>Shipping Information</h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>First Name *</label>
                  <input
                    type='text'
                    value={formData.shippingAddress.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Enter first name'
                  />
                  {errors.firstName && <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Last Name *</label>
                  <input
                    type='text'
                    value={formData.shippingAddress.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Enter last name'
                  />
                  {errors.lastName && <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>}
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address *</label>
                  <input
                    type='email'
                    value={formData.shippingAddress.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Enter email address'
                  />
                  {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number *</label>
                  <input
                    type='tel'
                    value={formData.shippingAddress.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Enter phone number'
                  />
                  {errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone}</p>}
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Street Address *</label>
                  <input
                    type='text'
                    value={formData.shippingAddress.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Enter street address'
                  />
                  {errors.address && <p className='text-red-500 text-xs mt-1'>{errors.address}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>City *</label>
                  <input
                    type='text'
                    value={formData.shippingAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Enter city'
                  />
                  {errors.city && <p className='text-red-500 text-xs mt-1'>{errors.city}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>State *</label>
                  <input
                    type='text'
                    value={formData.shippingAddress.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Enter state'
                  />
                  {errors.state && <p className='text-red-500 text-xs mt-1'>{errors.state}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>ZIP Code *</label>
                  <input
                    type='text'
                    value={formData.shippingAddress.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500 ${errors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder='Enter ZIP code'
                  />
                  {errors.zipCode && <p className='text-red-500 text-xs mt-1'>{errors.zipCode}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method - Cash on Delivery */}
            <div className='bg-white rounded-2xl shadow-sm p-6'>
              <div className='flex items-center mb-6'>
                <ShieldCheckIcon className='w-6 h-6 text-green-600 mr-3' />
                <h2 className='text-xl font-bold text-gray-900'>Payment Method</h2>
              </div>

              <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
                <div className='flex items-center'>
                  <div className='flex-shrink-0'>
                    <div className='w-8 h-8 bg-green-600 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-bold'>₹</span>
                    </div>
                  </div>
                  <div className='ml-4'>
                    <h3 className='text-lg font-semibold text-green-900'>Cash on Delivery (COD)</h3>
                    <p className='text-green-700 mt-1'>
                      Pay with cash when your order is delivered to your doorstep. No advance payment required.
                    </p>
                  </div>
                </div>

                <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex items-start'>
                    <div className='flex-shrink-0'>
                      <div className='w-5 h-5 text-green-600 mt-0.5'>✓</div>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm text-green-800 font-medium'>100% Secure</p>
                      <p className='text-xs text-green-600'>No online payment required</p>
                    </div>
                  </div>

                  <div className='flex items-start'>
                    <div className='flex-shrink-0'>
                      <div className='w-5 h-5 text-green-600 mt-0.5'>✓</div>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm text-green-800 font-medium'>Easy Returns</p>
                      <p className='text-xs text-green-600'>Hassle-free return policy</p>
                    </div>
                  </div>
                </div>

                <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
                  <p className='text-xs text-yellow-800'>
                    <span className='font-medium'>Note:</span> Please keep the exact amount ready for a smooth delivery
                    experience.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className='bg-white rounded-2xl shadow-sm p-6'>
              <div className='flex items-start'>
                <input
                  type='checkbox'
                  checked={formData.agreedToTerms}
                  onChange={(e) => setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }))}
                  className='mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <div className='ml-3'>
                  <label className='text-sm text-gray-700'>
                    I agree to the{' '}
                    <Link href='/terms' className='text-blue-600 hover:text-blue-800'>
                      Terms and Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href='/privacy' className='text-blue-600 hover:text-blue-800'>
                      Privacy Policy
                    </Link>
                    *
                  </label>
                  {errors.agreedToTerms && <p className='text-red-500 text-xs mt-1'>{errors.agreedToTerms}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-2xl shadow-sm p-6 sticky top-8'>
              <h3 className='text-xl font-bold text-gray-900 mb-6'>Order Summary</h3>

              {/* Cart Items */}
              <div className='space-y-4 mb-6'>
                {cart.items.map((item) => (
                  <div key={item.id} className='flex items-center space-x-3'>
                    <Image
                      src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop&crop=center&sig=${item.id}`}
                      alt={item.name}
                      width={60}
                      height={60}
                      className='w-12 h-12 object-cover rounded-lg'
                    />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium text-gray-900 truncate'>{item.name}</p>
                      <p className='text-xs text-gray-600'>
                        Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                      </p>
                    </div>
                    <span className='text-sm font-semibold text-gray-900'>
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className='border-t border-gray-200 pt-4 space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-semibold text-gray-900'>${cart.totalPrice.toFixed(2)}</span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-semibold text-gray-900'>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className='flex justify-between'>
                  <span className='text-gray-600'>Tax</span>
                  <span className='font-semibold text-gray-900'>${tax.toFixed(2)}</span>
                </div>

                <div className='border-t border-gray-200 pt-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg font-bold text-gray-900'>Total</span>
                    <span className='text-2xl font-bold text-blue-600'>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                disabled={isSubmitting}
                className='w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors mt-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? (
                  <>
                    <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2' />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className='w-5 h-5 mr-2' />
                    Complete Order
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className='mt-4 text-center'>
                <div className='flex items-center justify-center text-xs text-gray-500'>
                  <span className='mr-2'>🔒</span>
                  Your payment information is secure
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

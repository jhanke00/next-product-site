'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type ShippingForm = {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
};

export default function Shipping() {
  const router = useRouter();
  const [form, setForm] = useState<ShippingForm>(() => {
    let saved;
    if (typeof window !== 'undefined') {
      saved = localStorage.getItem('shipping-info');
    }

    return saved
      ? JSON.parse(saved)
      : {
          firstName: '',
          lastName: '',
          email: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phone: '',
        };
  });

  const [errors, setErrors] = useState<Partial<ShippingForm>>({});

  const validateForm = () => {
    const newErrors: Partial<ShippingForm> = {};

    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.email) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email format';
    if (!form.address) newErrors.address = 'Address is required';
    if (!form.city) newErrors.city = 'City is required';
    if (!form.state) newErrors.state = 'State is required';
    if (!form.zipCode) newErrors.zipCode = 'ZIP code is required';
    if (!form.country) newErrors.country = 'Country is required';
    if (!form.phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window !== 'undefined' && validateForm()) {
      localStorage.setItem('shipping-info', JSON.stringify(form));
      router.push('/checkout/payment');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ShippingForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className='p-6 max-w-2xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6'>Shipping Information</h2>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>First Name</label>
            <input
              type='text'
              name='firstName'
              value={form.firstName}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            />
            {errors.firstName && <p className='text-red-500 text-sm mt-1'>{errors.firstName}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Last Name</label>
            <input
              type='text'
              name='lastName'
              value={form.lastName}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            />
            {errors.lastName && <p className='text-red-500 text-sm mt-1'>{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Address</label>
          <input
            type='text'
            name='address'
            value={form.address}
            onChange={handleChange}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          />
          {errors.address && <p className='text-red-500 text-sm mt-1'>{errors.address}</p>}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>City</label>
            <input
              type='text'
              name='city'
              value={form.city}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            />
            {errors.city && <p className='text-red-500 text-sm mt-1'>{errors.city}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>State</label>
            <input
              type='text'
              name='state'
              value={form.state}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            />
            {errors.state && <p className='text-red-500 text-sm mt-1'>{errors.state}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>ZIP Code</label>
            <input
              type='text'
              name='zipCode'
              value={form.zipCode}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            />
            {errors.zipCode && <p className='text-red-500 text-sm mt-1'>{errors.zipCode}</p>}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Country</label>
            <input
              type='text'
              name='country'
              value={form.country}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            />
            {errors.country && <p className='text-red-500 text-sm mt-1'>{errors.country}</p>}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700'>Phone</label>
            <input
              type='tel'
              name='phone'
              value={form.phone}
              onChange={handleChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            />
            {errors.phone && <p className='text-red-500 text-sm mt-1'>{errors.phone}</p>}
          </div>
        </div>

        <div className='flex justify-end space-x-4 pt-4'>
          <button type='button' onClick={() => router.back()} className='px-4 py-2 text-gray-600 hover:text-gray-800'>
            Back
          </button>
          <button type='submit' className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}

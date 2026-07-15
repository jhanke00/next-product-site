// components/checkout/ShippingForm.tsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

type ShippingData = {
  name: string;
  address: string;
  email: string;
};

const schema = yup.object({
  name: yup.string().required('Full name is required.'),
  address: yup.string().required('Address is required.'),
  email: yup.string().email('Enter a valid email.').required('Email is required.'),
});

export default function ShippingForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: ShippingData) => void;
  onCancel?: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingData>({
    resolver: yupResolver(schema),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-5 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm'
    >
      <div>
        <label className='block text-sm font-medium text-gray-700'>Full name</label>
        <input
          {...register('name')}
          placeholder='John Doe'
          className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        />
        {errors.name && <p className='mt-2 text-sm text-red-600'>{errors.name.message}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Address</label>
        <input
          {...register('address')}
          placeholder='123 Main St, City, State'
          className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        />
        {errors.address && <p className='mt-2 text-sm text-red-600'>{errors.address.message}</p>}
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Email</label>
        <input
          {...register('email')}
          placeholder='you@example.com'
          className='mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
        />
        {errors.email && <p className='mt-2 text-sm text-red-600'>{errors.email.message}</p>}
      </div>

      <div className='flex flex-wrap gap-3'>
        <button type='submit' className='rounded-full bg-blue-600 px-6 py-3 text-white hover:bg-blue-700'>
          Save address
        </button>
        {onCancel ? (
          <button
            type='button'
            onClick={onCancel}
            className='rounded-full border border-gray-300 px-6 py-3 text-gray-900 hover:bg-gray-100'
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

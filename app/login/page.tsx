'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/src/components/AuthModal';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(true);
  const returnTo = searchParams?.get('returnTo') || '/products';

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-6xl mx-auto px-4 py-10'>
        <h1 className='text-2xl font-semibold text-gray-800'>Login</h1>
        <p className='text-gray-600 mt-2'>Sign in or create an account to continue.</p>
      </div>
      <AuthModal
        isOpen={open}
        onClose={() => {
          setOpen(false);
          router.push(returnTo);
        }}
        onSignedIn={(_userId, _email, _name) => {
          // After successful sign-in, notify and navigate
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-change'));
          }
          router.push(returnTo);
        }}
      />
    </div>
  );
}

'use client';

import React from 'react';

export default function BackButton({ label = 'Back' }: { label?: string }) {
  return (
    <button
      onClick={() => {
        // Prefer history back, but fall back to products list if no history
        if (window.history.length > 1) window.history.back();
        else window.location.href = '/products';
      }}
      aria-label='Go back'
      className='mb-4 self-start w-auto inline-flex items-center rounded border border-gray-300 dark:border-neutral-700 px-3 py-1 text-sm text-gray-900 dark:text-white bg-white dark:bg-neutral-800/10 hover:bg-gray-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-900'
    >
      ← {label}
    </button>
  );
}

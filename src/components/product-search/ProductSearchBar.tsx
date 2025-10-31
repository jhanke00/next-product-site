'use client';

import React from 'react';

interface ProductSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ProductSearchBar: React.FC<ProductSearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className='mb-6'>
      <div className='relative'>
        <input
          type='text'
          placeholder='Search for products...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600'
          onClick={() => searchQuery.trim() && setSearchQuery(searchQuery)}
        >
          Search
        </button>
      </div>
    </div>
  );
};

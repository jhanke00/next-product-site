'use client';
import { useState, useEffect } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  sortBy: string;
  sortOrder: string;
}

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
  { value: 'stock', label: 'Stock' },
];

export default function ProductFilters({ onFilterChange, initialFilters }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('/api/categories', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        const names: string[] = (data.categories || [])
          .map((cat: { name: string }) => cat.name)
          .sort((a: string, b: string) => a.localeCompare(b));
        setCategories(names);
        setCategoryError(null);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategoryError('Unable to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Use initialFilters directly instead of maintaining separate state
  const currentFilters = initialFilters || {
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'name',
    sortOrder: 'asc',
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...currentFilters, [key]: value };
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sortBy: 'name',
      sortOrder: 'asc',
    };
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters =
    currentFilters.category || currentFilters.minPrice || currentFilters.maxPrice || currentFilters.minRating;

  return (
    <div className='relative'>
      {/* Mobile Filter Toggle */}
      <div className='lg:hidden mb-4'>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 hover:bg-gray-50 shadow-sm'
        >
          <FunnelIcon className='w-5 h-5 mr-2' />
          {isOpen ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <span className='ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full'>
              {Object.values(currentFilters).filter((v) => v && v !== 'name' && v !== 'asc').length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      <div
        className={`${isOpen ? 'block' : 'hidden'} lg:block bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-6`}
      >
        <div className='flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
            <FunnelIcon className='w-5 h-5 mr-2 text-blue-600' />
            Filters
            {hasActiveFilters && (
              <span className='ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full'>
                {Object.values(currentFilters).filter((v) => v && v !== 'name' && v !== 'asc').length} active
              </span>
            )}
          </h3>
          <div className='flex items-center space-x-2'>
            {hasActiveFilters && (
              <button onClick={clearFilters} className='text-sm text-blue-600 hover:text-blue-800 font-medium'>
                Clear All
              </button>
            )}
            <button onClick={() => setIsOpen(false)} className='lg:hidden text-gray-400 hover:text-gray-600'>
              <XMarkIcon className='w-5 h-5' />
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-2'>
            Category
          </label>
          <select
            id='category'
            value={currentFilters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white'
          >
            <option value='' className='text-gray-900'>
              All Categories
            </option>
            {categories.map((category) => (
              <option key={category} value={category} className='text-gray-900'>
                {category}
              </option>
            ))}
          </select>
          {loadingCategories && <p className='mt-1 text-xs text-gray-500'>Loading categories…</p>}
          {categoryError && <p className='mt-1 text-xs text-red-500'>{categoryError}</p>}
        </div>

        {/* Price Range */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Price Range</label>
          <div className='grid grid-cols-2 gap-2'>
            <input
              type='number'
              placeholder='Min $'
              value={currentFilters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400'
            />
            <input
              type='number'
              placeholder='Max $'
              value={currentFilters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400'
            />
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label htmlFor='minRating' className='block text-sm font-medium text-gray-700 mb-2'>
            Minimum Rating
          </label>
          <select
            id='minRating'
            value={currentFilters.minRating || ''}
            onChange={(e) => handleFilterChange('minRating', e.target.value)}
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white'
          >
            <option value='' className='text-gray-900'>
              Any Rating
            </option>
            <option value='4' className='text-gray-900'>
              4+ Stars
            </option>
            <option value='3' className='text-gray-900'>
              3+ Stars
            </option>
            <option value='2' className='text-gray-900'>
              2+ Stars
            </option>
            <option value='1' className='text-gray-900'>
              1+ Stars
            </option>
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Sort By</label>
          <div className='space-y-2'>
            <select
              value={currentFilters.sortBy || 'name'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className='w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white'
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className='text-gray-900'>
                  {option.label}
                </option>
              ))}
            </select>
            <div className='flex space-x-2'>
              <button
                type='button'
                onClick={() => handleFilterChange('sortOrder', 'asc')}
                className={`flex-1 py-2 px-3 text-sm rounded-md border ${
                  (currentFilters.sortOrder || 'asc') === 'asc'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Ascending
              </button>
              <button
                type='button'
                onClick={() => handleFilterChange('sortOrder', 'desc')}
                className={`flex-1 py-2 px-3 text-sm rounded-md border ${
                  currentFilters.sortOrder === 'desc'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Descending
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useCallback } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { ResourceSearchFilters, ResourceType, ResourceCategory, DifficultyLevel } from '@/src/types/learning';

interface SearchAndFilterProps {
  filters: ResourceSearchFilters;
  onFiltersChange: (filters: ResourceSearchFilters) => void;
  className?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filters, onFiltersChange, className = '' }) => {
  const [showFilters, setShowFilters] = useState(false);

  const resourceTypes: ResourceType[] = ['video', 'pdf', 'article', 'quiz', 'interactive', 'webinar', 'course'];
  const resourceCategories: ResourceCategory[] = [
    'tutorial',
    'guide',
    'training',
    'documentation',
    'reference',
    'certification',
  ];
  const difficultyLevels: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'rating', label: 'Rating' },
    { value: 'duration', label: 'Duration' },
    { value: 'popularity', label: 'Popularity' },
  ];

  const handleSearchChange = useCallback(
    (value: string) => {
      onFiltersChange({
        ...filters,
        query: value || undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleTypeToggle = useCallback(
    (type: ResourceType) => {
      const currentTypes = filters.types || [];
      const newTypes = currentTypes.includes(type) ? currentTypes.filter((t) => t !== type) : [...currentTypes, type];

      onFiltersChange({
        ...filters,
        types: newTypes.length > 0 ? newTypes : undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleCategoryToggle = useCallback(
    (category: ResourceCategory) => {
      const currentCategories = filters.categories || [];
      const newCategories = currentCategories.includes(category)
        ? currentCategories.filter((c) => c !== category)
        : [...currentCategories, category];

      onFiltersChange({
        ...filters,
        categories: newCategories.length > 0 ? newCategories : undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleDifficultyToggle = useCallback(
    (difficulty: DifficultyLevel) => {
      const currentDifficulties = filters.difficulties || [];
      const newDifficulties = currentDifficulties.includes(difficulty)
        ? currentDifficulties.filter((d) => d !== difficulty)
        : [...currentDifficulties, difficulty];

      onFiltersChange({
        ...filters,
        difficulties: newDifficulties.length > 0 ? newDifficulties : undefined,
      });
    },
    [filters, onFiltersChange]
  );

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: 'asc' | 'desc') => {
      onFiltersChange({
        ...filters,
        sortBy: sortBy as any,
        sortOrder,
      });
    },
    [filters, onFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      query: undefined,
      types: undefined,
      categories: undefined,
      difficulties: undefined,
      tags: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: filters.limit,
    });
  }, [filters.limit, onFiltersChange]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.types?.length) count++;
    if (filters.categories?.length) count++;
    if (filters.difficulties?.length) count++;
    if (filters.tags?.length) count++;
    return count;
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${className}`}
    >
      {/* Search Bar */}
      <div className='relative mb-4'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Search className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          placeholder='Search learning resources...'
          value={filters.query || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className='block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
        />
      </div>

      {/* Filter Toggle and Active Filter Count */}
      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className='inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <Filter className='h-4 w-4' />
          Filters
          {getActiveFilterCount() > 0 && (
            <span className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full'>
              {getActiveFilterCount()}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className='inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          >
            <X className='h-3 w-3' />
            Clear all
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className='space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4'>
          {/* Resource Types */}
          <div>
            <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>Type</h4>
            <div className='flex flex-wrap gap-2'>
              {resourceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeToggle(type)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.types?.includes(type)
                      ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>Category</h4>
            <div className='flex flex-wrap gap-2'>
              {resourceCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.categories?.includes(category)
                      ? 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-300'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Levels */}
          <div>
            <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>Difficulty</h4>
            <div className='flex flex-wrap gap-2'>
              {difficultyLevels.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultyToggle(difficulty)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.difficulties?.includes(difficulty)
                      ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h4 className='text-sm font-medium text-gray-900 dark:text-white mb-2'>Sort by</h4>
            <div className='flex items-center gap-4'>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleSortChange(e.target.value, filters.sortOrder || 'desc')}
                className='block w-auto px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className='flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden'>
                <button
                  onClick={() => handleSortChange(filters.sortBy || 'createdAt', 'asc')}
                  className={`px-3 py-1 text-sm ${
                    filters.sortOrder === 'asc'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Asc
                </button>
                <button
                  onClick={() => handleSortChange(filters.sortBy || 'createdAt', 'desc')}
                  className={`px-3 py-1 text-sm border-l border-gray-300 dark:border-gray-600 ${
                    filters.sortOrder === 'desc'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Desc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;

import React, { useState, useEffect } from 'react';
import type { SearchPropsType } from '@type/common';
import { fetchUniqueCategories } from '@utils/productUtils'; // Adjust the import path as needed

const Search: React.FC<SearchPropsType> = ({ searchQuery, onSearch, onReset, selectedCategory, onCategoryChange }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const uniqueCategories = await fetchUniqueCategories();
      setCategories(uniqueCategories);
    };

    loadCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(e.target.value);

    handleSearch(localQuery, e.target.value);
  };

  const handleSearch = (query = localQuery, category = selectedCategory) => {
    if (query.trim() || category) {
      onSearch(query.trim(), category);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (localQuery.trim() || selectedCategory)) {
      handleSearch();
    }
  };

  const handleResetClick = () => {
    setLocalQuery('');
    onCategoryChange('');
    onReset();
  };

  const isSearchDisabled = !localQuery.trim() && !selectedCategory;

  return (
    <div className='py-2 px-1 flex items-center'>
      <input
        type='text'
        className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
        placeholder='Search products...'
        value={localQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <select
        className='mx-2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400'
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value=''>All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button
        className='px-4 py-2 rounded-md bg-blue-500 text-white'
        onClick={() => handleSearch()}
        disabled={isSearchDisabled}
      >
        Search
      </button>
      <button className='ml-2 px-4 py-2 rounded-md bg-gray-300 text-black' onClick={handleResetClick}>
        Reset
      </button>
    </div>
  );
};

export default Search;

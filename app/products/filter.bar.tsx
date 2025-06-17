import { useFilter } from '@context/products';
import { ChangeEvent, useState, useMemo } from 'react';
import { debounce } from 'lodash';

//just for test purposes
const categories = [
  'Electronics',
  'Jewelery',
  'Games',
  'Books',
  'Toys',
  'Health',
  'Automotive',
  'Sports',
  'Grocery',
  'Computers',
  'Baby',
  'Kids',
  'Beauty',
  'Outdoors',
  'Music',
  'Garden',
  'Industrial',
  'Shoes',
  'Home',
  'Movies',
  'Clothing',
  'Tools',
];

const FilterBar = () => {
  const { categoryFilter, setCategoryFilter, searchFilter, setSearchFilter, applyFilters } = useFilter();

  const [searchInput, setSearchInput] = useState<string>(searchFilter);

  const debouncedSearch = useMemo(() => {
    return debounce((value: string) => setSearchFilter(value), 700);
  }, []);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  return (
    <div className='p-4 bg-gray-800 rounded-lg shadow-lg'>
      <div className='mb-6'>
        <input
          type='text'
          placeholder='Search products...'
          value={searchInput}
          onChange={handleSearchChange}
          className='bg-gray-800 text-white border border-gray-600 rounded p-2 w-full focus:outline-none focus:border-blue-500'
        />
      </div>
      <div>
        <h3 className='text-xl font-semibold text-white mb-2'>Category</h3>
        <select
          className='bg-gray-800 text-white border border-gray-600 rounded p-2 w-full'
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value=''>All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className='mt-6'>
        <button
          className='w-full text-white bg-blue-500 border border-blue-500 rounded py-2 px-4'
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;

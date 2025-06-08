import React from 'react';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type='text'
      placeholder='Search by product name (min 5 chars)'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-full p-2 mb-4 border border-gray-300 rounded'
    />
  );
};

export default SearchBar;

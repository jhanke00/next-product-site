import { useDebounce } from '@/src/hooks/useDebounce';
import { useSearch } from '@/src/providers/SearchProvider';
import React, { useEffect, useState } from 'react';
import TextField from '../ReusableComponents/TextField/TextField';

const SearchField = () => {
  const [value, setValue] = useState('');
  const debouncedSearchValue = useDebounce(value, 500);
  const { onChange, value: searchParam } = useSearch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (value !== searchParam) {
      onChange(debouncedSearchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  useEffect(() => {
    setValue(searchParam);
  }, [searchParam]);

  return <TextField placeholder='Search...' onChange={handleChange} value={value} />;
};

export default SearchField;

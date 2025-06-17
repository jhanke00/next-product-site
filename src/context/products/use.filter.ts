import { useContext } from 'react';
import FilterContext from './filter.context';

const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};

export default useFilter;

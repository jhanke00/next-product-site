import { ReactNode, useCallback, useEffect, useState } from 'react';
import FilterContext from './filter.context';

const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<{
    category: string;
    search: string;
    page: number;
  }>({
    category: categoryFilter,
    search: searchFilter,
    page: currentPage,
  });

  const applyFilters = useCallback(() => {
    setFilters({
      category: categoryFilter,
      search: searchFilter,
      page: currentPage,
    });
  }, [categoryFilter, currentPage, searchFilter]);

  useEffect(() => {
    applyFilters();
  }, [currentPage, applyFilters]);

  return (
    <FilterContext.Provider
      value={{
        categoryFilter,
        setCategoryFilter,
        searchFilter,
        setSearchFilter,
        currentPage,
        setCurrentPage,
        applyFilters,
        filters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;

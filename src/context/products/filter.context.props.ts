import { Dispatch, SetStateAction } from 'react';

export default interface FilterContextProps {
  categoryFilter: string;
  setCategoryFilter: Dispatch<SetStateAction<string>>;
  searchFilter: string;
  setSearchFilter: Dispatch<SetStateAction<string>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  applyFilters: () => void;
  filters: {
    category: string;
    search: string;
    page: number;
  };
}

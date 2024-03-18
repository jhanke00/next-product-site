export interface PaginationPropsType {
  totalItems: number;
  rowsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}
export interface BreadcrumbType {
  label: string;
  href: string;
  active?: boolean;
}

export interface ErrorPropsType {
  message: string;
  page?: string | null;
  eType?: string | null;
}

export interface SearchPropsType {
  searchQuery: string;
  selectedCategory: string;
  onSearch: (query: string, category: string) => void;
  onReset: () => void;
  onCategoryChange: (category: string) => void;
}

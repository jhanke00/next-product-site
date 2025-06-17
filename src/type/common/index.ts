export type Pagination = {
  pageCount: number;
  totalCount: number;
  page: number;
};

export type CustomResponse<T> = {
  data?: T;
  pagination?: Pagination;
  isLoading: boolean;
  error: Error;
};

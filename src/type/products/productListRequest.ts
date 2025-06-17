export type ProductListPageOptions = {
  page: number;
  limit?: number;
};

export type ProductListQueryData = {
  category?: string;
  search?: string;
  rating?: string;
  price?: string;
};

export type RangeOfValues<T> = {
  from?: T;
  to?: T;
};

export type ProductListDbQueryData = {
  category?: string;
  search?: string;
  rating?: RangeOfValues<number>;
  price?: RangeOfValues<number>;
};

export type ProductQueryParams = ProductListQueryData & ProductListPageOptions;

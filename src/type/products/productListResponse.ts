import { Product } from './product';

export type ProductListResponse = {
  data: Product[];
  count: number;
};

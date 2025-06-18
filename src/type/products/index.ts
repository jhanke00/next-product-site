export type Product = {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  rating: number;
  numReviews: number;
  countInStock: number;
};

export interface ProductsResponse {
  products: Product[];
  total: number;
  offset: number;
  limit: number;
}

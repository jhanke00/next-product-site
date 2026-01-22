import Model from '../model';
import Service from '../service';

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

export type paginatedProducts = {
  products: Product[];
  count: number;
  page: number;
  pages: number;
};

export interface IProductModel extends Model<Product> {
  getPaginatedProducts(page: number, productsPerPage: number, query?: string, category?: string): Promise<Product[]>;
}
export interface IProductService extends Service<Product> {
  getPaginatedProducts(
    page: number,
    productsPerPage: number,
    query?: string,
    category?: string
  ): Promise<paginatedProducts>;
}

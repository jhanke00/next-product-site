import smallData from '@mock/small/products.json';
import largeData from '@mock/large/products.json';
import { Product } from '@type/products';

export function getQueryProducts(query: string): Product[] {
  return ([...largeData, ...smallData] as unknown as Product[]).filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())
  );
}

export function getQueryRecommendedProducts(): Product[] {
  return ([...largeData, ...smallData] as unknown as Product[])
    .filter((p) => p.rating > 4.7 && p.countInStock > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 51);
}

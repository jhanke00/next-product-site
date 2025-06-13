import { Product } from '@/src/type/products';

export const filterByName = (products: Product[], name: string): Product[] => {
  return products.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
};

export const filterByCategory = (products: Product[], category: string): Product[] => {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
};

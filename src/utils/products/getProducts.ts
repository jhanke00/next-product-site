import smallData from '@/src/mock/small/products.json';

export function getProducts(query: string) {
  return smallData.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
}

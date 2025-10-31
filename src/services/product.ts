import { Product } from '../type/products';

export async function getProducts(query: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/products${query ? `?q=${encodeURIComponent(query)}` : ''}`
  );
  const json = await res.json();
  return json.data;
}

export async function getRecommendedProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products/recommended`);
  const json = await res.json();
  return json.data;
}

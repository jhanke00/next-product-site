import React from 'react';
import { Product } from '@/src/type/products';
import { HomeView } from './view';

// Using dynamic rendering to demonstrate successful build without requiring running backend server
export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: 'default',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  return <HomeView products={products} />;
}

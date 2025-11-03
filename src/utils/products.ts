import smallData from '@/src/mock/small/products.json';
import largeData from '@/src/mock/large/products.json';
import fs from 'fs';
import path from 'path';
import { Product } from '@/src/type/products';

const GENERATED_PRODUCTS_PATH = path.join(process.cwd(), 'src', 'mock', 'generated', 'products.json');

function loadGeneratedProducts(): Product[] {
  try {
    if (!fs.existsSync(GENERATED_PRODUCTS_PATH)) {
      return [];
    }

    const file = fs.readFileSync(GENERATED_PRODUCTS_PATH, 'utf-8');
    const data = JSON.parse(file) as Product[];
    return data;
  } catch (error) {
    console.error('Failed to load generated products:', error);
    return [];
  }
}

export function getAllProducts(): Product[] {
  const productMap = new Map<string, Product>();

  [...smallData, ...largeData].forEach((product) => {
    productMap.set(product.id, product);
  });

  loadGeneratedProducts().forEach((product) => {
    productMap.set(product.id, product);
  });

  return Array.from(productMap.values());
}

export function getProductById(productId: string): Product | undefined {
  return getAllProducts().find((product) => product.id === productId);
}

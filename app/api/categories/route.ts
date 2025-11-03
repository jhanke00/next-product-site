import { NextResponse } from 'next/server';
import smallData from '@/src/mock/small/products.json';
import largeData from '@/src/mock/large/products.json';
import { Product } from '@/src/type/products';
import fs from 'fs';
import path from 'path';

const BASE_PRODUCTS: Product[] = [...smallData, ...largeData];
const GENERATED_PRODUCTS_PATH = path.join(process.cwd(), 'src', 'mock', 'generated', 'products.json');

function loadGeneratedProducts(): Product[] {
  try {
    if (!fs.existsSync(GENERATED_PRODUCTS_PATH)) {
      return [];
    }

    const fileContents = fs.readFileSync(GENERATED_PRODUCTS_PATH, 'utf-8');
    const parsed = JSON.parse(fileContents) as Product[];
    return parsed;
  } catch (error) {
    console.error('Error loading generated products for categories:', error);
    return [];
  }
}

function getAllProducts(): Product[] {
  const generated = loadGeneratedProducts();
  const productMap = new Map<string, Product>();

  BASE_PRODUCTS.forEach((product) => {
    productMap.set(product.id, product);
  });

  generated.forEach((product) => {
    productMap.set(product.id, product);
  });

  return Array.from(productMap.values());
}

export async function GET() {
  try {
    const allProducts = getAllProducts();
    // Get unique categories with product counts
    const categoryStats = allProducts.reduce(
      (acc, product) => {
        const category = product.category;
        const price = parseFloat(product.price);

        if (!acc[category]) {
          acc[category] = {
            name: category,
            count: 0,
            totalRating: 0,
            minPrice: price,
            maxPrice: price,
          };
        }

        acc[category].count++;
        acc[category].totalRating += product.rating;
        acc[category].minPrice = Math.min(acc[category].minPrice, price);
        acc[category].maxPrice = Math.max(acc[category].maxPrice, price);

        return acc;
      },
      {} as Record<string, any>
    );

    // Calculate averages and format the response
    const categories = Object.values(categoryStats)
      .map((cat: any) => ({
        name: cat.name,
        count: cat.count,
        minPrice: Math.round(cat.minPrice * 100) / 100,
        maxPrice: Math.round(cat.maxPrice * 100) / 100,
        averageRating: Math.round((cat.totalRating / cat.count) * 100) / 100,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      categories,
      total: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

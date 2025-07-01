import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Product } from '@/src/type/products';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Mock Data file Path
const ALLOWED_TYPES = ['large', 'small'];
const envType = (process.env.PRODUCT_MOCK_TYPE_FILE || '').trim().toLowerCase();
const MOCK_TYPE = ALLOWED_TYPES.includes(envType) ? envType : 'large';

const PRODUCTS_JSON_PATH = path.join(process.cwd(), 'src', 'mock', MOCK_TYPE, 'products.json');

// Add additional field to Product Type for search optimization
type ProductWithSearch = Product & { _search?: string };

// cache variable to avoid re-reading file repeatedly
let cachedProducts: Product[] | null = null;

/**
 * Loads products from mock JSON file.
 * Caches results after first Load.
 */
export const getAllProducts = (): ProductWithSearch[] => {
  if (cachedProducts) return cachedProducts;
  // check if file exists or not
  if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
    throw new Error(`Product JSON file not found at path: ${PRODUCTS_JSON_PATH}`);
  }
  const fileContents = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
  if (!fileContents) {
    throw new Error(`Product JSON file is empty at path: ${PRODUCTS_JSON_PATH}`);
  }
  // Cached the loaded products
  cachedProducts = JSON.parse(fileContents) as Product[];
  // Optimise the products object for search filter with adding
  // _search field with precomputed LowerCase name at load time
  cachedProducts = cachedProducts.map((p) => ({ ...p, _search: p.name.toLowerCase() }));
  return cachedProducts as ProductWithSearch[];
};

/**
 * Filters product by ID
 * @param id - Product ID
 * @return Product Object or null if not found
 */
export function getProductById(id: string): Product | undefined {
  const result = getAllProducts().find((product) => product.id.toString() === id);
  return result;
}

/**
 * Paginate + search products
 * @param page - current page number
 * @param limit - number of products per page
 * @param search - search query
 */
export function searchProducts(
  page: number,
  limit: number,
  search: string
): {
  results: ProductWithSearch[];
  page_limit: number;
  total: number;
  current_page: number;
  next_page: number | null;
  total_pages: number;
} {
  let products = getAllProducts();

  if (search) {
    products = products.filter((p) => p._search?.includes(search.toLowerCase()));
  }

  // Pagination Logic
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const total = products.length;
  const results = products.slice(startIndex, endIndex);

  return {
    results,
    page_limit: limit,
    total,
    current_page: page,
    next_page: endIndex < total ? page + 1 : null,
    total_pages: Math.ceil(total / limit),
  };
}

// Utilities for products API: loading, filtering, and pagination
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import fs from 'fs';
import path from 'path';

export type Product = {
  id: string | number;
  name: string;
  description?: string;
  price?: number | string;
  category?: string;
  rating?: number;
  numReviews?: number;
  countInStock?: number;
  image?: string;
  [key: string]: unknown;
};

type GetProductsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
};

export function getAllProducts(): Product[] {
  const a = Array.isArray(largeData) ? largeData : [];
  const b = Array.isArray(smallData) ? smallData : [];
  // Prefer large dataset when present, otherwise fall back to small
  const base = (a.length ? a : b) as Product[];
  // Merge overrides (rating/numReviews) if present
  try {
    const overridesPath = path.join(process.cwd(), 'src/mock/overrides/products.json');
    if (fs.existsSync(overridesPath)) {
      const raw = fs.readFileSync(overridesPath, 'utf-8');
      const overrides: Record<string, { rating?: number; numReviews?: number }> = JSON.parse(raw || '{}') || {};
      return base.map((p) => {
        const id = String(p.id);
        const ov = overrides[id];
        if (ov) {
          return { ...p, ...ov };
        }
        return p;
      });
    }
  } catch {}
  return base;
}

export function filterProducts(products: Product[], search = '', category = ''): Product[] {
  const s = search.trim().toLowerCase();
  const c = category.trim().toLowerCase();
  return products.filter((p) => {
    const matchesCategory = c ? (p.category || '').toLowerCase() === c : true;
    const matchesSearch = s
      ? (p.name || '').toString().toLowerCase().includes(s) ||
        (p.description || '').toString().toLowerCase().includes(s)
      : true;
    return matchesCategory && matchesSearch;
  });
}

export function paginate<T>(items: T[], page = 1, pageSize = 20) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  return {
    items: items.slice(start, end),
    page: currentPage,
    pageSize,
    total,
    totalPages,
  };
}

export async function getProducts(params: GetProductsParams) {
  const { page = 1, pageSize = 20, search = '', category = '' } = params;
  const all = getAllProducts();
  const filtered = filterProducts(all, search, category);
  const { items, total, totalPages } = paginate(filtered, page, pageSize);
  const categories = Array.from(
    new Set(all.map((p) => (p.category ? p.category.toString() : '')).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  return {
    data: items,
    page,
    pageSize,
    total,
    totalPages,
    search,
    category,
    categories,
  };
}

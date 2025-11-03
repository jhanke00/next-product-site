import { NextRequest, NextResponse } from 'next/server';
import smallData from '@/src/mock/small/products.json';
import largeData from '@/src/mock/large/products.json';
import { Product } from '@/src/type/products';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const BASE_PRODUCTS: Product[] = [...smallData, ...largeData];
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

function saveGeneratedProducts(products: Product[]) {
  try {
    const directory = path.dirname(GENERATED_PRODUCTS_PATH);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    fs.writeFileSync(GENERATED_PRODUCTS_PATH, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Failed to save generated products:', error);
  }
}

function getAllProducts(): Product[] {
  const generatedProducts = loadGeneratedProducts();
  const productMap = new Map<string, Product>();

  BASE_PRODUCTS.forEach((product) => {
    productMap.set(product.id, product);
  });

  generatedProducts.forEach((product) => {
    productMap.set(product.id, product);
  });

  return Array.from(productMap.values());
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get query parameters
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
  const minRating = parseFloat(searchParams.get('minRating') || '0');
  const sortBy = searchParams.get('sortBy') || 'name';
  const sortOrder = searchParams.get('sortOrder') || 'asc';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const productIdParam = searchParams.get('id');

  try {
    const allProducts = getAllProducts();

    if (productIdParam) {
      const product = allProducts.find((p) => p.id === productIdParam);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      return NextResponse.json({ product });
    }

    let filteredProducts = [...allProducts];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (minPrice > 0) {
      filteredProducts = filteredProducts.filter((product) => parseFloat(product.price) >= minPrice);
    }

    if (maxPrice < 999999) {
      filteredProducts = filteredProducts.filter((product) => parseFloat(product.price) <= maxPrice);
    }

    if (minRating > 0) {
      filteredProducts = filteredProducts.filter((product) => product.rating >= minRating);
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'stock':
          aValue = a.countInStock;
          bValue = b.countInStock;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
        limit,
      },
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const name = body.name?.toString().trim();
    const priceValue = body.price;
    const description = body.description?.toString().trim();
    const category = body.category?.toString().trim();
    const countInStockValue = Number(body.countInStock);
    const ratingValue = body.rating !== undefined ? Number(body.rating) : 0;
    const numReviewsValue = body.numReviews !== undefined ? Number(body.numReviews) : 0;

    if (!name || !description || !category || Number.isNaN(countInStockValue)) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const priceString = typeof priceValue === 'number' ? priceValue.toFixed(2) : priceValue?.toString();

    if (!priceString) {
      return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
    }

    const newProduct: Product = {
      id: body.id?.toString().trim() || randomUUID(),
      name,
      price: priceString,
      description,
      category,
      rating: Number.isNaN(ratingValue) ? 0 : ratingValue,
      numReviews: Number.isNaN(numReviewsValue) ? 0 : numReviewsValue,
      countInStock: countInStockValue,
    };

    const generatedProducts = loadGeneratedProducts();
    const existingIndex = generatedProducts.findIndex((product) => product.id === newProduct.id);

    if (existingIndex >= 0) {
      return NextResponse.json({ error: 'Product with this ID already exists' }, { status: 409 });
    }

    generatedProducts.push(newProduct);
    saveGeneratedProducts(generatedProducts);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body.id?.toString().trim();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const allProducts = getAllProducts();
    const existingProduct = allProducts.find((product) => product.id === productId);

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const updates: Partial<Product> = {};

    if (body.countInStock !== undefined) {
      const count = Number(body.countInStock);
      if (Number.isNaN(count) || count < 0) {
        return NextResponse.json({ error: 'Invalid countInStock value' }, { status: 400 });
      }
      updates.countInStock = count;
    }

    if (body.price !== undefined) {
      if (typeof body.price !== 'string' && typeof body.price !== 'number') {
        return NextResponse.json({ error: 'Invalid price value' }, { status: 400 });
      }
      updates.price = typeof body.price === 'number' ? body.price.toFixed(2) : body.price;
    }

    if (body.name !== undefined) {
      updates.name = body.name.toString().trim();
    }

    if (body.description !== undefined) {
      updates.description = body.description.toString().trim();
    }

    if (body.category !== undefined) {
      updates.category = body.category.toString().trim();
    }

    if (body.rating !== undefined) {
      const rating = Number(body.rating);
      if (Number.isNaN(rating) || rating < 0 || rating > 5) {
        return NextResponse.json({ error: 'Invalid rating value' }, { status: 400 });
      }
      updates.rating = rating;
    }

    if (body.numReviews !== undefined) {
      const numReviews = Number(body.numReviews);
      if (Number.isNaN(numReviews) || numReviews < 0) {
        return NextResponse.json({ error: 'Invalid numReviews value' }, { status: 400 });
      }
      updates.numReviews = numReviews;
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...updates,
    };

    const generatedProducts = loadGeneratedProducts();
    const generatedIndex = generatedProducts.findIndex((product) => product.id === productId);

    if (generatedIndex >= 0) {
      generatedProducts[generatedIndex] = {
        ...generatedProducts[generatedIndex],
        ...updatedProduct,
      };
    } else {
      generatedProducts.push(updatedProduct);
    }

    saveGeneratedProducts(generatedProducts);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

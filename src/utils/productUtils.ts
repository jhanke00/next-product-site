import { ProductType } from '@type/products';

export const defaultProduct: ProductType = {
  id: '',
  name: '',
  description: '',
  price: '0',
  category: '',
  rating: 0,
  numReviews: 0,
  countInStock: 0,
};

export const productPageConfig = {
  rowCount: 10,
  redirectUrl: '/products',
};
export const productTableHeaders = [
  { display: 'Name', field: 'name', sortEnabled: true, valueType: 'string', addon: [] },
  { display: 'Price', field: 'price', sortEnabled: true, valueType: 'currency', addon: [] },
  { display: 'Category', field: 'category', sortEnabled: true, valueType: 'string', addon: [] },
  { display: 'Count in Stock', field: 'countInStock', sortEnabled: false, valueType: 'number', addon: [] },
  { display: 'Rating', field: 'rating', sortEnabled: true, valueType: 'number', addon: [{ subfield: 'numReviews' }] },
];

export function isValidProduct(product: ProductType): boolean {
  return product.id !== '' && product.name !== '' && product.price !== '0';
}

export function getAddonProductValue(product: any, addon: any): string | null {
  if (addon && addon.length > 0) {
    const subfieldValue = addon[0].subfield;
    return 'From ' + product[subfieldValue] + ' Reviews';
  }
  return null;
}

export async function fetchProducts(): Promise<ProductType[]> {
  try {
    const response = await fetch('/api/products');
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to fetch products:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export async function searchProducts(searchQuery: string, searchcategory: string): Promise<ProductType[]> {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({ query: searchQuery, category: searchcategory }),
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Failed to search products:', response.statusText);
      return [];
    }
  } catch (error) {
    console.error('Failed to search products:', error);
    return [];
  }
}

export async function fetchUniqueCategories() {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) {
      throw new Error(`An error occurred: ${response.statusText}`);
    }
    const uniqueCategories = await response.json();
    return uniqueCategories;
  } catch (error) {
    console.error('Failed to fetch unique categories:', error);
    return [];
  }
}

export async function fetchSelectedProducts(id: string): Promise<ProductType> {
  try {
    // Assuming the API endpoint to fetch a product by ID is structured as /api/products/{id}
    const response = await fetch(`/api/products/${id}`);
    if (response.ok) {
      return await response.json();
    } else {
      console.error(`Failed to fetch product with ID ${id}:`, response.statusText);
      return defaultProduct; // Return defaultProduct if fetch fails
    }
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return defaultProduct; // Return defaultProduct in case of error
  }
}

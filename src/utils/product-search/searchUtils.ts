import { Product } from '../../../src/type/products/types';

// Function to fetch products from the mock data
export async function fetchProducts(): Promise<Product[]> {
  try {
    // In a real application, this would be an API call
    // For now, we'll use the mock data
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return mock data for demonstration purposes
    return getMockProducts();
  }
}

// Function to search products based on a query
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // In a real application, this would be an API call with the query parameter
    // For now, we'll filter the mock data
    const products = await fetchProducts();
    const searchTerm = query.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Mock products for testing
function getMockProducts(): Product[] {
  return [
    {
      id: '1',
      name: 'Smartphone X',
      description: 'Latest smartphone with advanced features',
      price: 999.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/300x200?text=Smartphone',
    },
    {
      id: '2',
      name: 'Laptop Pro',
      description: 'High-performance laptop for professionals',
      price: 1499.99,
      category: 'Electronics',
      image: 'https://via.placeholder.com/300x200?text=Laptop',
    },
    {
      id: '3',
      name: 'Wireless Headphones',
      description: 'Premium noise-cancelling headphones',
      price: 249.99,
      category: 'Audio',
      image: 'https://via.placeholder.com/300x200?text=Headphones',
    },
    {
      id: '4',
      name: 'Smart Watch',
      description: 'Fitness tracker and smartwatch',
      price: 199.99,
      category: 'Wearables',
      image: 'https://via.placeholder.com/300x200?text=SmartWatch',
    },
    {
      id: '5',
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with charging case',
      price: 129.99,
      category: 'Audio',
      image: 'https://via.placeholder.com/300x200?text=Earbuds',
    },
  ];
}

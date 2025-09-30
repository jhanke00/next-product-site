import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HomeView } from '@/app/view';
import { Product } from '@/src/type/products';

// Mock the ProductCard component
jest.mock('@/src/components/products/ProductCard', () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid={`product-card-${product.id}`}>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span>{product.category}</span>
    </div>
  ),
}));

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Aclonifen',
    price: 89.99,
    description: 'Active ingredients for pharmaceutical applications',
    category: 'Active Ingredients',
    rating: 4.8,
    numReviews: 124,
    countInStock: 50,
    imageUrl: '/media/bayer.png',
  },
  {
    id: 2,
    name: 'Herbicide Solution',
    price: 45.5,
    description: 'Effective herbicide for crop protection',
    category: 'Herbicides',
    rating: 4.2,
    numReviews: 89,
    countInStock: 30,
    imageUrl: '/media/herbicide.png',
  },
  {
    id: 3,
    name: 'Premium Chemical',
    price: 299.99,
    description: 'High-end pharmaceutical compound',
    category: 'Active Ingredients',
    rating: 4.9,
    numReviews: 45,
    countInStock: 10,
    imageUrl: '/media/premium.png',
  },
];

describe('HomeView', () => {
  it('renders without crashing', () => {
    render(<HomeView products={mockProducts} />);
    expect(screen.getByText('Products from A to Z')).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(<HomeView products={mockProducts} />);
    expect(screen.getByPlaceholderText('Search product...')).toBeInTheDocument();
  });

  it('displays all products initially', () => {
    render(<HomeView products={mockProducts} />);
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
  });

  it('shows empty state when no products match search', () => {
    render(<HomeView products={mockProducts} />);
    const searchInput = screen.getByPlaceholderText('Search product...');

    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No products found matching your search.')).toBeInTheDocument();
    expect(screen.getByText('Try different search terms.')).toBeInTheDocument();
  });

  it('handles empty products array', () => {
    render(<HomeView products={[]} />);
    expect(screen.getByText('No products found matching your search.')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import ProductCard from '@/src/components/molecules/ProductCard';
import { Product } from '@/src/type/products';

describe('ProductCard Component', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    description: 'This is a test product',
    category: 'Test Category',
    rating: 4.2,
    countInStock: 5,
    numReviews: 10,
  } as unknown as Product;

  it('renders product name, category, price, stock status, and description', () => {
    render(<ProductCard {...mockProduct} />);

    // Name
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();

    // Category badge
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();

    // Price
    expect(screen.getByText(/\$100\.00/)).toBeInTheDocument();

    // Stock status
    expect(screen.getByText(/In stock/)).toBeInTheDocument();

    // Description (slice to 500 chars)
    expect(screen.getByText(mockProduct.description.slice(0, 500))).toBeInTheDocument();

    // Reviews count
    expect(screen.getByText(`${mockProduct.numReviews} reviews`)).toBeInTheDocument();

    // Stars
    const stars = screen.getAllByRole('img', { hidden: true });
    expect(stars.length).toBe(5); // totalStars
  });

  it('renders "Out of stock" when countInStock is 0', () => {
    render(<ProductCard {...mockProduct} countInStock={0} />);

    expect(screen.getByText(/Out of stock/)).toBeInTheDocument();
    expect(screen.getByText(/Out of Stock/)).toBeInTheDocument(); // button
  });
});

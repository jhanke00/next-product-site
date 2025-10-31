import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProductsPage from '@/app/products/page';

// Mock next/navigation used by the page
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => ({ get: () => null, toString: () => '' }),
}));

describe('/products page', () => {
  const mockFetch = jest.fn();
  beforeEach(() => {
    mockFetch.mockReset();
    // @ts-ignore
    global.fetch = mockFetch;
  });

  it('renders product cards with star rating and category badge', async () => {
    const product = {
      id: 'p-1',
      name: 'Test Product',
      description: 'Desc',
      price: 123.45,
      rating: 4.5,
      category: 'Electronics',
      image: 'https://example.com/x.png',
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [product], total: 1, totalPages: 1, categories: ['Electronics'] }),
    });

    render(<ProductsPage />);

    // Card content appears
    await screen.findByText('Test Product');

    // Star rating component shows rating value
    expect(screen.getByText('(4.5)')).toBeInTheDocument();

    // Category badge appears (could be listed in filter and badge)
    const categoryMatches = screen.getAllByText('Electronics');
    expect(categoryMatches.length).toBeGreaterThan(0);
  });
});

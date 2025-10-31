// __tests__/NoProduct.test.tsx
import { render, screen } from '@testing-library/react';
import NoProduct from '@components/molecules/NoProducts';

describe('NoProduct Component', () => {
  it('renders heading, paragraph and icon', () => {
    render(<NoProduct />);

    // Check heading
    expect(screen.getByRole('heading', { name: /no products found/i })).toBeInTheDocument();

    // Check paragraph
    expect(screen.getByText(/we couldn'?t find any products matching your search/i)).toBeInTheDocument();

    // Check SVG icon exists
    expect(document.querySelector('svg')).toBeInTheDocument();
  });
});

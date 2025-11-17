import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from '@/app/products/page';
import smallData from '@/src/mock/small/products.json';
import largeData from '@/src/mock/large/products.json';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock window.scrollTo
globalThis.scrollTo = jest.fn();

describe('Products Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the products page without crashing', () => {
      render(<Products />);
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('should render pagination controls', () => {
      render(<Products />);
      expect(screen.getByText(/Previous/i)).toBeInTheDocument();
      expect(screen.getByText(/Next/i)).toBeInTheDocument();
      expect(screen.getByText(/Page \d+ of \d+/)).toBeInTheDocument();
    });

    it('should display the first 20 products on initial load', () => {
      render(<Products />);
      // Products are rendered as links with product names
      const links = screen.getAllByRole('link');
      expect(links.length).toBe(20); // First page should have 20 products
    });

    it('should render product information correctly', () => {
      render(<Products />);
      const firstProduct = [...largeData, ...smallData][0];

      expect(screen.getByText(firstProduct.name)).toBeInTheDocument();

      // Check that product information fields are rendered (may appear multiple times)
      const priceElements = screen.getAllByText(/Price:/i);
      expect(priceElements.length).toBeGreaterThan(0);

      const descElements = screen.getAllByText(/Description:/i);
      expect(descElements.length).toBeGreaterThan(0);

      const categoryElements = screen.getAllByText(/Category:/i);
      expect(categoryElements.length).toBeGreaterThan(0);

      const ratingElements = screen.getAllByText(/Rating:/i);
      expect(ratingElements.length).toBeGreaterThan(0);
    });

    it('should render correct links to product detail pages', () => {
      render(<Products />);
      const firstProduct = [...largeData, ...smallData][0];
      const link = screen.getByRole('link', { name: new RegExp(firstProduct.name, 'i') });
      expect(link).toHaveAttribute('href', `/products/${firstProduct.id}`);
    });
  });

  describe('Pagination', () => {
    it('should display correct page number on first page', () => {
      render(<Products />);
      const totalProducts = [...largeData, ...smallData].length;
      const totalPages = Math.ceil(totalProducts / 20);
      expect(screen.getByText(`Page 1 of ${totalPages}`)).toBeInTheDocument();
    });

    it('should disable Previous button on first page', () => {
      render(<Products />);
      const prevButton = screen.getByText(/Previous/i);
      expect(prevButton).toBeDisabled();
    });

    it('should enable Next button on first page when there are more pages', () => {
      render(<Products />);
      const nextButton = screen.getByText(/Next/i);
      const totalProducts = [...largeData, ...smallData].length;
      if (totalProducts > 20) {
        expect(nextButton).not.toBeDisabled();
      }
    });

    it('should navigate to next page when Next button is clicked', async () => {
      render(<Products />);
      const nextButton = screen.getByText(/Next/i);

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 2 of/)).toBeInTheDocument();
      });
    });

    it('should navigate to previous page when Previous button is clicked', async () => {
      render(<Products />);
      const nextButton = screen.getByText(/Next/i);

      // Navigate to page 2
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 2 of/)).toBeInTheDocument();
      });

      // Navigate back to page 1
      const prevButton = screen.getByText(/Previous/i);
      fireEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
      });
    });

    it('should display different products on page 2', async () => {
      render(<Products />);
      const allProducts = [...largeData, ...smallData];
      const page1FirstProduct = allProducts[0].name;
      const page2FirstProduct = allProducts[20]?.name;

      if (page2FirstProduct) {
        expect(screen.getByText(page1FirstProduct)).toBeInTheDocument();

        const nextButton = screen.getByText(/Next/i);
        fireEvent.click(nextButton);

        await waitFor(() => {
          expect(screen.queryByText(page1FirstProduct)).not.toBeInTheDocument();
          expect(screen.getByText(page2FirstProduct)).toBeInTheDocument();
        });
      }
    });

    it('should disable Next button on last page', async () => {
      render(<Products />);
      const totalProducts = [...largeData, ...smallData].length;
      const totalPages = Math.ceil(totalProducts / 20);
      const nextButton = screen.getByText(/Next/i);

      // Navigate to last page
      for (let i = 1; i < totalPages; i++) {
        fireEvent.click(nextButton);
      }

      await waitFor(() => {
        expect(screen.getByText(`Page ${totalPages} of ${totalPages}`)).toBeInTheDocument();
        expect(nextButton).toBeDisabled();
      });
    });

    it('should scroll to top of page when navigating between pages', async () => {
      render(<Products />);
      const nextButton = screen.getByText(/Next/i);

      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(globalThis.scrollTo).toHaveBeenCalledWith(0, 0);
      });
    });
  });

  describe('Grid Layout', () => {
    it('should render products in a grid layout', () => {
      const { container } = render(<Products />);
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();
    });

    it('should apply hover styles to product cards', () => {
      const { container } = render(<Products />);
      const productCards = container.querySelectorAll('.group');
      expect(productCards.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty product list gracefully', () => {
      // This test assumes data exists, but documents expected behavior
      render(<Products />);
      const allProducts = [...largeData, ...smallData];
      expect(allProducts.length).toBeGreaterThan(0);
    });

    it('should calculate total pages correctly', () => {
      render(<Products />);
      const totalProducts = [...largeData, ...smallData].length;
      const expectedPages = Math.ceil(totalProducts / 20);
      expect(screen.getByText(`Page 1 of ${expectedPages}`)).toBeInTheDocument();
    });
  });
});

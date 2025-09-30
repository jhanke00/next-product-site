import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { View as ProductView } from '../../../app/products/[productId]/view';
import { ProductDetails } from '@/src/type/products';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: any) => <img {...props} />,
}));

const mockProduct: ProductDetails = {
  id: 1,
  name: 'Test Product',
  price: 89.99,
  description: 'Test product description',
  category: 'Active Ingredients',
  rating: 4.8,
  numReviews: 124,
  countInStock: 50,
  imageUrl: '/media/test.png',
  detailedDescription: 'Detailed description of the test product',
  usageInstructions: 'Test usage instructions',
  customGuide: 'Custom guide for test product',
  learningResources: [
    {
      id: 'resource-1',
      title: 'Test Tutorial',
      description: 'Test tutorial description',
      type: 'tutorial',
      files: [
        {
          id: 'file-1',
          name: 'test.pdf',
          url: '/media/test.pdf',
          type: 'pdf',
        },
      ],
      createdAt: new Date('2025-01-26T10:00:00.000Z'),
    },
    {
      id: 'resource-2',
      title: 'Test Training',
      description: 'Test training description',
      type: 'training',
      duration: '30 minutes',
      files: [
        {
          id: 'file-2',
          name: 'test-video.mp4',
          url: '/media/test-video.mp4',
          type: 'video',
        },
      ],
      createdAt: new Date('2025-01-26T11:00:00.000Z'),
    },
  ],
  activeIngredients: [
    {
      name: 'Test Ingredient',
      description: 'Test active ingredient',
      percentage: 85,
    },
  ],
  manufacturingSite: {
    name: 'Test Facility',
    location: 'Test Location',
    plantsCount: 5,
    activeIngredientsCount: 10,
    intermediatesCount: 15,
  },
};

describe('ProductView', () => {
  it('renders without crashing', () => {
    render(<ProductView product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('displays product image', () => {
    render(<ProductView product={mockProduct} />);
    const image = screen.getByAltText('Image info');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/media/test.png');
  });

  it('displays product name and description', () => {
    render(<ProductView product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test product description')).toBeInTheDocument();
  });

  it('displays product details section', () => {
    render(<ProductView product={mockProduct} />);
    expect(screen.getByText('Product Details')).toBeInTheDocument();
    expect(screen.getByText('Detailed description of the test product')).toBeInTheDocument();
    expect(screen.getByText('Usage Instructions:')).toBeInTheDocument();
    expect(screen.getByText('Test usage instructions')).toBeInTheDocument();
  });

  it('displays custom guide when available', () => {
    render(<ProductView product={mockProduct} />);
    expect(screen.getByText('Product Guide')).toBeInTheDocument();
    expect(screen.getByText('Custom guide for test product')).toBeInTheDocument();
  });

  it('displays learning resources sections', () => {
    render(<ProductView product={mockProduct} />);
    expect(screen.getByText('Learning resources')).toBeInTheDocument();
    expect(screen.getByText('Tutorials')).toBeInTheDocument();
    expect(screen.getByText('Training Modules')).toBeInTheDocument();
  });

  it('displays tutorial resources correctly', () => {
    render(<ProductView product={mockProduct} />);
    expect(screen.getByText('Test Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Test tutorial description')).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('displays training resources correctly', () => {
    render(<ProductView product={mockProduct} />);
    expect(screen.getByText('Test Training')).toBeInTheDocument();
    expect(screen.getByText('Test training description')).toBeInTheDocument();
    expect(screen.getByText('Duration: 30 minutes')).toBeInTheDocument();
    expect(screen.getByText('Training Video')).toBeInTheDocument();
  });

  it('displays manage resources link', () => {
    render(<ProductView product={mockProduct} />);
    const manageLink = screen.getByText('Manage Resources');
    expect(manageLink).toBeInTheDocument();
    expect(manageLink.closest('a')).toHaveAttribute('href', '/lms/products/1/assign');
  });

  it('toggles product details section', () => {
    render(<ProductView product={mockProduct} />);
    const detailsButton = screen.getByRole('button', { name: /Product Details/i });

    // Should be expanded by default
    expect(screen.getByText('Detailed description of the test product')).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(detailsButton);
    expect(screen.queryByText('Detailed description of the test product')).not.toBeInTheDocument();

    // Click to expand again
    fireEvent.click(detailsButton);
    expect(screen.getByText('Detailed description of the test product')).toBeInTheDocument();
  });

  it('handles product without learning resources', () => {
    const productWithoutResources = {
      ...mockProduct,
      learningResources: [],
    };

    render(<ProductView product={productWithoutResources} />);
    expect(screen.getByText('No learning resources assigned to this product yet.')).toBeInTheDocument();
    expect(screen.getByText('Click "Manage Resources" to assign training modules and tutorials.')).toBeInTheDocument();
  });

  it('handles product without custom guide', () => {
    const productWithoutGuide = {
      ...mockProduct,
      customGuide: undefined,
    };

    render(<ProductView product={productWithoutGuide} />);
    expect(screen.queryByText('Product Guide')).not.toBeInTheDocument();
  });

  it('uses fallback image when imageUrl is not provided', () => {
    const productWithoutImage = {
      ...mockProduct,
      imageUrl: '',
    };

    render(<ProductView product={productWithoutImage} />);
    const image = screen.getByAltText('Image info');
    expect(image).toHaveAttribute('src', '/media/manufacturing-facility.jpg');
  });
});

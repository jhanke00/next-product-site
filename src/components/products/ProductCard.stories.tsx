import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProductCard } from './ProductCard';
import type { Product } from '@/src/type/products';

const meta = {
  title: 'Components/Products/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Product card component used on the homepage to display product information with image, rating, price, and stock status.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    product: {
      description: 'Product data object containing all product information',
    },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock product data
const mockProduct: Product = {
  id: 1,
  name: 'Aclonifen',
  price: 89.99,
  description: 'Active ingredients for pharmaceutical applications with high purity and quality standards.',
  category: 'Active Ingredients',
  rating: 4.8,
  numReviews: 124,
  countInStock: 50,
  imageUrl: '/media/bayer.png',
};

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const OutOfStock: Story = {
  args: {
    product: {
      ...mockProduct,
      countInStock: 0,
    },
  },
};

export const HighRating: Story = {
  args: {
    product: {
      ...mockProduct,
      rating: 5.0,
      numReviews: 342,
    },
  },
};

export const LowRating: Story = {
  args: {
    product: {
      ...mockProduct,
      rating: 2.1,
      numReviews: 12,
    },
  },
};

export const ExpensiveProduct: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Premium Chemical Compound',
      price: 299.99,
      category: 'Premium',
      description: 'High-end pharmaceutical compound with advanced molecular structure for specialized applications.',
    },
  },
};

export const LongDescription: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Complex Pharmaceutical Ingredient',
      description:
        'This is a very long description that demonstrates how the product card handles overflow text. It contains multiple sentences to test the line-clamp functionality and ensure proper text truncation works as expected in the UI.',
    },
  },
};

export const DifferentCategory: Story = {
  args: {
    product: {
      ...mockProduct,
      name: 'Herbicide Solution',
      category: 'Herbicides',
      price: 45.5,
      rating: 4.2,
      numReviews: 89,
      description: 'Effective herbicide solution for crop protection and weed management.',
    },
  },
};

export const NoImage: Story = {
  args: {
    product: {
      ...mockProduct,
      imageUrl: '', // This will fallback to default image
    },
  },
};

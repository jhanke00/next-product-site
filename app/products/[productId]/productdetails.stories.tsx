import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, expect, userEvent } from 'storybook/test';
import ProductDetails from './productdetails';
import type { Product } from '@/src/type/products';

// Mock product data for stories
const mockProduct: Product = {
  id: '22610dd1-00da-4a1a-aed9-3909eda1bf08',
  name: 'Handcrafted Frozen Tuna',
  price: 362,
  description: 'The Football Is Good For Training And Recreational Purposes',
  category: 'Electronics',
  rating: 3.4128976799547672,
  numReviews: 43,
  countInStock: 53,
  learningResources: [
    {
      productId: '22610dd1-00da-4a1a-aed9-3909eda1bf08',
      resourceId: 'resource-1',
      name: 'Product Tutorial',
      description: 'Learn how to use this product effectively',
      resourceURI: 'https://example.com/tutorial',
      popularityScore: 85,
    },
    {
      productId: '22610dd1-00da-4a1a-aed9-3909eda1bf08',
      resourceId: 'resource-2',
      name: 'Advanced Guide',
      description: 'Advanced tips and tricks',
      resourceURI: 'https://example.com/advanced',
      popularityScore: 70,
    },
  ],
};

const mockProductNoResources: Product = {
  id: '891ba5df-e496-43f8-88a6-7b28a3b77909',
  name: 'Incredible Fresh Pants',
  price: 252,
  description: 'The Football Is Good For Training And Recreational Purposes',
  category: 'Outdoors',
  rating: 0.0633403065148741,
  numReviews: 48,
  countInStock: 51,
  learningResources: [],
};

const meta = {
  title: 'Components/ProductDetails',
  component: ProductDetails,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ProductDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default story with learning resources
export const Default: Story = {
  args: mockProduct,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify product details are displayed
    await expect(canvas.getByText('Product Description')).toBeInTheDocument();
    await expect(canvas.getByText('Handcrafted Frozen Tuna')).toBeInTheDocument();
    await expect(canvas.getByText('Price: 362.00')).toBeInTheDocument();
    await expect(canvas.getByText('Category: Electronics')).toBeInTheDocument();
  },
};

// Story with learning resources expanded
export const WithLearningResourcesOpen: Story = {
  args: mockProduct,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the learning resources button
    const resourcesButton = canvas.getByText(/Learning Resources \(2\)/i);
    await userEvent.click(resourcesButton);

    // Verify the popout is displayed
    await expect(canvas.getByText('Learning Resources:')).toBeInTheDocument();
    await expect(canvas.getByText('Product Tutorial')).toBeInTheDocument();
    await expect(canvas.getByText('Advanced Guide')).toBeInTheDocument();
  },
};

// Story without learning resources
export const NoLearningResources: Story = {
  args: mockProductNoResources,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify the learning resources button shows (0)
    await expect(canvas.getByText(/Learning Resources \(0\)/i)).toBeInTheDocument();

    // Click to open and verify empty state
    const resourcesButton = canvas.getByText(/Learning Resources \(0\)/i);
    await userEvent.click(resourcesButton);

    await expect(canvas.getByText(/No resources yet\. Add one below!/i)).toBeInTheDocument();
  },
};

// Story showing the add resource dialog
export const AddResourceDialog: Story = {
  args: mockProduct,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open learning resources
    const resourcesButton = canvas.getByText(/Learning Resources \(2\)/i);
    await userEvent.click(resourcesButton);

    // Click add resource button
    const addButton = canvas.getByText('+ Add new learning resource');
    await userEvent.click(addButton);

    // Verify dialog is displayed
    await expect(canvas.getByText('Add New Learning Resource')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Name:')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Description:')).toBeInTheDocument();
    await expect(canvas.getByLabelText('URL:')).toBeInTheDocument();
  },
};

import type { Meta, StoryObj } from '@storybook/nextjs';
import { within, expect, userEvent } from 'storybook/test';
import Products from './page';

const meta = {
  title: 'Components/Products Page',
  component: Products,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Products>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const productNames = canvas.getAllByRole('heading', { level: 3 });
    await expect(productNames).toHaveLength(20);
  },
};

// Story testing pagination functionality
export const PaginationControls: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify initial page state
    await expect(canvas.getByText(/Page 1 of/i)).toBeInTheDocument();

    // Previous button should be disabled on first page
    const prevButton = canvas.getByText('Previous');
    await expect(prevButton).toBeDisabled();

    // Next button should be enabled
    const nextButton = canvas.getByText('Next');
    await expect(nextButton).not.toBeDisabled();
  },
};

// Story testing navigation to next page
export const NavigateToNextPage: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify we're on page 1
    await expect(canvas.getByText(/Page 1 of/i)).toBeInTheDocument();

    // Click next button
    const nextButton = canvas.getByText('Next');
    await userEvent.click(nextButton);

    // Verify we're now on page 2
    await expect(canvas.getByText(/Page 2 of/i)).toBeInTheDocument();

    // Previous button should now be enabled
    const prevButton = canvas.getByText('Previous');
    await expect(prevButton).not.toBeDisabled();
  },
};

// Story testing product links
export const ProductLinks: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Get all product cards
    const productNames = canvas.getAllByRole('heading', { level: 3 });
    await expect(productNames.length).toBeGreaterThan(0);

    // Verify each product has required information
    const firstProduct = productNames[0].closest('div');
    if (firstProduct) {
      await expect(within(firstProduct).getByText(/Price:/i)).toBeInTheDocument();
      await expect(within(firstProduct).getByText(/Description:/i)).toBeInTheDocument();
      await expect(within(firstProduct).getByText(/Category:/i)).toBeInTheDocument();
      await expect(within(firstProduct).getByText(/Rating:/i)).toBeInTheDocument();
      await expect(within(firstProduct).getByText(/Reviews:/i)).toBeInTheDocument();
      await expect(within(firstProduct).getByText(/Stock:/i)).toBeInTheDocument();
    }
  },
};

// Story testing the complete list displays correctly
export const DisplaysMultipleProducts: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verify we have exactly 20 products on the page (PAGE_SIZE)
    const productNames = canvas.getAllByRole('heading', { level: 3 });
    await expect(productNames).toHaveLength(20);

    // Verify pagination info is present
    await expect(canvas.getByText(/Page \d+ of \d+/i)).toBeInTheDocument();
  },
};

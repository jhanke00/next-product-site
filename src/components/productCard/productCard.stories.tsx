import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import largeData from '@/src/mock/large/products.json';
import smallData from '@/src/mock/small/products.json';
import { ProductCard } from './productCard';

const mockData = [...largeData, ...smallData];

const meta = {
  title: 'Components/Product Card',
  component: ProductCard,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    product: mockData[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const productNames = canvas.getAllByRole('heading', { level: 3 });
    await expect(productNames).toHaveLength(5);
  },
};

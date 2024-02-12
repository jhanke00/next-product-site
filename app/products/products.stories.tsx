import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
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
    await expect(productNames).toHaveLength(5);
  },
};

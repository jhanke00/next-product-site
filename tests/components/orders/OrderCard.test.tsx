import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import OrderCard from '@/src/components/orders/OrderCard';
import { formatDate } from '@/src/utils/date';
import { mockLargeOrders } from '@/tests/mocks/orders';

jest.mock('@/src/utils/date', () => ({
  formatDate: jest.fn(),
}));

describe('OrderCard Component', () => {
  const mockOrder = mockLargeOrders[0];

  beforeEach(() => {
    // Mock the formatDate function to control its output
    (formatDate as jest.Mock).mockReturnValue('May 15, 2025, 09:12 AM');
  });

  test('renders the correct formatted date and total for the order', () => {
    render(<OrderCard order={mockOrder} />);

    const dateElement = screen.getByText('May 15, 2025, 09:12 AM');
    expect(dateElement).toBeInTheDocument();

    const totalElement = screen.getByText(`Total: $${mockOrder.total}`);
    expect(totalElement).toBeInTheDocument();
  });

  test('renders items in the order', () => {
    render(<OrderCard order={mockOrder} />);

    // Check for the first item
    const firstItem = mockOrder.items[0];
    expect(screen.getByText(firstItem.name)).toBeInTheDocument();
    expect(screen.getByText(`Price: $${firstItem.price}`)).toBeInTheDocument();
    expect(screen.getByText(`Quantity: ${firstItem.count}`)).toBeInTheDocument();

    // Check for the second item
    const secondItem = mockOrder.items[1];
    expect(screen.getByText(secondItem.name)).toBeInTheDocument();
    expect(screen.getByText(`Price: $${secondItem.price}`)).toBeInTheDocument();
    expect(screen.getByText(`Quantity: ${secondItem.count}`)).toBeInTheDocument();
  });
});

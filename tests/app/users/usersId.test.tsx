import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import UserInfo from '@/app/users/[userId]/page';
import { getUsers } from '@/src/utils/users/get-users';
import { getOrders } from '@/src/utils/orders/get-orders';
import { mockLargeUsers } from '@/tests/mocks/users';
import { mockLargeOrders } from '@/tests/mocks/orders';

jest.mock('@/src/utils/users/get-users', () => ({
  getUsers: jest.fn(),
}));

jest.mock('@/src/utils/orders/get-orders', () => ({
  getOrders: jest.fn(),
}));

jest.mock('@/src/components/BackToTop', () => {
  const MockBackToTop = () => <div data-testid='back-to-top'>Back To Top</div>;
  MockBackToTop.displayName = 'MockBackToTop';
  return MockBackToTop;
});

jest.mock('@/src/components/orders/OrderCard', () => ({
  __esModule: true,
  default: ({ order }: { order: any }) => <div data-testid='order-card'>{order.id}</div>,
}));

describe('UserInfo Route', () => {
  const mockUsers = mockLargeUsers;
  const mockOrders = mockLargeOrders;

  beforeEach(() => {
    (getUsers as jest.Mock).mockReturnValue(mockUsers);
    (getOrders as jest.Mock).mockReturnValue(mockOrders);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders user information and their orders when the user exists', () => {
    const user = mockUsers[0];

    render(<UserInfo params={{ userId: user.id }} />);

    expect(screen.getByText(`${user.firstName} ${user.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(`Phone: ${user.phoneNumber}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${user.email}`)).toBeInTheDocument();
    expect(screen.getByText('$8874')).toBeInTheDocument();

    const orderCards = screen.getAllByTestId('order-card');
    expect(orderCards).toHaveLength(2);

    expect(screen.getByText('← Back to Users')).toHaveAttribute('href', '/users');
    expect(screen.getByTestId('back-to-top')).toBeInTheDocument();
  });

  it("renders 'User not Found' message when the user does not exist", () => {
    (getUsers as jest.Mock).mockReturnValue([]);
    render(<UserInfo params={{ userId: 'unknown' }} />);

    expect(screen.getByText('User not Found')).toBeInTheDocument();
    expect(screen.queryByText('Total Amount Spent')).not.toBeInTheDocument();
    expect(screen.queryByTestId('order-card')).not.toBeInTheDocument();
  });
});

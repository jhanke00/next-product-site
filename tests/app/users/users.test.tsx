import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Users from '@/app/users/page';
import { getUsers } from '@/src/utils/users/get-users';
import smallData from '@/src/mock/large/users.json';

jest.mock('@/src/utils/users/get-users', () => ({
  getUsers: jest.fn(),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('Users Route', () => {
  const mockUsers = smallData.slice(0, 100);

  beforeEach(() => {
    (getUsers as jest.Mock).mockReturnValue(mockUsers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct number of UserCard components for the current page', () => {
    render(<Users searchParams={{ page: '1' }} />);

    // Check that the PAGE_SIZE (40) of UserCard components are rendered for page 1
    const userCards = screen.getAllByRole('heading', { level: 3 });
    expect(userCards).toHaveLength(40);
  });

  it('disables the Previous button on the first page', () => {
    render(<Users searchParams={{ page: '1' }} />);

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables the Next button when on the last page', () => {
    // There are 100 users and 40 items per page, so totalPages = 3
    render(<Users searchParams={{ page: '3' }} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('enables the Previous and Next buttons on intermediate pages', () => {
    render(<Users searchParams={{ page: '2' }} />);

    const prevButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('displays the correct page and total pages information', () => {
    render(<Users searchParams={{ page: '2' }} />);

    const pageInfo = screen.getByText('Page 2 of 3');
    expect(pageInfo).toBeInTheDocument();
  });

  it('navigates to the correct pages when Previous or Next buttons are clicked', () => {
    render(<Users searchParams={{ page: '2' }} />);

    const prevButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');

    expect(prevButton.closest('a')).toHaveAttribute('href', '?page=1');
    expect(nextButton.closest('a')).toHaveAttribute('href', '?page=3');
  });
});

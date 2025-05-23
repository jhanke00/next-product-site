import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For better assertions like .toBeInTheDocument
import UserCard from '@/src/components/users/UserCard';
import { mockLargeUsers } from '@/tests/mocks/users';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

describe('UserCard Component', () => {
  const mockUser = mockLargeUsers[0];

  it('displays the user information', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText(`${mockUser.firstName} ${mockUser.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(`Phone: ${mockUser.phoneNumber}`)).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
  });

  it('renders the correct link', () => {
    render(<UserCard user={mockUser} />);
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', `/users/${mockUser.id}`);
  });

  it('has the correct styles for the container', () => {
    const { container } = render(<UserCard user={mockUser} />);
    expect(container.firstChild).toHaveClass('group');
    expect(container.firstChild).toHaveClass('rounded-lg');
  });
});

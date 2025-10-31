import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AuthBar from '@/src/components/AuthBar';

// Mock next/navigation hooks used by AuthBar
jest.mock('next/navigation', () => ({
  usePathname: () => '/products',
  useSearchParams: () => ({ toString: () => 'category=Clothing' }),
}));

describe('AuthBar', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    // @ts-ignore
    global.fetch = mockFetch;
  });

  it('shows Login when unauthenticated and includes returnTo in href', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ authenticated: false }) });
    render(<AuthBar />);

    const loginLink = await screen.findByText('Login');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', expect.stringContaining('/login?returnTo='));
    expect(loginLink).toHaveAttribute(
      'href',
      expect.stringContaining(encodeURIComponent('/products?category=Clothing'))
    );

    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows Login when auth check returns non-OK', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    render(<AuthBar />);
    const loginLink = await screen.findByText('Login');
    expect(loginLink).toBeInTheDocument();
  });

  it('shows Login when auth check throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network'));
    render(<AuthBar />);
    const loginLink = await screen.findByText('Login');
    expect(loginLink).toBeInTheDocument();
  });

  it('switches to Logout after auth-change event', async () => {
    // First call: unauthenticated
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({ authenticated: false }) });
    render(<AuthBar />);
    await screen.findByText('Login');

    // Next calls after auth-change: authenticated
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ authenticated: true, user: { id: 'u-1', email: 'x@test.com', name: 'X' } }),
    });

    // Dispatch auth-change event
    window.dispatchEvent(new Event('auth-change'));

    await waitFor(() => expect(screen.getByText('Logout')).toBeInTheDocument());
  });

  it('logs out and shows Login when clicking Logout', async () => {
    // Start authenticated
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: true, user: { id: 'u-1', email: 'x@test.com', name: 'X' } }),
    });

    render(<AuthBar />);
    await screen.findByText('Logout');

    // Logout request
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    screen.getByText('Logout').click();

    await waitFor(() => expect(screen.getByText('Login')).toBeInTheDocument());
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', expect.objectContaining({ method: 'POST' }));
  });
});

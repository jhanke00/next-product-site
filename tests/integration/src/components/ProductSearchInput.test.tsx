import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductSearch from '@components/molecules/ProductSearchInput';

describe('ProductSearch Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers(); // Use fake timers for debounce
    mockOnSearch.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders input and search icon', () => {
    render(<ProductSearch keyword='' onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/search products/i);
    expect(input).toBeInTheDocument();

    const searchIcon = screen.getByRole('img', { hidden: true });
    expect(searchIcon).toBeInTheDocument();
  });

  it('updates input value and triggers debounced search', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<ProductSearch keyword='' onSearch={mockOnSearch} debounceDelay={300} />);
    const input = screen.getByPlaceholderText(/search products/i);

    await user.type(input, 'hello');

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('hello');
    });

    expect(input).toHaveValue('hello');
  });

  it('triggers search with trimmed value', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<ProductSearch keyword='' onSearch={mockOnSearch} debounceDelay={300} />);
    const input = screen.getByPlaceholderText(/search products/i);

    await user.type(input, '   phone   ');

    jest.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('phone');
    });
  });

  it('renders and works with clear button', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    render(<ProductSearch keyword='tablet' onSearch={mockOnSearch} showClearButton />);

    const input = screen.getByPlaceholderText(/search products/i);
    expect(input).toHaveValue('tablet');

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);

    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductDetails from '@/app/products/[productId]/productdetails';
import type { Product, ProductResource } from '@/src/type/products';

// Mock fetch globally
globalThis.fetch = jest.fn();

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: jest.fn(() => '550e8400-e29b-41d4-a716-446655440000'),
  },
});

// Mock HTMLDialogElement methods
HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
  this.open = true;
});
HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
  this.open = false;
});

describe('ProductDetails Component', () => {
  const mockResources: ProductResource[] = [
    {
      productId: '1',
      resourceId: 'resource-1',
      name: 'Getting Started Guide',
      description: 'A beginner guide',
      resourceURI: 'https://example.com/guide',
      popularityScore: 90,
    },
    {
      productId: '1',
      resourceId: 'resource-2',
      name: 'Advanced Tutorial',
      description: 'An advanced tutorial',
      resourceURI: 'https://example.com/tutorial',
      popularityScore: 75,
    },
  ];

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    description: 'Test description',
    category: 'Electronics',
    rating: 4.5,
    numReviews: 100,
    countInStock: 10,
    learningResources: mockResources,
  };

  const mockProductNoResources: Product = {
    ...mockProduct,
    learningResources: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (globalThis.fetch as jest.Mock).mockClear();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Product Information Display', () => {
    it('should render product details correctly', () => {
      render(<ProductDetails {...mockProduct} />);

      expect(screen.getByText('Product Description')).toBeInTheDocument();
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      expect(screen.getByText(`Price: ${mockProduct.price}`)).toBeInTheDocument();
      expect(screen.getByText(`Description: ${mockProduct.description}`)).toBeInTheDocument();
      expect(screen.getByText(`Category: ${mockProduct.category}`)).toBeInTheDocument();
      expect(screen.getByText(`Rating: ${mockProduct.rating}`)).toBeInTheDocument();
      expect(screen.getByText(`Reviews: ${mockProduct.numReviews}`)).toBeInTheDocument();
      expect(screen.getByText(`Stock: ${mockProduct.countInStock}`)).toBeInTheDocument();
    });

    it('should display learning resources count button', () => {
      render(<ProductDetails {...mockProduct} />);
      expect(screen.getByText('Learning Resources (2)')).toBeInTheDocument();
    });
  });

  describe('Learning Resources Popout', () => {
    it('should toggle learning resources popout when button is clicked', () => {
      render(<ProductDetails {...mockProduct} />);
      const toggleButton = screen.getByText('Learning Resources (2)');

      expect(screen.queryByText('Learning Resources:')).not.toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.getByText('Learning Resources:')).toBeInTheDocument();

      fireEvent.click(toggleButton);
      expect(screen.queryByText('Learning Resources:')).not.toBeInTheDocument();
    });

    it('should close popout when X button is clicked', () => {
      render(<ProductDetails {...mockProduct} />);
      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      expect(screen.getByText('Learning Resources:')).toBeInTheDocument();

      const closeButtons = screen.getAllByText('✕');
      const closeButton = closeButtons.find((button) => button.className.includes('text-gray-500'));
      fireEvent.click(closeButton!);

      expect(screen.queryByText('Learning Resources:')).not.toBeInTheDocument();
    });

    it('should display learning resources sorted by popularity score', () => {
      render(<ProductDetails {...mockProduct} />);
      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const links = screen.getAllByRole('link');
      expect(links[0]).toHaveTextContent('Getting Started Guide');
      expect(links[1]).toHaveTextContent('Advanced Tutorial');
    });

    it('should render resource links with correct href', () => {
      render(<ProductDetails {...mockProduct} />);
      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const link = screen.getByRole('link', { name: 'Getting Started Guide' });
      expect(link).toHaveAttribute('href', 'https://example.com/guide');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('should display message when no resources exist', () => {
      render(<ProductDetails {...mockProductNoResources} />);
      const toggleButton = screen.getByText('Learning Resources (0)');
      fireEvent.click(toggleButton);

      expect(screen.getByText(/No resources yet. Add one below!/i)).toBeInTheDocument();
    });
  });

  describe('Fetch Learning Resources', () => {
    it('should fetch learning resources on mount', async () => {
      const mockResponse = {
        data: mockResources,
      };
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/learning/product/1');
      });
    });

    it('should handle fetch error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      (globalThis.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
      });

      consoleErrorSpy.mockRestore();
    });

    it('should refresh resources when refresh button is clicked', async () => {
      const mockResponse = {
        data: mockResources,
      };
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const refreshButton = screen.getByTitle('Refresh learning resources');
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/learning/product/1');
      });
    });
  });

  describe('Add Learning Resource Dialog', () => {
    it('should open dialog when add button is clicked', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResources }),
      });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const addButton = screen.getByText('+ Add new learning resource');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add New Learning Resource')).toBeInTheDocument();
      });
    });

    it('should have required form fields in dialog', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResources }),
      });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const addButton = screen.getByText('+ Add new learning resource');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
      });
      expect(screen.getByLabelText(/Description:/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/URL:/i)).toBeInTheDocument();
    });

    it('should close dialog when cancel button is clicked', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResources }),
      });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const addButton = screen.getByText('+ Add new learning resource');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add New Learning Resource')).toBeInTheDocument();
      });

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('open');

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(dialog).not.toHaveAttribute('open');
      });
    });

    it('should submit form and add new resource', async () => {
      const user = userEvent.setup();
      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockResources }),
        })
        .mockResolvedValueOnce({ ok: true });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const addButton = screen.getByText('+ Add new learning resource');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add New Learning Resource')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/Name:/i);
      const descInput = screen.getByLabelText(/Description:/i);
      const urlInput = screen.getByLabelText(/URL:/i);

      await user.type(nameInput, 'New Resource');
      await user.type(descInput, 'New Description');
      await user.type(urlInput, 'https://example.com/new');

      const submitButton = screen.getByText('Add Resource');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/learning', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('New Resource'),
        });
      });
    });

    it('should handle add resource error', async () => {
      const user = userEvent.setup();
      const alertSpy = jest.spyOn(globalThis, 'alert').mockImplementation();
      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: mockResources }),
        })
        .mockResolvedValueOnce({ ok: false });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const addButton = screen.getByText('+ Add new learning resource');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('Add New Learning Resource')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/Name:/i);
      const urlInput = screen.getByLabelText(/URL:/i);

      await user.type(nameInput, 'New Resource');
      await user.type(urlInput, 'https://example.com/new');

      const submitButton = screen.getByText('Add Resource');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to add resource. Please try again.');
      });

      alertSpy.mockRestore();
    });
  });

  describe('Delete Learning Resource', () => {
    it('should call delete API when delete button is clicked', async () => {
      const mockFetchResponse = {
        data: mockResources,
      };
      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockFetchResponse })
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [mockResources[1]] }) });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/learning/product/1');
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const deleteButtons = screen.getAllByTitle('Delete resource');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/learning/resource-1', { method: 'DELETE' });
      });
    });

    it('should handle delete error', async () => {
      const alertSpy = jest.spyOn(globalThis, 'alert').mockImplementation();
      const mockFetchResponse = {
        data: mockResources,
      };

      (globalThis.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: true, json: async () => mockFetchResponse })
        .mockResolvedValueOnce({ ok: false });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalledWith('/api/learning/product/1');
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const deleteButtons = screen.getAllByTitle('Delete resource');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Failed to delete resource. Please try again.');
      });

      alertSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria labels and roles', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResources }),
      });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const addButton = screen.getByText('+ Add new learning resource');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('should have accessible form labels', async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResources }),
      });

      render(<ProductDetails {...mockProduct} />);

      await waitFor(() => {
        expect(globalThis.fetch).toHaveBeenCalled();
      });

      const toggleButton = screen.getByText('Learning Resources (2)');
      fireEvent.click(toggleButton);

      const addButton = screen.getByText('+ Add new learning resource');
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText(/Name:/i);
      const descInput = screen.getByLabelText(/Description:/i);
      const urlInput = screen.getByLabelText(/URL:/i);

      expect(nameInput).toBeRequired();
      expect(urlInput).toBeRequired();
      expect(descInput).not.toBeRequired();
    });
  });
});

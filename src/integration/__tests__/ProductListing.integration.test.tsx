import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithProviders, userEvent, mockProducts, mockCategories, screen, waitFor } from '@/test/test-utils';
import ProductListing from '@/pages/ProductListing';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock fetch
global.fetch = vi.fn();

describe('ProductListing Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    (global.fetch as ReturnType<typeof vi.fn>).mockImplementation((url: string) => {
      if (url.includes('/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProducts),
      });
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should display loading state initially', () => {
    renderWithProviders(<ProductListing />);
    
    // Loading spinner should be shown
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('should display products after loading', async () => {
    renderWithProviders(<ProductListing />, {
      preloadedState: {
        products: {
          items: mockProducts,
          categories: mockCategories,
          status: 'succeeded',
          error: null,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
      expect(screen.getByText('Test Product 3')).toBeInTheDocument();
    });
  });

  it('should filter products by search', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    
    renderWithProviders(<ProductListing />, {
      preloadedState: {
        products: {
          items: mockProducts,
          categories: mockCategories,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'Product 1');
    
    await vi.advanceTimersByTimeAsync(300);

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Product 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Product 3')).not.toBeInTheDocument();
    });
  });

  it('should show product count', async () => {
    renderWithProviders(<ProductListing />, {
      preloadedState: {
        products: {
          items: mockProducts,
          categories: mockCategories,
          status: 'succeeded',
          error: null,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/3 products/i)).toBeInTheDocument();
    });
  });

  it('should display error state', () => {
    renderWithProviders(<ProductListing />, {
      preloadedState: {
        products: {
          items: [],
          categories: [],
          status: 'failed',
          error: 'Failed to fetch products',
        },
      },
    });

    expect(screen.getByText('Error loading products')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
  });

  it('should show no products message when filtered results are empty', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    
    renderWithProviders(<ProductListing />, {
      preloadedState: {
        products: {
          items: mockProducts,
          categories: mockCategories,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'nonexistent product xyz');
    
    await vi.advanceTimersByTimeAsync(300);

    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
  });

  it('should allow adding products to favorites', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    
    const { store } = renderWithProviders(<ProductListing />, {
      preloadedState: {
        products: {
          items: mockProducts,
          categories: mockCategories,
          status: 'succeeded',
          error: null,
        },
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    // Click the first favorite button
    const favoriteButtons = screen.getAllByRole('button');
    await user.click(favoriteButtons[0]);

    expect(store.getState().favorites.items).toHaveLength(1);
  });
});

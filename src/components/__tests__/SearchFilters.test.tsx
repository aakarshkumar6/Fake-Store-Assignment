import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderWithProviders, userEvent, mockCategories, screen, waitFor } from '@/test/test-utils';
import { SearchFilters } from '../SearchFilters';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('SearchFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render search input', () => {
    renderWithProviders(<SearchFilters />);
    
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('should render category and sort selects', () => {
    renderWithProviders(<SearchFilters />, {
      preloadedState: {
        products: {
          items: [],
          categories: mockCategories,
          status: 'succeeded',
          error: null,
        },
      },
    });

    expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /sort/i })).toBeInTheDocument();
  });

  it('should update search query with debounce', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { store } = renderWithProviders(<SearchFilters />);

    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'laptop');

    // Before debounce completes
    expect(store.getState().filters.searchQuery).toBe('');

    // After debounce
    await vi.advanceTimersByTimeAsync(300);
    
    await waitFor(() => {
      expect(store.getState().filters.searchQuery).toBe('laptop');
    });
  });

  it('should clear search input when X button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithProviders(<SearchFilters />);

    const searchInput = screen.getByPlaceholderText('Search products...');
    await user.type(searchInput, 'test');

    // Find and click the clear button
    const clearButton = screen.getByRole('button');
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
  });

  it('should show clear all button when filters are active', async () => {
    renderWithProviders(<SearchFilters />, {
      preloadedState: {
        filters: {
          searchQuery: 'test',
          selectedCategory: '',
          sortBy: 'default',
        },
        products: {
          items: [],
          categories: [],
          status: 'succeeded',
          error: null,
        },
      },
    });

    expect(screen.getByText('Active filters:')).toBeInTheDocument();
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('should not show clear all button when no filters are active', () => {
    renderWithProviders(<SearchFilters />);

    expect(screen.queryByText('Active filters:')).not.toBeInTheDocument();
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();
  });

  it('should reset all filters when clear all is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { store } = renderWithProviders(<SearchFilters />, {
      preloadedState: {
        filters: {
          searchQuery: 'test',
          selectedCategory: 'electronics',
          sortBy: 'price-asc',
        },
        products: {
          items: [],
          categories: mockCategories,
          status: 'succeeded',
          error: null,
        },
      },
    });

    const clearAllButton = screen.getByText('Clear all');
    await user.click(clearAllButton);

    await vi.advanceTimersByTimeAsync(300);

    await waitFor(() => {
      const state = store.getState().filters;
      expect(state.searchQuery).toBe('');
      expect(state.selectedCategory).toBe('');
      expect(state.sortBy).toBe('default');
    });
  });
});

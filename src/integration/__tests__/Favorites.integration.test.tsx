import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent, mockProducts, screen, waitFor } from '@/test/test-utils';
import Favorites from '@/pages/Favorites';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('Favorites Integration', () => {
  it('should display empty state when no favorites', () => {
    renderWithProviders(<Favorites />);

    expect(screen.getByText('No favorites yet')).toBeInTheDocument();
    expect(screen.getByText(/Start exploring our products and save your favorites/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse products/i })).toBeInTheDocument();
  });

  it('should display favorite products', () => {
    renderWithProviders(<Favorites />, {
      preloadedState: {
        favorites: {
          items: [mockProducts[0], mockProducts[1]],
        },
      },
    });

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
  });

  it('should show correct favorite count', () => {
    renderWithProviders(<Favorites />, {
      preloadedState: {
        favorites: {
          items: [mockProducts[0], mockProducts[1]],
        },
      },
    });

    expect(screen.getByText(/You have 2 items saved/i)).toBeInTheDocument();
  });

  it('should remove product from favorites when button is clicked', async () => {
    const user = userEvent.setup();
    
    const { store } = renderWithProviders(<Favorites />, {
      preloadedState: {
        favorites: {
          items: [mockProducts[0]],
        },
      },
    });

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();

    // Click the remove button (heart icon)
    const removeButton = screen.getByRole('button');
    await user.click(removeButton);

    // Product should be removed from favorites
    expect(store.getState().favorites.items).toHaveLength(0);
  });

  it('should show empty state after removing last favorite', async () => {
    const user = userEvent.setup();
    
    renderWithProviders(<Favorites />, {
      preloadedState: {
        favorites: {
          items: [mockProducts[0]],
        },
      },
    });

    const removeButton = screen.getByRole('button');
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.getByText('No favorites yet')).toBeInTheDocument();
    });
  });

  it('should link to product detail page', () => {
    renderWithProviders(<Favorites />, {
      preloadedState: {
        favorites: {
          items: [mockProducts[0]],
        },
      },
    });

    const productLink = screen.getByRole('link', { name: /test product 1/i });
    expect(productLink).toHaveAttribute('href', `/product/${mockProducts[0].id}`);
  });

  it('should show singular form when only 1 favorite', () => {
    renderWithProviders(<Favorites />, {
      preloadedState: {
        favorites: {
          items: [mockProducts[0]],
        },
      },
    });

    expect(screen.getByText(/You have 1 item saved/i)).toBeInTheDocument();
  });
});

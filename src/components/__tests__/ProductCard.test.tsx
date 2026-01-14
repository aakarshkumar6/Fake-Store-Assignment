import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, userEvent, mockProducts, screen } from '@/test/test-utils';
import { ProductCard } from '../ProductCard';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, onClick, ...props }: any) => (
      <button onClick={onClick} {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

describe('ProductCard', () => {
  const product = mockProducts[0];

  it('should render product information correctly', () => {
    renderWithProviders(<ProductCard product={product} />);

    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
    expect(screen.getByText(product.category)).toBeInTheDocument();
    expect(screen.getByText(product.rating.rate.toString())).toBeInTheDocument();
    expect(screen.getByText(`(${product.rating.count})`)).toBeInTheDocument();
  });

  it('should render product image with correct alt text', () => {
    renderWithProviders(<ProductCard product={product} />);

    const image = screen.getByAltText(product.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', product.image);
  });

  it('should link to product detail page', () => {
    renderWithProviders(<ProductCard product={product} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/product/${product.id}`);
  });

  it('should toggle favorite when heart button is clicked', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ProductCard product={product} />);

    const heartButton = screen.getByRole('button');
    await user.click(heartButton);

    const state = store.getState();
    expect(state.favorites.items).toHaveLength(1);
    expect(state.favorites.items[0].id).toBe(product.id);
  });

  it('should show filled heart when product is favorited', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={product} />, {
      preloadedState: {
        favorites: { items: [product] },
      },
    });

    // Check that the heart has fill-current class (indicating it's favorited)
    const heartIcon = screen.getByRole('button').querySelector('svg');
    expect(heartIcon).toHaveClass('fill-current');
  });

  it('should remove from favorites when clicked again', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ProductCard product={product} />, {
      preloadedState: {
        favorites: { items: [product] },
      },
    });

    const heartButton = screen.getByRole('button');
    await user.click(heartButton);

    const state = store.getState();
    expect(state.favorites.items).toHaveLength(0);
  });

  it('should prevent navigation when clicking favorite button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={product} />);

    const heartButton = screen.getByRole('button');
    
    // The button click shouldn't trigger navigation
    await user.click(heartButton);
    
    // We're still on the same page (no navigation occurred)
    expect(window.location.pathname).toBe('/');
  });
});

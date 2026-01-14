import React, { PropsWithChildren } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { screen, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '@/store/slices/productsSlice';
import favoritesReducer from '@/store/slices/favoritesSlice';
import filtersReducer from '@/store/slices/filtersSlice';
import type { Product } from '@/types/product';

// Create a test store with optional preloaded state
export function createTestStore(preloadedState?: {
  products?: {
    items: Product[];
    categories: string[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  favorites?: {
    items: Product[];
  };
  filters?: {
    searchQuery: string;
    selectedCategory: string;
    sortBy: 'default' | 'price-asc' | 'price-desc';
  };
}) {
  return configureStore({
    reducer: {
      products: productsReducer,
      favorites: favoritesReducer,
      filters: filtersReducer,
    },
    preloadedState,
  });
}

// Mock product data for testing
export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 29.99,
    description: 'A test product description',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 49.99,
    description: 'Another test product',
    category: 'jewelery',
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: { rate: 3.8, count: 85 },
  },
  {
    id: 3,
    title: 'Test Product 3',
    price: 19.99,
    description: 'Third test product',
    category: 'electronics',
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.2, count: 200 },
  },
];

export const mockCategories = ['electronics', 'jewelery', "men's clothing", "women's clothing"];

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Parameters<typeof createTestStore>[0];
  store?: ReturnType<typeof createTestStore>;
}

// Custom render function with providers
export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<{}>): React.JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything
export { screen, waitFor, within, userEvent };
export { render } from '@testing-library/react';

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useFilteredProducts } from '../useFilteredProducts';
import { createTestStore, mockProducts } from '@/test/test-utils';
import { setSearchQuery, setSelectedCategory, setSortBy } from '@/store/slices/filtersSlice';
import { PropsWithChildren } from 'react';

describe('useFilteredProducts', () => {
  const createWrapper = (preloadedState?: Parameters<typeof createTestStore>[0]) => {
    const store = createTestStore(preloadedState);
    return {
      store,
      wrapper: ({ children }: PropsWithChildren<{}>) => (
        <Provider store={store}>{children}</Provider>
      ),
    };
  };

  it('should return all products when no filters applied', () => {
    const { wrapper } = createWrapper({
      products: {
        items: mockProducts,
        categories: [],
        status: 'succeeded',
        error: null,
      },
    });

    const { result } = renderHook(() => useFilteredProducts(), { wrapper });
    expect(result.current).toHaveLength(3);
  });

  it('should filter products by search query', () => {
    const { store, wrapper } = createWrapper({
      products: {
        items: mockProducts,
        categories: [],
        status: 'succeeded',
        error: null,
      },
      filters: {
        searchQuery: 'Product 1',
        selectedCategory: '',
        sortBy: 'default',
      },
    });

    const { result } = renderHook(() => useFilteredProducts(), { wrapper });
    expect(result.current).toHaveLength(1);
    expect(result.current[0].title).toBe('Test Product 1');
  });

  it('should filter products by category', () => {
    const { wrapper } = createWrapper({
      products: {
        items: mockProducts,
        categories: ['electronics', 'jewelery'],
        status: 'succeeded',
        error: null,
      },
      filters: {
        searchQuery: '',
        selectedCategory: 'electronics',
        sortBy: 'default',
      },
    });

    const { result } = renderHook(() => useFilteredProducts(), { wrapper });
    expect(result.current).toHaveLength(2);
    expect(result.current.every(p => p.category === 'electronics')).toBe(true);
  });

  it('should sort products by price ascending', () => {
    const { wrapper } = createWrapper({
      products: {
        items: mockProducts,
        categories: [],
        status: 'succeeded',
        error: null,
      },
      filters: {
        searchQuery: '',
        selectedCategory: '',
        sortBy: 'price-asc',
      },
    });

    const { result } = renderHook(() => useFilteredProducts(), { wrapper });
    expect(result.current[0].price).toBe(19.99);
    expect(result.current[1].price).toBe(29.99);
    expect(result.current[2].price).toBe(49.99);
  });

  it('should sort products by price descending', () => {
    const { wrapper } = createWrapper({
      products: {
        items: mockProducts,
        categories: [],
        status: 'succeeded',
        error: null,
      },
      filters: {
        searchQuery: '',
        selectedCategory: '',
        sortBy: 'price-desc',
      },
    });

    const { result } = renderHook(() => useFilteredProducts(), { wrapper });
    expect(result.current[0].price).toBe(49.99);
    expect(result.current[1].price).toBe(29.99);
    expect(result.current[2].price).toBe(19.99);
  });

  it('should combine search and category filters', () => {
    const { wrapper } = createWrapper({
      products: {
        items: mockProducts,
        categories: [],
        status: 'succeeded',
        error: null,
      },
      filters: {
        searchQuery: 'Product',
        selectedCategory: 'electronics',
        sortBy: 'default',
      },
    });

    const { result } = renderHook(() => useFilteredProducts(), { wrapper });
    expect(result.current).toHaveLength(2);
    expect(result.current.every(p => p.category === 'electronics')).toBe(true);
  });

  it('should return empty array when no products match filters', () => {
    const { wrapper } = createWrapper({
      products: {
        items: mockProducts,
        categories: [],
        status: 'succeeded',
        error: null,
      },
      filters: {
        searchQuery: 'nonexistent',
        selectedCategory: '',
        sortBy: 'default',
      },
    });

    const { result } = renderHook(() => useFilteredProducts(), { wrapper });
    expect(result.current).toHaveLength(0);
  });

  it('should be case insensitive when searching', () => {
    const { wrapper } = createWrapper({
      products: {
        items: mockProducts,
        categories: [],
        status: 'succeeded',
        error: null,
      },
      filters: {
        searchQuery: 'TEST PRODUCT',
        selectedCategory: '',
        sortBy: 'default',
      },
    });

    const { result } = renderHook(() => useFilteredProducts(), { wrapper });
    expect(result.current).toHaveLength(3);
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore, UnknownAction } from '@reduxjs/toolkit';
import productsReducer, {
  fetchProducts,
  fetchCategories,
  selectAllProducts,
  selectProductById,
  selectCategories,
  selectProductsStatus,
  selectProductsError,
} from '../productsSlice';
import { mockProducts, mockCategories } from '@/test/test-utils';

// Mock fetch
global.fetch = vi.fn();

type AppStore = ReturnType<typeof configureStore<{ products: ReturnType<typeof productsReducer> }>>;

describe('productsSlice', () => {
  let store: AppStore;

  beforeEach(() => {
    store = configureStore({
      reducer: { products: productsReducer },
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };
      expect(state.products.items).toEqual([]);
      expect(state.products.categories).toEqual([]);
      expect(state.products.status).toBe('idle');
      expect(state.products.error).toBeNull();
    });
  });

  describe('fetchProducts async thunk', () => {
    it('should set status to loading when fetching', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      store.dispatch(fetchProducts());
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };
      expect(state.products.status).toBe('loading');
    });

    it('should fetch products successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });

      await store.dispatch(fetchProducts());
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };

      expect(state.products.status).toBe('succeeded');
      expect(state.products.items).toEqual(mockProducts);
      expect(state.products.error).toBeNull();
    });

    it('should handle fetch failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await store.dispatch(fetchProducts());
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };

      expect(state.products.status).toBe('failed');
      expect(state.products.error).toBe('Failed to fetch products');
    });

    it('should handle network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await store.dispatch(fetchProducts());
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };

      expect(state.products.status).toBe('failed');
      expect(state.products.error).toBe('Network error');
    });
  });

  describe('fetchCategories async thunk', () => {
    it('should fetch categories successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
      });

      await store.dispatch(fetchCategories());
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };

      expect(state.products.categories).toEqual(mockCategories);
    });

    it('should handle categories fetch failure', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
      });

      await store.dispatch(fetchCategories());
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };

      // Categories fetch failure doesn't update error state in current implementation
      expect(state.products.categories).toEqual([]);
    });
  });

  describe('selectors', () => {
    beforeEach(async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProducts,
      });
      await store.dispatch(fetchProducts());
    });

    it('selectAllProducts should return all products', () => {
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };
      expect(selectAllProducts(state)).toEqual(mockProducts);
    });

    it('selectProductById should return correct product', () => {
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };
      expect(selectProductById(state, 1)).toEqual(mockProducts[0]);
      expect(selectProductById(state, 999)).toBeUndefined();
    });

    it('selectProductsStatus should return current status', () => {
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };
      expect(selectProductsStatus(state)).toBe('succeeded');
    });

    it('selectProductsError should return error state', () => {
      const state = store.getState() as { products: ReturnType<typeof productsReducer> };
      expect(selectProductsError(state)).toBeNull();
    });
  });
});

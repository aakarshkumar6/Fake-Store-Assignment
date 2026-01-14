import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import filtersReducer, {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  resetFilters,
  selectSearchQuery,
  selectSelectedCategory,
  selectSortBy,
} from '../filtersSlice';

describe('filtersSlice', () => {
  const createStore = () =>
    configureStore({
      reducer: { filters: filtersReducer },
    });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = createStore();
      const state = store.getState();

      expect(state.filters.searchQuery).toBe('');
      expect(state.filters.selectedCategory).toBe('');
      expect(state.filters.sortBy).toBe('default');
    });
  });

  describe('setSearchQuery', () => {
    it('should update search query', () => {
      const store = createStore();
      store.dispatch(setSearchQuery('test query'));

      const state = store.getState();
      expect(state.filters.searchQuery).toBe('test query');
    });

    it('should handle empty search query', () => {
      const store = createStore();
      store.dispatch(setSearchQuery('test'));
      store.dispatch(setSearchQuery(''));

      const state = store.getState();
      expect(state.filters.searchQuery).toBe('');
    });
  });

  describe('setSelectedCategory', () => {
    it('should update selected category', () => {
      const store = createStore();
      store.dispatch(setSelectedCategory('electronics'));

      const state = store.getState();
      expect(state.filters.selectedCategory).toBe('electronics');
    });

    it('should clear category when set to empty', () => {
      const store = createStore();
      store.dispatch(setSelectedCategory('electronics'));
      store.dispatch(setSelectedCategory(''));

      const state = store.getState();
      expect(state.filters.selectedCategory).toBe('');
    });
  });

  describe('setSortBy', () => {
    it('should update sort option to price-asc', () => {
      const store = createStore();
      store.dispatch(setSortBy('price-asc'));

      const state = store.getState();
      expect(state.filters.sortBy).toBe('price-asc');
    });

    it('should update sort option to price-desc', () => {
      const store = createStore();
      store.dispatch(setSortBy('price-desc'));

      const state = store.getState();
      expect(state.filters.sortBy).toBe('price-desc');
    });

    it('should reset to default', () => {
      const store = createStore();
      store.dispatch(setSortBy('price-asc'));
      store.dispatch(setSortBy('default'));

      const state = store.getState();
      expect(state.filters.sortBy).toBe('default');
    });
  });

  describe('resetFilters', () => {
    it('should reset all filters to initial state', () => {
      const store = createStore();
      
      // Set some filters
      store.dispatch(setSearchQuery('test'));
      store.dispatch(setSelectedCategory('electronics'));
      store.dispatch(setSortBy('price-asc'));

      // Reset
      store.dispatch(resetFilters());

      const state = store.getState();
      expect(state.filters.searchQuery).toBe('');
      expect(state.filters.selectedCategory).toBe('');
      expect(state.filters.sortBy).toBe('default');
    });
  });

  describe('selectors', () => {
    it('selectSearchQuery should return search query', () => {
      const store = createStore();
      store.dispatch(setSearchQuery('laptop'));

      expect(selectSearchQuery(store.getState())).toBe('laptop');
    });

    it('selectSelectedCategory should return selected category', () => {
      const store = createStore();
      store.dispatch(setSelectedCategory('jewelery'));

      expect(selectSelectedCategory(store.getState())).toBe('jewelery');
    });

    it('selectSortBy should return sort option', () => {
      const store = createStore();
      store.dispatch(setSortBy('price-desc'));

      expect(selectSortBy(store.getState())).toBe('price-desc');
    });
  });
});

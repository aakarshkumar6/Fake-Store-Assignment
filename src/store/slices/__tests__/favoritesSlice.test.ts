import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer, {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  selectFavorites,
  selectIsFavorite,
  selectFavoritesCount,
} from '../favoritesSlice';
import { mockProducts } from '@/test/test-utils';

describe('favoritesSlice', () => {
  const createStore = () =>
    configureStore({
      reducer: { favorites: favoritesReducer },
    });

  describe('initial state', () => {
    it('should have empty items array', () => {
      const store = createStore();
      const state = store.getState();
      expect(state.favorites.items).toEqual([]);
    });
  });

  describe('addToFavorites', () => {
    it('should add a product to favorites', () => {
      const store = createStore();
      store.dispatch(addToFavorites(mockProducts[0]));

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
      expect(state.favorites.items[0]).toEqual(mockProducts[0]);
    });

    it('should not add duplicate products', () => {
      const store = createStore();
      store.dispatch(addToFavorites(mockProducts[0]));
      store.dispatch(addToFavorites(mockProducts[0]));

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
    });

    it('should add multiple different products', () => {
      const store = createStore();
      store.dispatch(addToFavorites(mockProducts[0]));
      store.dispatch(addToFavorites(mockProducts[1]));

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(2);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a product from favorites by id', () => {
      const store = createStore();
      store.dispatch(addToFavorites(mockProducts[0]));
      store.dispatch(addToFavorites(mockProducts[1]));
      store.dispatch(removeFromFavorites(mockProducts[0].id));

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
      expect(state.favorites.items[0].id).toBe(mockProducts[1].id);
    });

    it('should handle removing non-existent product', () => {
      const store = createStore();
      store.dispatch(addToFavorites(mockProducts[0]));
      store.dispatch(removeFromFavorites(999));

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
    });
  });

  describe('toggleFavorite', () => {
    it('should add product if not in favorites', () => {
      const store = createStore();
      store.dispatch(toggleFavorite(mockProducts[0]));

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
      expect(state.favorites.items[0]).toEqual(mockProducts[0]);
    });

    it('should remove product if already in favorites', () => {
      const store = createStore();
      store.dispatch(toggleFavorite(mockProducts[0]));
      store.dispatch(toggleFavorite(mockProducts[0]));

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(0);
    });

    it('should toggle correctly with multiple products', () => {
      const store = createStore();
      store.dispatch(toggleFavorite(mockProducts[0]));
      store.dispatch(toggleFavorite(mockProducts[1]));
      store.dispatch(toggleFavorite(mockProducts[0])); // Remove first

      const state = store.getState();
      expect(state.favorites.items).toHaveLength(1);
      expect(state.favorites.items[0].id).toBe(mockProducts[1].id);
    });
  });

  describe('selectors', () => {
    it('selectFavorites should return all favorites', () => {
      const store = createStore();
      store.dispatch(addToFavorites(mockProducts[0]));
      store.dispatch(addToFavorites(mockProducts[1]));

      expect(selectFavorites(store.getState())).toHaveLength(2);
    });

    it('selectIsFavorite should return true for favorited products', () => {
      const store = createStore();
      store.dispatch(addToFavorites(mockProducts[0]));

      expect(selectIsFavorite(store.getState(), mockProducts[0].id)).toBe(true);
      expect(selectIsFavorite(store.getState(), mockProducts[1].id)).toBe(false);
    });

    it('selectFavoritesCount should return correct count', () => {
      const store = createStore();
      expect(selectFavoritesCount(store.getState())).toBe(0);

      store.dispatch(addToFavorites(mockProducts[0]));
      expect(selectFavoritesCount(store.getState())).toBe(1);

      store.dispatch(addToFavorites(mockProducts[1]));
      expect(selectFavoritesCount(store.getState())).toBe(2);
    });
  });
});

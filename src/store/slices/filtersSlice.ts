import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SortOption } from '@/types/product';

interface FiltersState {
  searchQuery: string;
  selectedCategory: string;
  sortBy: SortOption;
}

const initialState: FiltersState = {
  searchQuery: '',
  selectedCategory: '',
  sortBy: 'default',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.sortBy = 'default';
    },
  },
});

export const { setSearchQuery, setSelectedCategory, setSortBy, resetFilters } = filtersSlice.actions;

export default filtersSlice.reducer;

// Selectors
export const selectSearchQuery = (state: { filters: FiltersState }) => state.filters.searchQuery;
export const selectSelectedCategory = (state: { filters: FiltersState }) => state.filters.selectedCategory;
export const selectSortBy = (state: { filters: FiltersState }) => state.filters.sortBy;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Product } from '@/types/product';

interface ProductsState {
  items: Product[];
  categories: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  categories: [],
  status: 'idle',
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json() as Promise<Product[]>;
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    return response.json() as Promise<string[]>;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export default productsSlice.reducer;

// Selectors
export const selectAllProducts = (state: { products: ProductsState }) => state.products.items;
export const selectProductById = (state: { products: ProductsState }, productId: number) =>
  state.products.items.find((product) => product.id === productId);
export const selectCategories = (state: { products: ProductsState }) => state.products.categories;
export const selectProductsStatus = (state: { products: ProductsState }) => state.products.status;
export const selectProductsError = (state: { products: ProductsState }) => state.products.error;

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectAllProducts } from '@/store/slices/productsSlice';
import { selectSearchQuery, selectSelectedCategory, selectSortBy } from '@/store/slices/filtersSlice';
import type { Product } from '@/types/product';

export function useFilteredProducts(): Product[] {
  const products = useAppSelector(selectAllProducts);
  const searchQuery = useAppSelector(selectSearchQuery);
  const selectedCategory = useAppSelector(selectSelectedCategory);
  const sortBy = useAppSelector(selectSortBy);

  return useMemo(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);
}

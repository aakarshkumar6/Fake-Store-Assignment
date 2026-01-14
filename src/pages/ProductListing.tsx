import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, fetchCategories, selectProductsStatus, selectProductsError } from '@/store/slices/productsSlice';
import { useFilteredProducts } from '@/hooks/useFilteredProducts';
import { SearchFilters } from '@/components/SearchFilters';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductGridSkeleton } from '@/components/LoadingSpinner';

const ProductListing = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectProductsStatus);
  const error = useAppSelector(selectProductsError);
  const filteredProducts = useFilteredProducts();

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  return (
    <div className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-primary/5 to-transparent py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Discover Products
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse our curated collection of premium products
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SearchFilters />
          </motion.div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container">
          {status === 'loading' && <ProductGridSkeleton />}
          
          {status === 'failed' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="mb-2 text-lg font-medium text-foreground">Something went wrong</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <button
                onClick={() => dispatch(fetchProducts())}
                className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Try again
              </button>
            </motion.div>
          )}

          {status === 'succeeded' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredProducts.length}</span> products
                </p>
              </div>
              <ProductGrid products={filteredProducts} />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductListing;

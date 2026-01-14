import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { selectFavorites } from '@/store/slices/favoritesSlice';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';

const Favorites = () => {
  const favorites = useAppSelector(selectFavorites);

  return (
    <div className="min-h-screen">
      <section className="border-b bg-gradient-to-b from-favorite/5 to-transparent py-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-favorite/10">
              <Heart className="h-8 w-8 text-favorite" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Your Favorites
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              {favorites.length > 0
                ? `You have ${favorites.length} item${favorites.length === 1 ? '' : 's'} saved`
                : 'Save products you love for later'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-medium text-foreground">No favorites yet</h3>
              <p className="mb-6 max-w-md text-muted-foreground">
                Start exploring our products and save your favorites by clicking the heart icon
              </p>
              <Link to="/">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Browse Products
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ProductGrid products={favorites} />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favorites;

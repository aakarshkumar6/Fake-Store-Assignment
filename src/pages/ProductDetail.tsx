import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts, selectProductById, selectProductsStatus } from '@/store/slices/productsSlice';
import { toggleFavorite, selectIsFavorite } from '@/store/slices/favoritesSlice';
import { Button } from '@/components/ui/button';
import { ProductCardSkeleton } from '@/components/LoadingSpinner';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const productId = parseInt(id || '0', 10);
  const product = useAppSelector((state) => selectProductById(state, productId));
  const status = useAppSelector(selectProductsStatus);
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, productId));

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === 'loading') {
    return (
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-secondary/50" />
          <div className="space-y-6">
            <div className="h-8 w-32 animate-pulse rounded-full bg-secondary/50" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-secondary/50" />
            <div className="h-6 w-24 animate-pulse rounded bg-secondary/50" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-secondary/50" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary/50" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-secondary/50" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <span className="text-2xl">🔍</span>
          </div>
          <h3 className="mb-2 text-lg font-medium text-foreground">Product not found</h3>
          <p className="mb-4 text-sm text-muted-foreground">The product you're looking for doesn't exist</p>
          <Link to="/">
            <Button variant="default">Back to Products</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </motion.button>

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border bg-card p-8"
          >
            <div className="absolute right-4 top-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => dispatch(toggleFavorite(product))}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                  isFavorite
                    ? "bg-favorite text-favorite-foreground"
                    : "bg-secondary text-muted-foreground hover:bg-favorite/10 hover:text-favorite"
                )}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
              </motion.button>
            </div>
            <img
              src={product.image}
              alt={product.title}
              className="mx-auto h-80 w-80 object-contain"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col"
          >
            <span className="mb-3 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-sm font-medium capitalize text-secondary-foreground">
              {product.category}
            </span>

            <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
              {product.title}
            </h1>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-5 w-5",
                      i < Math.floor(product.rating.rate)
                        ? "fill-warning text-warning"
                        : "text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            <p className="mb-8 leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-auto space-y-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => dispatch(toggleFavorite(product))}
                  variant={isFavorite ? "default" : "outline"}
                  size="lg"
                  className={cn(
                    "flex-1 gap-2",
                    isFavorite && "bg-favorite hover:bg-favorite/90"
                  )}
                >
                  {isFavorite ? (
                    <>
                      <Check className="h-5 w-5" />
                      Added to Favorites
                    </>
                  ) : (
                    <>
                      <Heart className="h-5 w-5" />
                      Add to Favorites
                    </>
                  )}
                </Button>
              </div>

              <div className="rounded-lg border bg-secondary/30 p-4">
                <h3 className="mb-2 text-sm font-medium text-foreground">Product Details</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>Category: <span className="capitalize text-foreground">{product.category}</span></li>
                  <li>Rating: <span className="text-foreground">{product.rating.rate} / 5</span></li>
                  <li>Reviews: <span className="text-foreground">{product.rating.count}</span></li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

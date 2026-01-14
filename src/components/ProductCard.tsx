import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite, selectIsFavorite } from '@/store/slices/favoritesSlice';
import type { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsFavorite(state, product.id));

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
          <div className="absolute right-3 top-3 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleFavoriteClick}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                isFavorite
                  ? "bg-favorite text-favorite-foreground"
                  : "bg-card/80 text-muted-foreground backdrop-blur-sm hover:bg-favorite/10 hover:text-favorite"
              )}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
            </motion.button>
          </div>

          <div className="aspect-square overflow-hidden bg-secondary/30 p-6">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <div className="p-4">
            <span className="mb-2 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize text-secondary-foreground">
              {product.category}
            </span>
            <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-tight text-foreground group-hover:text-primary">
              {product.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span>{product.rating.rate}</span>
                <span className="text-xs">({product.rating.count})</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

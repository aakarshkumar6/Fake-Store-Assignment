import { motion } from 'framer-motion';

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-12 w-12 rounded-full border-4 border-secondary border-t-primary"
      />
      <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="aspect-square animate-pulse bg-secondary/50" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-20 animate-pulse rounded-full bg-secondary/50" />
        <div className="h-4 w-full animate-pulse rounded bg-secondary/50" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-secondary/50" />
        <div className="flex items-center justify-between">
          <div className="h-6 w-16 animate-pulse rounded bg-secondary/50" />
          <div className="h-4 w-12 animate-pulse rounded bg-secondary/50" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

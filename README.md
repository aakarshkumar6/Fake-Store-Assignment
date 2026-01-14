# Product Dashboard - Frontend Developer Assignment

A modern, responsive product dashboard built with React, Redux Toolkit, and TypeScript. This application demonstrates proficiency in building modern frontend applications with clean architecture, state management, and responsive design.


## ✨ Features

- **Product Listing Page**: Responsive grid layout displaying product cards with images, prices, and ratings
- **Search & Filter**: 
  - Debounced search by product title (300ms delay)
  - Filter by category (Electronics, Jewelery, Men's Clothing, Women's Clothing)
  - Sort by price (Low to High, High to Low)
- **Product Detail Page**: Complete product information with add to favorites functionality
- **Favorites Page**: View and manage favorited products stored in Redux
- **Responsive Design**: Mobile-first approach with smooth Framer Motion animations
- **State Management**: Redux Toolkit with async thunks and selectors

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 18 | UI library with functional components and hooks |
| Redux Toolkit | State management with slices, thunks, and selectors |
| TypeScript | Type safety and better developer experience |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Smooth animations |
| React Router | Client-side routing |
| Vite | Fast build tool |
| shadcn/ui | UI component library |

## 📦 Installation

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm**, **yarn**, or **bun** package manager

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git https://github.com/aakarshkumar6/Fake-Store-Assignment.git
   cd Fake-Store-Assignment
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using bun
   bun install
   ```

3. **Start the development server**
   ```bash
   # Using npm
   npm run dev

   # Using yarn
   yarn dev

   # Using bun
   bun dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:8080`

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components (shadcn/ui)
│   ├── Header.tsx           # Navigation header with favorites count
│   ├── ProductCard.tsx      # Individual product card component
│   ├── ProductGrid.tsx      # Responsive product grid layout
│   ├── SearchFilters.tsx    # Search and filter controls
│   └── LoadingSpinner.tsx   # Loading states and skeletons
├── hooks/                   # Custom React hooks
│   ├── useDebounce.ts       # Debounce hook for search input
│   └── useFilteredProducts.ts # Memoized filtered products hook
├── pages/                   # Page components
│   ├── ProductListing.tsx   # Main product listing page
│   ├── ProductDetail.tsx    # Single product detail view
│   ├── Favorites.tsx        # Favorites page
│   └── NotFound.tsx         # 404 page
├── store/                   # Redux store configuration
│   ├── store.ts             # Store setup with reducers
│   ├── hooks.ts             # Typed useDispatch and useSelector hooks
│   └── slices/              # Redux slices
│       ├── productsSlice.ts # Products state with async thunks
│       ├── favoritesSlice.ts# Favorites state management
│       └── filtersSlice.ts  # Search/filter/sort state
├── types/                   # TypeScript type definitions
│   └── product.ts           # Product interface
├── lib/                     # Utility functions
│   └── utils.ts             # Common utilities
├── App.tsx                  # Root component with routing
├── main.tsx                 # Application entry point
└── index.css                # Global styles & design system tokens
```

## 🔑 Key Implementation Details

### Redux State Management

The application uses Redux Toolkit with three slices:

```typescript
// Store structure
{
  products: {
    items: Product[],
    categories: string[],
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null
  },
  favorites: {
    items: Product[]
  },
  filters: {
    searchQuery: string,
    selectedCategory: string,
    sortBy: 'default' | 'price-asc' | 'price-desc'
  }
}
```

### API Integration

Products are fetched from the [Fake Store API](https://fakestoreapi.com):
- `GET /products` - Fetch all products
- `GET /products/categories` - Fetch available categories

### Debounced Search

Search input uses a custom debounce hook to prevent excessive re-renders:

```typescript
const [localSearch, setLocalSearch] = useState('');
const debouncedSearch = useDebounce(localSearch, 300);

useEffect(() => {
  dispatch(setSearchQuery(debouncedSearch));
}, [debouncedSearch, dispatch]);
```

### Responsive Grid Layout

The product grid adapts to different screen sizes:
- **Mobile** (< 640px): 1 column
- **Tablet** (640px - 1024px): 2 columns
- **Desktop** (1024px - 1280px): 3 columns
- **Large Desktop** (> 1280px): 4 columns

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 5173 |
| `npm run build` | Create production build in `dist/` folder |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## 🧪 Testing

This project includes comprehensive unit and integration tests.

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage
```

Tests cover Redux slices, custom hooks, components, and integration flows.


## 📄 Environment Variables

No environment variables are required for this project. The Fake Store API is a public API that doesn't require authentication.

## 🎨 Design System

The application uses a custom design system with:
- **Colors**: Warm neutral tones with orange accent (#EA580C)
- **Typography**: Inter (body) + Playfair Display (headings)
- **Animations**: Smooth transitions with Framer Motion
- **Components**: Built on shadcn/ui with custom styling

---

Built with ❤️ using React, Redux Toolkit, and Tailwind CSS

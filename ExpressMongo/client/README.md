# Products Frontend - React + Redux

A modern React frontend for the Products API with filtering, sorting, searching, and pagination.

## Features

✅ **Product Display** - Grid layout with product cards  
✅ **Search** - Real-time search across product names and descriptions  
✅ **Category Filter** - Filter products by category  
✅ **Price Sorting** - Sort by price (low to high / high to low)  
✅ **Pagination** - Navigate through pages of products  
✅ **Redux State Management** - Centralized state with Redux Toolkit  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Loading States** - Spinner while fetching data  
✅ **Error Handling** - Graceful error messages with retry  

## Tech Stack

- **React 18** - UI framework
- **Redux Toolkit** - State management
- **Axios** - HTTP requests
- **CSS3** - Styling with modern features

## Setup Instructions

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Make Sure Backend is Running

The backend API must be running on `http://localhost:3000`. If you haven't started it:

```bash
# In your backend directory
npm start
```

### 3. Start the React App

```bash
# In the client directory
npm start
```

The app will open at `http://localhost:3001` (or the next available port if 3000 is taken).

## Project Structure

```
client/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── App.js               # Main App component
│   ├── App.css              # App styles
│   ├── index.js             # Entry point
│   ├── index.css            # Global styles
│   ├── store.js             # Redux store configuration
│   ├── productsSlice.js     # Redux slice for products
│   ├── ProductList.js       # Main products list component
│   ├── ProductList.css      # ProductList styles
│   ├── ProductCard.js       # Individual product card
│   └── ProductCard.css      # ProductCard styles
└── package.json
```

## Redux Architecture

### Store Structure

```javascript
{
  products: {
    items: [],              // Array of product objects
    loading: false,         // Loading state
    error: null,            // Error message if any
    currentPage: 1,         // Current page number
    totalPages: 1,          // Total number of pages
    totalProducts: 0,       // Total product count
    hasNextPage: false,     // Whether there's a next page
    hasPrevPage: false,     // Whether there's a previous page
    filters: {
      category: '',         // Selected category
      priceSort: '',        // Price sort order
      searchQuery: ''       // Search query
    }
  }
}
```

### Actions

- `fetchProducts` - Async thunk to fetch products from API
- `setCategory` - Set category filter
- `setPriceSort` - Set price sort order
- `setSearchQuery` - Set search query
- `setPage` - Change page number
- `clearFilters` - Reset all filters

## Components

### ProductList

Main component that displays:
- Search input
- Category and price filters
- Grid of product cards
- Pagination controls
- Active filters display
- Loading and error states

### ProductCard

Displays individual product with:
- Product image placeholder
- Product name
- Description (truncated)
- Category badge
- Review count
- Price
- "View Details" button (ready for future implementation)

## API Integration

The app connects to your backend API with these endpoints:

- `GET /products` - Fetch products with optional query params:
  - `page` - Page number
  - `category` - Filter by category
  - `price` - Sort order (lowest/highest)
  - `query` - Search term

Example API call:
```
GET /products?page=1&category=tools&price=lowest&query=drill
```

## Features in Detail

### Search
- Real-time search as you type
- Searches product name and description
- Case-insensitive
- Resets to page 1 when searching

### Filtering
- Category dropdown with common categories
- Can be combined with search and sort
- Clear indication of active filters

### Sorting
- Price: Low to High
- Price: High to Low
- Can be combined with search and filters

### Pagination
- Shows current page and total pages
- Previous/Next buttons
- Clickable page numbers
- Smart page number display (shows ellipsis for many pages)
- Disabled state for unavailable navigation

### State Management
- All filters stored in Redux
- Automatic API refetch when filters change
- Consistent state across the app

## Customization

### Adding More Categories

Edit `ProductList.js` and add options to the category select:

```javascript
<select id="category" ...>
  <option value="">All Categories</option>
  <option value="your-category">Your Category</option>
</select>
```

### Changing Products Per Page

The API returns 10 products per page by default. To change this, modify the backend API.

### Styling

All styles are in separate CSS files:
- `App.css` - Global app styles
- `ProductList.css` - List and filter styles
- `ProductCard.css` - Individual card styles

## Responsive Breakpoints

- **Desktop**: Full layout with multi-column grid
- **Tablet** (≤768px): Adjusted grid, stacked filters
- **Mobile** (≤480px): Single column, optimized spacing

## Future Enhancements (Not Implemented Yet)

- Product detail page
- Add to cart functionality
- Reviews display
- User authentication
- Wishlist
- Product images (currently using placeholder)
- Advanced filters (price range, ratings)

## Troubleshooting

### "Failed to fetch" error
- Make sure backend is running on port 3000
- Check CORS settings in backend
- Verify the proxy setting in package.json

### Products not loading
- Open browser console for errors
- Check Redux DevTools (if installed)
- Verify API is responding: `curl http://localhost:3000/products`

### Styling issues
- Clear browser cache
- Check for CSS syntax errors
- Verify all CSS files are imported

## Testing the App

1. **Search**: Type "hammer" in search box
2. **Filter**: Select "tools" category
3. **Sort**: Choose "Price: Low to High"
4. **Combine**: Try search + category + sort together
5. **Pagination**: Add more products and test pagination
6. **Clear Filters**: Click "Clear Filters" button

## Development Tips

- Use Redux DevTools extension for debugging state
- Check Network tab in browser DevTools for API calls
- React DevTools for component inspection
- Console.log in reducers to debug state changes

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `build/` folder ready for deployment.

## Contact

Questions about the frontend? Check the code comments or Redux DevTools for state inspection.
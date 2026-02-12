import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch products from API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, category = '', price = '', query = '' }) => {
    const params = new URLSearchParams();
    params.append('page', page);
    if (category) params.append('category', category);
    if (price) params.append('price', price);
    if (query) params.append('query', query);
    
    const response = await axios.get(`/products?${params.toString()}`);
    return response.data;
  }
);

// Async thunk to fetch categories from API
export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    const response = await axios.get('/categories');
    return response.data;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    filters: {
      category: '',
      priceSort: '',
      searchQuery: ''
    }
  },
  reducers: {
    setCategory: (state, action) => {
      state.filters.category = action.payload;
      state.currentPage = 1; // Reset to page 1 when filtering
    },
    setPriceSort: (state, action) => {
      state.filters.priceSort = action.payload;
      state.currentPage = 1; // Reset to page 1 when sorting
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
      state.currentPage = 1; // Reset to page 1 when searching
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        category: '',
        priceSort: '',
        searchQuery: ''
      };
      state.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalProducts;
        state.hasNextPage = action.payload.hasNextPage;
        state.hasPrevPage = action.payload.hasPrevPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setCategory, setPriceSort, setSearchQuery, setPage, clearFilters } = productsSlice.actions;

export default productsSlice.reducer;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchCategories,
  setCategory,
  setPriceSort,
  setSearchQuery,
  setPage,
  clearFilters
} from './productsSlice';
import ProductCard from './ProductCard';
import './ProductList.css';

function ProductList() {
  const dispatch = useDispatch();
  const {
    items,
    categories,
    loading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    hasNextPage,
    hasPrevPage,
    filters
  } = useSelector((state) => state.products);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products whenever filters or page changes
  useEffect(() => {
    dispatch(fetchProducts({
      page: currentPage,
      category: filters.category,
      price: filters.priceSort,
      query: filters.searchQuery
    }));
  }, [dispatch, currentPage, filters]);

  const handleCategoryChange = (e) => {
    dispatch(setCategory(e.target.value));
  }; 

  const handlePriceSortChange = (e) => {
    dispatch(setPriceSort(e.target.value));
  };

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      dispatch(setPage(currentPage - 1));
    }
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      dispatch(setPage(currentPage + 1));
    }
  };

  const handlePageClick = (pageNum) => {
    dispatch(setPage(pageNum));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="product-list-container">
      <header className="header">
        <h1>Products</h1>
        <p className="subtitle">Browse our collection of {totalProducts} products</p>
      </header>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select
              id="category"
              value={filters.category}
              onChange={handleCategoryChange}
              className="filter-select"
            >
              <option value="">Sort by Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="price">Sort by Price:</label>
            <select
              id="price"
              value={filters.priceSort}
              onChange={handlePriceSortChange}
              className="filter-select"
            >
              <option value="">Default</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
            </select>
          </div>

          <button onClick={handleClearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>

        {/* Active Filters Display */}
        {(filters.category || filters.priceSort || filters.searchQuery) && (
          <div className="active-filters">
            <span className="active-filters-label">Active filters:</span>
            {filters.searchQuery && (
              <span className="filter-tag">Search: "{filters.searchQuery}"</span>
            )}
            {filters.category && (
              <span className="filter-tag">Category: {filters.category}</span>
            )}
            {filters.priceSort && (
              <span className="filter-tag">
                Sort: {filters.priceSort === 'lowest' ? 'Low to High' : 'High to Low'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error">
          <p>Error loading products: {error}</p>
          <button onClick={() => dispatch(fetchProducts({ page: 1 }))} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && (
        <>
          {items.length === 0 ? (
            <div className="no-products">
              <p>No products found.</p>
              {(filters.category || filters.priceSort || filters.searchQuery) && (
                <button onClick={handleClearFilters} className="clear-filters-btn">
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="products-grid">
                {items.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={!hasPrevPage}
                    className="pagination-btn"
                  >
                    Previous
                  </button>

                  <div className="page-numbers">
                    {currentPage > 3 && (
                      <>
                        <button onClick={() => handlePageClick(1)} className="page-btn">
                          1
                        </button>
                        {currentPage > 4 && <span className="ellipsis">...</span>}
                      </>
                    )}

                    {getPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageClick(pageNum)}
                        className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="ellipsis">...</span>}
                        <button onClick={() => handlePageClick(totalPages)} className="page-btn">
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Results Info */}
              <div className="results-info">
                Showing {items.length} of {totalProducts} products
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList; 
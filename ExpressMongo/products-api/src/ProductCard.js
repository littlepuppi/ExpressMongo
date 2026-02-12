import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-placeholder">
        <span className="product-icon">📦</span>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <p className="product-description">
          {product.description || 'No description available'}
        </p>
        
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <span className="product-reviews">
            ⭐ {product.reviews?.length || 0} reviews
          </span>
        </div>
        
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="view-details-btn">View Details</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
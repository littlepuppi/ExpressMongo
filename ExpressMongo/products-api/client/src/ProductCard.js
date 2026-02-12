import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-header">
        <span className="product-category">Category: {product.category}</span>
        <span className="product-price">{Math.floor(product.price)}</span>
      </div>
      
      <div className="product-image-placeholder">
        <span className="placeholder-text">Product Image</span>
      </div>
      
      <h3 className="product-name">{product.name}</h3>
    </div>
  );
}

export default ProductCard;
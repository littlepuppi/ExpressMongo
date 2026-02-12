# Products & Reviews REST API

A complete REST API for managing products and their reviews using Express.js and MongoDB.

## Features

- Full CRUD operations for products
- Nested review management within products
- Pagination support for reviews (4 per page)
- Two implementation approaches:
  - **Embedded subdocuments** (server.js) - Reviews stored directly in product documents
  - **References with population** (server-with-refs.js) - Reviews as separate collection with references

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on `mongodb://localhost:27017`

3. Start the server:
```bash
# Using embedded subdocuments
npm start

# OR using refs and population
npm start:refs
```

The server will run on `http://localhost:3000`

## API Endpoints

### Products

#### GET `/products`
Get all products with optional pagination, category filtering, price sorting, and text search.

**Query Parameters:**
- `page` (optional): Page number (default: 1, 10 products per page)
- `category` (optional): Filter by category (e.g., "tools", "electronics", "furniture")
- `price` (optional): Sort by price - either "highest" or "lowest"
- `query` (optional): Search text to find in product name or description (case-insensitive)

**Examples:**

```bash
# Get all products (first page)
curl http://localhost:3000/products

# Get page 2
curl http://localhost:3000/products?page=2

# Filter by category
curl http://localhost:3000/products?category=tools

# Sort by price (lowest to highest)
curl http://localhost:3000/products?price=lowest

# Sort by price (highest to lowest)
curl http://localhost:3000/products?price=highest

# Search for products containing "drill"
curl "http://localhost:3000/products?query=drill"

# Search for "wireless" (case-insensitive)
curl "http://localhost:3000/products?query=wireless"

# Combine search + category
curl "http://localhost:3000/products?query=hammer&category=tools"

# Combine search + sort
curl "http://localhost:3000/products?query=chair&price=lowest"

# Combine filters: tools category, sorted by highest price
curl "http://localhost:3000/products?category=tools&price=highest"

# Full example: search + category + sort + pagination
curl "http://localhost:3000/products?page=1&query=power&category=tools&price=lowest"

# Search + sort without category
curl "http://localhost:3000/products?page=1&price=lowest&query=desk"
```

**Response:**
```json
{
  "products": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Hammer",
      "price": 15.99,
      "description": "Claw hammer",
      "category": "tools",
      "reviews": []
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalProducts": 25,
  "hasNextPage": true,
  "hasPrevPage": false,
  "filters": {
    "category": "tools",
    "priceSort": "lowest",
    "searchQuery": "hammer"
  }
}
```

**Search Notes:**
- Searches both `name` and `description` fields
- Case-insensitive matching
- Supports partial matches (searching "pow" finds "Power Drill")
- Does NOT search within product reviews
- The `totalProducts` count accurately reflects all active filters

#### GET `/products/:product`
Get a specific product by ID.

**Example:**
```bash
curl http://localhost:3000/products/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop",
  "reviews": [...]
}
```

#### POST `/products`
Create a new product.

**Example:**
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop",
    "category": "electronics"
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Laptop",
  "price": 999.99,
  "description": "High-performance laptop",
  "category": "electronics",
  "reviews": []
}
```

#### DELETE `/products/:product`
Delete a product by ID. Also deletes all associated reviews.

**Example:**
```bash
curl -X DELETE http://localhost:3000/products/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "message": "Product deleted successfully",
  "product": { ... }
}
```

### Reviews

#### GET `/products/:product/reviews`
Get all reviews for a product with pagination (4 reviews per page).

**Query Parameters:**
- `page` (optional): Page number (default: 1)

**Example:**
```bash
# Get first page of reviews
curl http://localhost:3000/products/507f1f77bcf86cd799439011/reviews

# Get second page
curl http://localhost:3000/products/507f1f77bcf86cd799439011/reviews?page=2
```

**Response:**
```json
{
  "reviews": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userName": "John Doe",
      "text": "Great product!",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalReviews": 12,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

#### POST `/products/:product/reviews`
Add a new review to a product.

**Example:**
```bash
curl -X POST http://localhost:3000/products/507f1f77bcf86cd799439011/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "John Doe",
    "text": "Great product! Highly recommended."
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userName": "John Doe",
  "text": "Great product! Highly recommended.",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### DELETE `/reviews/:review`
Delete a specific review by ID.

**Example:**
```bash
curl -X DELETE http://localhost:3000/reviews/507f1f77bcf86cd799439012
```

**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

## Implementation Approaches

### 1. Embedded Subdocuments (server.js)

**Pros:**
- Faster reads (reviews are in the same document)
- Better for reviews that are always accessed with the product
- Simpler queries for getting product + reviews

**Cons:**
- Document size limits (16MB per document)
- Harder to query reviews independently
- Updating individual reviews requires updating the parent document

**Schema:**
```javascript
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  reviews: [reviewSchema]  // Embedded array
});
```

### 2. References with Population (server-with-refs.js)

**Pros:**
- No document size limits
- Can query reviews independently
- Better for large numbers of reviews
- Easier to manage reviews across multiple products

**Cons:**
- Requires population (additional queries)
- Slightly more complex queries
- Need to manage referential integrity

**Schema:**
```javascript
const reviewSchema = new mongoose.Schema({
  userName: String,
  text: String,
  product: { type: ObjectId, ref: 'Product' }
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  reviews: [{ type: ObjectId, ref: 'Review' }]
});
```

## Testing the API

You can use the provided test script to automatically test all endpoints:

```bash
chmod +x test-api.sh
./test-api.sh
```

Or test manually with the following workflow:

```bash
# 1. Create products in different categories
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Hammer", "price": 15.99, "category": "tools"}'

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Power Drill", "price": 89.99, "category": "tools"}'

curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99, "category": "electronics"}'

# 2. Get all products
curl http://localhost:3000/products

# 3. Filter by category
curl "http://localhost:3000/products?category=tools"

# 4. Sort by price (lowest)
curl "http://localhost:3000/products?price=lowest"

# 5. Combine filters
curl "http://localhost:3000/products?category=tools&price=highest"

# 6. Get a specific product
PRODUCT_ID=$(curl -s http://localhost:3000/products | jq -r '.products[0]._id')
curl http://localhost:3000/products/$PRODUCT_ID

# 7. Add reviews to a product
curl -X POST http://localhost:3000/products/$PRODUCT_ID/reviews \
  -H "Content-Type: application/json" \
  -d '{"userName": "Alice", "text": "Great product!"}'

curl -X POST http://localhost:3000/products/$PRODUCT_ID/reviews \
  -H "Content-Type: application/json" \
  -d '{"userName": "Bob", "text": "Excellent quality"}'

# 8. Get reviews (paginated)
curl http://localhost:3000/products/$PRODUCT_ID/reviews
curl "http://localhost:3000/products/$PRODUCT_ID/reviews?page=2"

# 9. Delete a review
REVIEW_ID="your-review-id-here"
curl -X DELETE http://localhost:3000/reviews/$REVIEW_ID

# 10. Delete the product
curl -X DELETE http://localhost:3000/products/$PRODUCT_ID
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found

Error responses include a descriptive message:
```json
{
  "error": "Product not found"
}
```

## Notes

- Product pagination is set to 10 products per page
- Review pagination is set to 4 reviews per page
- When deleting a product, all associated reviews are also deleted
- Reviews include a `createdAt` timestamp automatically
- Products now include a required `category` field
- Query parameters can be combined: filtering + sorting + searching + pagination all work together
- Search is case-insensitive and searches both `name` and `description` fields
- Search supports partial matching (e.g., "pow" will match "Power Drill")
- Sorting options: `price=lowest` (ascending) or `price=highest` (descending)
- The `totalProducts` count in responses accurately reflects ALL active filters
- The subdocument approach uses Mongoose's built-in `id()` method for finding nested documents
- The refs approach uses `$pull` operator to remove references from arrays

## Available Categories

You can use any category name, but here are some common examples:
- tools
- electronics
- furniture
- clothing
- books
- sports
- home
- garden
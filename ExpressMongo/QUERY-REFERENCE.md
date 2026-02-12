# GET /products - Query Parameters Quick Reference

## Base URL
```
http://localhost:3000/products
```

## Query Parameters

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `page` | number | 1, 2, 3, ... | Page number for pagination (10 products per page) |
| `category` | string | any category name | Filter products by category |
| `price` | string | "lowest" or "highest" | Sort products by price |
| `query` | string | any search text | Search products by name or description (case-insensitive) |

## Example URLs

### Basic Queries

1. **Get all products (default: page 1)**
   ```
   /products
   ```

2. **Get specific page**
   ```
   /products?page=2
   /products?page=3
   ```

### Filtering by Category

3. **Get all tools**
   ```
   /products?category=tools
   ```

4. **Get all electronics**
   ```
   /products?category=electronics
   ```

5. **Get all furniture**
   ```
   /products?category=furniture
   ```

### Sorting by Price

6. **Sort by lowest price first**
   ```
   /products?price=lowest
   ```

7. **Sort by highest price first**
   ```
   /products?price=highest
   ```

### Combined Queries

8. **Tools sorted by lowest price**
   ```
   /products?category=tools&price=lowest
   ```

9. **Tools sorted by highest price**
   ```
   /products?category=tools&price=highest
   ```

10. **Electronics on page 2, sorted by lowest price**
    ```
    /products?page=2&category=electronics&price=lowest
    ```

### Search Queries

11. **Search for "drill"**
    ```
    /products?query=drill
    ```

12. **Search for "wireless" (case-insensitive)**
    ```
    /products?query=wireless
    /products?query=WIRELESS  (same result)
    ```

13. **Search for "ergonomic"**
    ```
    /products?query=ergonomic
    ```

### Search + Filters Combined

14. **Search "hammer" in tools category**
    ```
    /products?query=hammer&category=tools
    ```

15. **Search "chair" sorted by lowest price**
    ```
    /products?query=chair&price=lowest
    ```

16. **Search "power" in tools, sorted by highest price**
    ```
    /products?query=power&category=tools&price=highest
    ```

### All Parameters Combined

17. **Full example: Page 1, Search "wireless", Electronics category, Lowest price**
    ```
    /products?page=1&query=wireless&category=electronics&price=lowest
    ```

18. **Search + Sort (no category)**
    ```
    /products?page=1&price=lowest&query=desk
    ```

19. **Original full example: Page 1, Tools category, Highest price**
    ```
    /products?page=1&category=tools&price=highest
    ```

## Response Format

All queries return the same response structure:

```json
{
  "products": [
    {
      "_id": "...",
      "name": "Product Name",
      "price": 99.99,
      "description": "Product description",
      "category": "tools",
      "reviews": []
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalProducts": 47,
  "hasNextPage": true,
  "hasPrevPage": false,
  "filters": {
    "category": "tools",
    "priceSort": "highest"
  }
}
```

## Response Fields

- `products`: Array of product objects matching all filters
- `currentPage`: Current page number
- `totalPages`: Total number of pages available (based on filtered results)
- `totalProducts`: Total count of products matching ALL active filters
- `hasNextPage`: Boolean indicating if there's a next page
- `hasPrevPage`: Boolean indicating if there's a previous page
- `filters`: Object showing active filters, sort options, and search query

## Tips

1. **Default behavior**: Without query parameters, returns first page of all products, unsorted
2. **Pagination**: 10 products per page
3. **Case sensitivity**: 
   - Category names are case-sensitive ("tools" ≠ "Tools")
   - Search queries are case-INsensitive ("wireless" = "WIRELESS" = "WiReLeSs")
4. **Search behavior**:
   - Searches both `name` and `description` fields
   - Uses partial matching (searching "pow" will find "Power Drill")
   - Does NOT search within reviews, only the product itself
5. **Invalid values**: Invalid `price` values are ignored (only "lowest" and "highest" work)
6. **URL encoding**: Use quotes or URL encoding for multi-word categories
   - Good: `?category=power-tools`
   - Needs encoding: `?category=power%20tools`
7. **Accurate counts**: The `totalProducts` count reflects ALL active filters (search + category + any other filters), ensuring pagination is accurate

## cURL Examples

```bash
# Basic
curl "http://localhost:3000/products"

# With category
curl "http://localhost:3000/products?category=tools"

# With sorting
curl "http://localhost:3000/products?price=lowest"

# With search
curl "http://localhost:3000/products?query=drill"

# Search + category
curl "http://localhost:3000/products?query=wireless&category=electronics"

# Search + sort
curl "http://localhost:3000/products?query=chair&price=lowest"

# All parameters combined (note the quotes to handle special characters)
curl "http://localhost:3000/products?page=1&query=power&category=tools&price=highest"

# Just search and sort (no category)
curl "http://localhost:3000/products?price=lowest&query=desk"
```

## JavaScript Fetch Examples

```javascript
// Basic
const response = await fetch('http://localhost:3000/products');
const data = await response.json();

// With search query
const params = new URLSearchParams({
  query: 'wireless'
});
const response = await fetch(`http://localhost:3000/products?${params}`);
const data = await response.json();

// With all query parameters
const params = new URLSearchParams({
  page: 1,
  query: 'power',
  category: 'tools',
  price: 'highest'
});
const response = await fetch(`http://localhost:3000/products?${params}`);
const data = await response.json();

// Optional parameters (only include what you need)
const params = new URLSearchParams();
if (searchQuery) params.append('query', searchQuery);
if (category) params.append('category', category);
if (sortOrder) params.append('price', sortOrder);
const response = await fetch(`http://localhost:3000/products?${params}`);
const data = await response.json();
```
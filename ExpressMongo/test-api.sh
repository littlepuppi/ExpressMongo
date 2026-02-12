#!/bin/bash

# Test script for the Products API with filtering and sorting
# Make sure the server is running before executing this script

BASE_URL="http://localhost:3000"

echo "=== Products API Test Suite ==="
echo ""

echo "1. Creating sample products..."
echo ""

# Create products in different categories
curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hammer",
    "price": 15.99,
    "description": "Claw hammer",
    "category": "tools"
  }' | jq '.'

curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Screwdriver Set",
    "price": 24.99,
    "description": "10-piece screwdriver set",
    "category": "tools"
  }' | jq '.'

curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Power Drill",
    "price": 89.99,
    "description": "Cordless power drill",
    "category": "tools"
  }' | jq '.'

curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "price": 999.99,
    "description": "Gaming laptop",
    "category": "electronics"
  }' | jq '.'

curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Mouse",
    "price": 29.99,
    "description": "Ergonomic wireless mouse",
    "category": "electronics"
  }' | jq '.'

curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mechanical Keyboard",
    "price": 129.99,
    "description": "RGB mechanical keyboard",
    "category": "electronics"
  }' | jq '.'

curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Office Chair",
    "price": 249.99,
    "description": "Ergonomic office chair",
    "category": "furniture"
  }' | jq '.'

curl -s -X POST $BASE_URL/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Standing Desk",
    "price": 399.99,
    "description": "Adjustable standing desk",
    "category": "furniture"
  }' | jq '.'

echo ""
echo "=== Test 1: Get all products (no filters) ==="
echo "URL: $BASE_URL/products"
echo ""
curl -s "$BASE_URL/products" | jq '.'

echo ""
echo "=== Test 2: Get all products - Page 1 ==="
echo "URL: $BASE_URL/products?page=1"
echo ""
curl -s "$BASE_URL/products?page=1" | jq '.'

echo ""
echo "=== Test 3: Filter by category 'tools' ==="
echo "URL: $BASE_URL/products?category=tools"
echo ""
curl -s "$BASE_URL/products?category=tools" | jq '.'

echo ""
echo "=== Test 4: Filter by category 'electronics' ==="
echo "URL: $BASE_URL/products?category=electronics"
echo ""
curl -s "$BASE_URL/products?category=electronics" | jq '.'

echo ""
echo "=== Test 5: Filter by category 'furniture' ==="
echo "URL: $BASE_URL/products?category=furniture"
echo ""
curl -s "$BASE_URL/products?category=furniture" | jq '.'

echo ""
echo "=== Test 6: Sort all products by price (lowest to highest) ==="
echo "URL: $BASE_URL/products?price=lowest"
echo ""
curl -s "$BASE_URL/products?price=lowest" | jq '.products[] | {name: .name, price: .price, category: .category}'

echo ""
echo "=== Test 7: Sort all products by price (highest to lowest) ==="
echo "URL: $BASE_URL/products?price=highest"
echo ""
curl -s "$BASE_URL/products?price=highest" | jq '.products[] | {name: .name, price: .price, category: .category}'

echo ""
echo "=== Test 8: Filter 'tools' + Sort by lowest price ==="
echo "URL: $BASE_URL/products?category=tools&price=lowest"
echo ""
curl -s "$BASE_URL/products?category=tools&price=lowest" | jq '.products[] | {name: .name, price: .price, category: .category}'

echo ""
echo "=== Test 9: Filter 'tools' + Sort by highest price ==="
echo "URL: $BASE_URL/products?category=tools&price=highest"
echo ""
curl -s "$BASE_URL/products?category=tools&price=highest" | jq '.products[] | {name: .name, price: .price, category: .category}'

echo ""
echo "=== Test 10: Filter 'electronics' + Sort by lowest price + Page 1 ==="
echo "URL: $BASE_URL/products?page=1&category=electronics&price=lowest"
echo ""
curl -s "$BASE_URL/products?page=1&category=electronics&price=lowest" | jq '.'

echo ""
echo "=== Test 11: Full example with all query parameters ==="
echo "URL: $BASE_URL/products?page=1&category=tools&price=highest"
echo ""
curl -s "$BASE_URL/products?page=1&category=tools&price=highest" | jq '.'

echo ""
echo "=== Test 12: Search for products containing 'drill' ==="
echo "URL: $BASE_URL/products?query=drill"
echo ""
curl -s "$BASE_URL/products?query=drill" | jq '.products[] | {name: .name, price: .price, category: .category, description: .description}'

echo ""
echo "=== Test 13: Search for 'wireless' (case-insensitive) ==="
echo "URL: $BASE_URL/products?query=wireless"
echo ""
curl -s "$BASE_URL/products?query=wireless" | jq '.products[] | {name: .name, price: .price, category: .category}'

echo ""
echo "=== Test 14: Search + Category filter ==="
echo "URL: $BASE_URL/products?query=chair&category=furniture"
echo ""
curl -s "$BASE_URL/products?query=chair&category=furniture" | jq '.'

echo ""
echo "=== Test 15: Search + Price sort ==="
echo "URL: $BASE_URL/products?query=e&price=lowest"
echo ""
curl -s "$BASE_URL/products?query=e&price=lowest" | jq '.products[] | {name: .name, price: .price}'

echo ""
echo "=== Test 16: Complete example - Search + Category + Sort + Pagination ==="
echo "URL: $BASE_URL/products?page=1&query=er&category=tools&price=lowest"
echo ""
curl -s "$BASE_URL/products?page=1&query=er&category=tools&price=lowest" | jq '.'

echo ""
echo "=== Test 17: Search with no category (price sort only) ==="
echo "URL: $BASE_URL/products?page=1&price=lowest&query=desk"
echo ""
curl -s "$BASE_URL/products?page=1&price=lowest&query=desk" | jq '.'

echo ""
echo "=== Test 18: Search in description field ==="
echo "URL: $BASE_URL/products?query=ergonomic"
echo ""
curl -s "$BASE_URL/products?query=ergonomic" | jq '.products[] | {name: .name, description: .description}'

echo ""
echo "=== All tests completed! ==="
const axios = require('axios');

const products = [
  {
    name: "Ergonomic Granite Shoes",
    price: 688,
    description: "Ergonomic Granite Shoes",
    category: "Garden"
  },
  {
    name: "Sleek Plastic Keyboard",
    price: 719,
    description: "Sleek Plastic Keyboard",
    category: "Jewelery"
  },
  {
    name: "Incredible Wooden Ball",
    price: 380,
    description: "Incredible Wooden Ball",
    category: "Garden"
  },
  {
    name: "Tasty Concrete Soap",
    price: 340,
    description: "Tasty Concrete Soap",
    category: "Games"
  },
  {
    name: "Small Fresh Bacon",
    price: 731,
    description: "Small Fresh Bacon",
    category: "Beauty"
  },
  {
    name: "Practical Fresh Shirt",
    price: 276,
    description: "Practical Fresh Shirt",
    category: "Home"
  }
];

async function addProducts() {
  for (const product of products) {
    try {
      const response = await axios.post('http://localhost:3000/products', product);
      console.log(`✓ Added: ${product.name}`);
    } catch (error) {
      console.error(`✗ Failed to add ${product.name}:`, error.message);
    }
  }
  console.log('\nDone!');
}

addProducts();

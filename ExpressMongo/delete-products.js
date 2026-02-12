const axios = require('axios');

const productIds = [
  '698205f547243ff38ce9daf6',  // Hammer
  '698377d6c23d7499c5ced27b'   // Power Drill
];

async function deleteProducts() {
  for (const id of productIds) {
    try {
      const response = await axios.delete(`http://localhost:3000/products/${id}`);
      console.log(`✓ Deleted product: ${id}`);
    } catch (error) {
      console.error(`✗ Failed to delete ${id}:`, error.message);
    }
  }
  console.log('\nDone!');
}

deleteProducts();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Manual CORS configuration
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Add these two routes:
app.get('/', (req, res) => {
  res.send('<h1>Products API</h1><p>API is running! Try <a href="/products">/products</a></p>');
});

app.get('/favicon.ico', (req, res) => res.status(204).end());

// Add this:
app.get('/', (req, res) => {
  res.json({
    message: 'Products API is running!',
    endpoints: {
      products: {
        'GET /products': 'Get all products (with optional query params)',
        'GET /products/:id': 'Get a specific product',
        'POST /products': 'Create a new product',
        'DELETE /products/:id': 'Delete a product'
      },
      reviews: {
        'GET /products/:id/reviews': 'Get reviews for a product',
        'POST /products/:id/reviews': 'Add a review to a product',
        'DELETE /reviews/:id': 'Delete a review'
      },
      queryParams: {
        page: 'Page number (default: 1)',
        category: 'Filter by category',
        price: 'Sort by price (lowest/highest)',
        query: 'Search products by name or description'
      }
    }
  });
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/products-reviews-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Review Schema (embedded subdocument)
const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Product Schema with embedded reviews
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  category: {
    type: String,
    required: true
  },
  reviews: [reviewSchema]
});

const Product = mongoose.model('Product', productSchema);

// Routes

// GET /products - Get all products with optional filtering, sorting, and pagination
app.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9; // Products per page
    const skip = (page - 1) * limit;

    // Build the filter object
    const filter = {};
    
    // Category filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Text search filter (case-insensitive, searches name and description)
    if (req.query.query) {
      filter.$or = [
        { name: { $regex: req.query.query, $options: 'i' } },
        { description: { $regex: req.query.query, $options: 'i' } }
      ];
    }

    // Build the sort object
    let sort = {};
    if (req.query.price === 'highest') {
      sort.price = -1; // Descending order
    } else if (req.query.price === 'lowest') {
      sort.price = 1; // Ascending order
    }

    // Get total count for pagination (based on current filters)
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

    // Fetch products
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.json({
      products: products,
      currentPage: page,
      totalPages: totalPages,
      totalProducts: totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      filters: {
        category: req.query.category || 'all',
        priceSort: req.query.price || 'none',
        searchQuery: req.query.query || 'none'
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /categories - Get all unique categories
app.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /products/:product - Get a specific product by id
app.get('/products/:product', async (req, res) => {
  try {
    const product = await Product.findById(req.params.product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /products/:product/reviews - Get all reviews for a product (paginated, 4 per page)
app.get('/products/:product/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 4;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedReviews = product.reviews.slice(startIndex, endIndex);
    const totalPages = Math.ceil(product.reviews.length / limit);

    res.json({
      reviews: paginatedReviews,
      currentPage: page,
      totalPages: totalPages,
      totalReviews: product.reviews.length,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /products - Create a new product
app.post('/products', async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      reviews: []
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST /products/:product/reviews - Add a review to a product
app.post('/products/:product/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newReview = {
      userName: req.body.userName,
      text: req.body.text
    };

    product.reviews.push(newReview);
    const savedProduct = await product.save();
    
    // Return the newly created review
    const createdReview = savedProduct.reviews[savedProduct.reviews.length - 1];
    res.status(201).json(createdReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /products/:product - Delete a product by id
app.delete('/products/:product', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /reviews/:review - Delete a review by id
app.delete('/reviews/:review', async (req, res) => {
  try {
    const reviewId = req.params.review;
    
    // Find the product containing this review
    const product = await Product.findOne({ 'reviews._id': reviewId });
    
    if (!product) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Remove the review from the array
    product.reviews.id(reviewId).remove();
    await product.save();

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
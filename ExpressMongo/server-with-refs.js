const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

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

// Review Schema (separate collection with ref to product)
const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Product Schema with refs to reviews
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
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

const Review = mongoose.model('Review', reviewSchema);
const Product = mongoose.model('Product', productSchema);

// Routes

// GET /products - Get all products with optional filtering, sorting, and pagination
app.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Products per page
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

// GET /products/:product - Get a specific product by id
app.get('/products/:product', async (req, res) => {
  try {
    const product = await Product.findById(req.params.product)
      .populate('reviews');
    
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
    const skip = (page - 1) * limit;

    // Get total count
    const totalReviews = product.reviews.length;
    const totalPages = Math.ceil(totalReviews / limit);

    // Populate only the reviews we need for this page
    const productWithReviews = await Product.findById(req.params.product)
      .populate({
        path: 'reviews',
        options: {
          skip: skip,
          limit: limit
        }
      });

    res.json({
      reviews: productWithReviews.reviews,
      currentPage: page,
      totalPages: totalPages,
      totalReviews: totalReviews,
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

    // Create the review document
    const review = new Review({
      userName: req.body.userName,
      text: req.body.text,
      product: req.params.product
    });

    const savedReview = await review.save();

    // Add review reference to product
    product.reviews.push(savedReview._id);
    await product.save();
    
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /products/:product - Delete a product by id
app.delete('/products/:product', async (req, res) => {
  try {
    const product = await Product.findById(req.params.product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Delete all associated reviews
    await Review.deleteMany({ _id: { $in: product.reviews } });

    // Delete the product
    await Product.findByIdAndDelete(req.params.product);

    res.json({ message: 'Product and associated reviews deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /reviews/:review - Delete a review by id
app.delete('/reviews/:review', async (req, res) => {
  try {
    const review = await Review.findById(req.params.review);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Remove review reference from product
    await Product.findByIdAndUpdate(
      review.product,
      { $pull: { reviews: req.params.review } }
    );

    // Delete the review
    await Review.findByIdAndDelete(req.params.review);

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
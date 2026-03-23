const Product = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    console.log('API: Fetched products count:', products.length);
    res.json(products);
  } catch (err) {
    console.error('API Error: Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const ok = await Product.update(req.params.id, req.body);
    if (!ok) return res.status(404).json({ error: 'Product not found' });
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const ok = await Product.delete(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
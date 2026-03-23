// Main application entry point for Viet Heritage Hub Backend
require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const heritageRoutes = require('./routes/heritageRoutes');
const shopRoutes = require('./routes/shopRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/heritage-sites', heritageRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api', apiRoutes);
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Static HTML/CSS/JS frontend (../frontend)
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(path.join(frontendPath, 'index.html'))) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Viet Heritage Hub API is running. Add the frontend/ folder (index.html) to use the web UI.');
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// Main application entry point for Viet Heritage Hub Backend
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/apiRoutes');

app.use('/api/users', userRoutes);
app.use('/api', apiRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to Viet Heritage Hub API');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

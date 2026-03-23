const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireAuth, requireRoles } = require('../middleware/auth');

// Public
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin / Artisan only
router.post('/', requireAuth, requireRoles('admin', 'artisan'), productController.createProduct);
router.put('/:id', requireAuth, requireRoles('admin', 'artisan'), productController.updateProduct);
router.delete('/:id', requireAuth, requireRoles('admin', 'artisan'), productController.deleteProduct);

module.exports = router;
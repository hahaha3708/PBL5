const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { requireAuth, requireRoles } = require('../middleware/auth');

// Chỉ artisan và admin mới được quản lý shop
router.use(requireAuth);
router.use(requireRoles('artisan', 'admin'));

router.get('/my-shops', shopController.getMyShops);
router.post('/', shopController.createShop);
router.put('/:id', shopController.updateShop);

module.exports = router;

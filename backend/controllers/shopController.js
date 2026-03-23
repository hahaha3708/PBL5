const Shop = require('../models/shopModel');

// Lấy các cửa hàng của nghệ nhân đang đăng nhập
exports.getMyShops = async (req, res) => {
  try {
    const shops = await Shop.findByArtisan(req.user.id);
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
};

// Tạo cửa hàng mới cho nghệ nhân
exports.createShop = async (req, res) => {
  try {
    const newShop = await Shop.create(req.user.id, req.body);
    res.status(201).json(newShop);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create shop' });
  }
};

// Cập nhật thông tin cửa hàng
exports.updateShop = async (req, res) => {
  try {
    // Thêm logic kiểm tra xem nghệ nhân có sở hữu cửa hàng này không
    const success = await Shop.update(req.params.id, req.body);
    if (!success) return res.status(404).json({ error: 'Shop not found or permission denied' });
    res.json({ message: 'Shop updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shop' });
  }
};

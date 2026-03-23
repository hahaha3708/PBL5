require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'viet-heritage-hub-secret-key-2026';

function getBearerToken(req) {
  const h = req.headers.authorization;
  if (!h || typeof h !== 'string' || !h.startsWith('Bearer ')) return null;
  return h.slice(7).trim();
}

async function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Yêu cầu đăng nhập' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại' });
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Phiên đăng nhập không hợp lệ' });
  }
}

function requireRoles(...allowed) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'Yêu cầu đăng nhập' });
    }
    if (allowed.indexOf(req.user.role) === -1) {
      return res.status(403).json({ error: 'Không đủ quyền thực hiện thao tác này' });
    }
    next();
  };
}

module.exports = {
  JWT_SECRET,
  getBearerToken,
  requireAuth,
  requireRoles
};

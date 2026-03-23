const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { JWT_SECRET, getBearerToken } = require('../middleware/auth');

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function publicUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role
  };
}

exports.register = async (req, res) => {
  try {
    const name = (req.body && String(req.body.name || '').trim()) || '';
    const email = (req.body && String(req.body.email || '').trim().toLowerCase()) || '';
    const password = (req.body && String(req.body.password || '')) || '';

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đủ họ tên, email và mật khẩu' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu tối thiểu 6 ký tự' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'Email đã được đăng ký' });
    }

    const hash = await bcrypt.hash(password, 10);
    const row = await User.create({
      name,
      email,
      password: hash,
      role: 'member'
    });

    const user = await User.findById(row.id);
    const token = signToken(user);
    return res.status(201).json({
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Đăng ký thất bại' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body.email);
    const email = (req.body && String(req.body.email || '').trim().toLowerCase()) || '';
    const password = (req.body && String(req.body.password || '')) || '';

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ error: 'Sai email hoặc mật khẩu' });
    }

    console.log('Login successful:', email);
    const token = signToken(user);
    return res.json({
      token,
      user: publicUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Đăng nhập thất bại' });
  }
};

exports.me = async (req, res) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Chưa đăng nhập' });
    }
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'Phiên không hợp lệ' });
    }
    return res.json({ user: publicUser(user) });
  } catch (e) {
    return res.status(401).json({ error: 'Phiên không hợp lệ' });
  }
};

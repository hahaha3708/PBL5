// User Controller - Handles user-related operations
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

function stripPassword(user) {
  if (!user) return user;
  const { password, ...rest } = user;
  return rest;
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users.map(stripPassword));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(stripPassword(user));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const userData = { ...req.body };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    } else {
      userData.password = await bcrypt.hash('123456', 10); // Default password
    }
    const newUser = await User.create(userData);
    const full = await User.findById(newUser.id);
    res.status(201).json(stripPassword(full));
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userData = { ...req.body };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    } else {
      // Keep existing password if not provided
      const existing = await User.findById(req.params.id);
      if (existing) userData.password = existing.password;
    }
    const updatedUser = await User.update(req.params.id, userData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const full = await User.findById(req.params.id);
    res.json(stripPassword(full));
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

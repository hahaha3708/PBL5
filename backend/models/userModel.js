// User Model - Handles user data operations
const db = require('../config/database');

class User {
  static async findAll() {
    const query = 'SELECT * FROM users';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  static async create(userData) {
    const { name, email, password, role } = userData;
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, email, password, role || 'member']);
    return { id: result.insertId, ...userData };
  }

  static async update(id, userData) {
    const { name, email, password, role } = userData;
    const query = 'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?';
    const [result] = await db.execute(query, [name, email, password, role, id]);
    if (result.affectedRows > 0) {
      return { id, ...userData };
    }
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;

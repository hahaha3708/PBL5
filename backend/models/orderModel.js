// Order Model - Handles orders and transactions
const db = require('../config/database');

class Order {
  static async findAll() {
    const query = 'SELECT * FROM orders ORDER BY created_at DESC';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM orders WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findByUser(userId) {
    const query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }

  static async findByArtisan(artisanId) {
    const query = 'SELECT * FROM orders WHERE artisan_id = ? ORDER BY created_at DESC';
    const [rows] = await db.execute(query, [artisanId]);
    return rows;
  }

  static async create(orderData) {
    const { user_id, artisan_id, product_id, quantity, total_price, shipping_address, status } = orderData;
    const query = 'INSERT INTO orders (user_id, artisan_id, product_id, quantity, total_price, shipping_address, status) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [user_id, artisan_id, product_id, quantity, total_price, shipping_address, status || 'pending']);
    return { id: result.insertId, ...orderData };
  }

  static async updateStatus(id, status) {
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    const [result] = await db.execute(query, [status, id]);
    if (result.affectedRows > 0) {
      return { id, status };
    }
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM orders WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Order;

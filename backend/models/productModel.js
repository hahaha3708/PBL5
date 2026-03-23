const pool = require('../config/database');

class Product {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, description, price, category, artisan_id, stock_quantity, image_url } = data;
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price, category, artisan_id, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, category, artisan_id, stock_quantity, image_url]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { name, description, price, category, stock_quantity, image_url } = data;
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock_quantity = ?, image_url = ? WHERE id = ?',
      [name, description, price, category, stock_quantity, image_url, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;
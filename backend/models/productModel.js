// Product Model - Handles artisan products data
const db = require('../config/database');

class Product {
  static async findAll() {
    const query = 'SELECT * FROM products';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findByArtisan(artisanId) {
    const query = 'SELECT * FROM products WHERE artisan_id = ?';
    const [rows] = await db.execute(query, [artisanId]);
    return rows;
  }

  static async findByCategory(category) {
    const query = 'SELECT * FROM products WHERE category = ?';
    const [rows] = await db.execute(query, [category]);
    return rows;
  }

  static async create(productData) {
    const { name, description, price, category, artisan_id, image_url, stock_quantity } = productData;
    const query = 'INSERT INTO products (name, description, price, category, artisan_id, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, description, price, category, artisan_id, image_url, stock_quantity]);
    return { id: result.insertId, ...productData };
  }

  static async update(id, productData) {
    const { name, description, price, category, artisan_id, image_url, stock_quantity } = productData;
    const query = 'UPDATE products SET name = ?, description = ?, price = ?, category = ?, artisan_id = ?, image_url = ?, stock_quantity = ? WHERE id = ?';
    const [result] = await db.execute(query, [name, description, price, category, artisan_id, image_url, stock_quantity, id]);
    if (result.affectedRows > 0) {
      return { id, ...productData };
    }
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;

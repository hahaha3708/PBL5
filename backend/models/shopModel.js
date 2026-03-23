const pool = require('../config/database');

class Shop {
  static async findByArtisan(artisanId) {
    const [rows] = await pool.query('SELECT * FROM shops WHERE artisan_id = ?', [artisanId]);
    return rows;
  }

  static async create(artisanId, data) {
    const { shop_name, description } = data;
    const [result] = await pool.query(
      'INSERT INTO shops (artisan_id, shop_name, description) VALUES (?, ?, ?)',
      [artisanId, shop_name, description]
    );
    return { id: result.insertId, artisan_id: artisanId, ...data };
  }

  static async update(id, data) {
    const { shop_name, description } = data;
    const [result] = await pool.query(
      'UPDATE shops SET shop_name = ?, description = ? WHERE id = ?',
      [shop_name, description, id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Shop;

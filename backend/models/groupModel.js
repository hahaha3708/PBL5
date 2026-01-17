// Group Model - Handles community groups data
const db = require('../config/database');

class Group {
  static async findAll() {
    const query = 'SELECT * FROM groups';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM groups WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findByCategory(category) {
    const query = 'SELECT * FROM groups WHERE category = ?';
    const [rows] = await db.execute(query, [category]);
    return rows;
  }

  static async create(groupData) {
    const { name, description, category, creator_id, image_url, is_private } = groupData;
    const query = 'INSERT INTO groups (name, description, category, creator_id, image_url, is_private) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, description, category, creator_id, image_url, is_private || false]);
    return { id: result.insertId, ...groupData };
  }

  static async update(id, groupData) {
    const { name, description, category, image_url, is_private } = groupData;
    const query = 'UPDATE groups SET name = ?, description = ?, category = ?, image_url = ?, is_private = ? WHERE id = ?';
    const [result] = await db.execute(query, [name, description, category, image_url, is_private, id]);
    if (result.affectedRows > 0) {
      return { id, ...groupData };
    }
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM groups WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Group;

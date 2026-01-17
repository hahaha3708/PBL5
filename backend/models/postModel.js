// Post Model - Handles community posts data
const db = require('../config/database');

class Post {
  static async findAll() {
    const query = 'SELECT * FROM posts ORDER BY created_at DESC';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM posts WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findByUser(userId) {
    const query = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await db.execute(query, [userId]);
    return rows;
  }

  static async findByGroup(groupId) {
    const query = 'SELECT * FROM posts WHERE group_id = ? ORDER BY created_at DESC';
    const [rows] = await db.execute(query, [groupId]);
    return rows;
  }

  static async create(postData) {
    const { user_id, group_id, title, content, image_url, is_verified } = postData;
    const query = 'INSERT INTO posts (user_id, group_id, title, content, image_url, is_verified) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [user_id, group_id, title, content, image_url, is_verified || false]);
    return { id: result.insertId, ...postData };
  }

  static async update(id, postData) {
    const { title, content, image_url, is_verified } = postData;
    const query = 'UPDATE posts SET title = ?, content = ?, image_url = ?, is_verified = ? WHERE id = ?';
    const [result] = await db.execute(query, [title, content, image_url, is_verified, id]);
    if (result.affectedRows > 0) {
      return { id, ...postData };
    }
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM posts WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Post;

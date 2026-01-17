// History Model - Handles historical timeline data
const db = require('../config/database');

class History {
  static async findAll() {
    const query = 'SELECT * FROM historical_periods ORDER BY start_year';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM historical_periods WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findByDynasty(dynasty) {
    const query = 'SELECT * FROM historical_periods WHERE dynasty = ?';
    const [rows] = await db.execute(query, [dynasty]);
    return rows;
  }

  static async findByYearRange(startYear, endYear) {
    const query = 'SELECT * FROM historical_periods WHERE start_year >= ? AND end_year <= ? ORDER BY start_year';
    const [rows] = await db.execute(query, [startYear, endYear]);
    return rows;
  }

  static async create(periodData) {
    const { dynasty, start_year, end_year, description, key_events, image_url, audio_url } = periodData;
    const query = 'INSERT INTO historical_periods (dynasty, start_year, end_year, description, key_events, image_url, audio_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [dynasty, start_year, end_year, description, key_events, image_url, audio_url]);
    return { id: result.insertId, ...periodData };
  }

  static async update(id, periodData) {
    const { dynasty, start_year, end_year, description, key_events, image_url, audio_url } = periodData;
    const query = 'UPDATE historical_periods SET dynasty = ?, start_year = ?, end_year = ?, description = ?, key_events = ?, image_url = ?, audio_url = ? WHERE id = ?';
    const [result] = await db.execute(query, [dynasty, start_year, end_year, description, key_events, image_url, audio_url, id]);
    if (result.affectedRows > 0) {
      return { id, ...periodData };
    }
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM historical_periods WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = History;

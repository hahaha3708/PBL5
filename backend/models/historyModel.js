const pool = require('../config/database');

class HistoricalPeriod {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM historical_periods ORDER BY start_year ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM historical_periods WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, start_year, end_year, capital, notable_figures, key_events, description, image_url, theme_color, background_pattern, background_music, influence } = data;
    const [result] = await pool.query(
      'INSERT INTO historical_periods (name, start_year, end_year, capital, notable_figures, key_events, description, image_url, theme_color, background_pattern, background_music, influence) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, start_year, end_year, capital, notable_figures, key_events, description, image_url, theme_color, background_pattern, background_music, influence]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { name, start_year, end_year, capital, notable_figures, key_events, description, image_url, theme_color, background_pattern, background_music, influence } = data;
    const [result] = await pool.query(
      'UPDATE historical_periods SET name = ?, start_year = ?, end_year = ?, capital = ?, notable_figures = ?, key_events = ?, description = ?, image_url = ?, theme_color = ?, background_pattern = ?, background_music = ?, influence = ? WHERE id = ?',
      [name, start_year, end_year, capital, notable_figures, key_events, description, image_url, theme_color, background_pattern, background_music, influence, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.query('DELETE FROM historical_periods WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = HistoricalPeriod;

const pool = require('../config/database');

class HeritageSite {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM heritage_sites ORDER BY id DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM heritage_sites WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(data) {
    const { name, type, latitude, longitude, region_music, description_vi, description_en, image_url } = data;
    const [result] = await pool.query(
      'INSERT INTO heritage_sites (name, type, latitude, longitude, region_music, description_vi, description_en, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, type, latitude, longitude, region_music, description_vi, description_en, image_url]
    );
    return { id: result.insertId, ...data };
  }

  static async update(id, data) {
    const { name, type, latitude, longitude, region_music, description_vi, description_en, image_url } = data;
    const [result] = await pool.query(
      'UPDATE heritage_sites SET name = ?, type = ?, latitude = ?, longitude = ?, region_music = ?, description_vi = ?, description_en = ?, image_url = ? WHERE id = ?',
      [name, type, latitude, longitude, region_music, description_vi, description_en, image_url, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    // Delete media first due to FK if any (though not strictly required if not enforced)
    await pool.query('DELETE FROM heritage_media WHERE site_id = ?', [id]);
    const [result] = await pool.query('DELETE FROM heritage_sites WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Media related
  static async getMedia(siteId) {
    const [rows] = await pool.query('SELECT * FROM heritage_media WHERE site_id = ?', [siteId]);
    return rows;
  }

  static async addMedia(siteId, mediaData) {
    const { media_type, media_url } = mediaData;
    const [result] = await pool.query(
      'INSERT INTO heritage_media (site_id, media_type, media_url) VALUES (?, ?, ?)',
      [siteId, media_type, media_url]
    );
    return { id: result.insertId, site_id: siteId, ...mediaData };
  }
}

module.exports = HeritageSite;

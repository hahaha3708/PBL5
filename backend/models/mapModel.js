// Map Model - Handles heritage sites and locations data
const db = require('../config/database');

class MapSite {
  static async findAll() {
    const query = 'SELECT * FROM heritage_sites';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM heritage_sites WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findByRegion(region) {
    const query = 'SELECT * FROM heritage_sites WHERE region = ?';
    const [rows] = await db.execute(query, [region]);
    return rows;
  }

  static async findByType(siteType) {
    const query = 'SELECT * FROM heritage_sites WHERE type = ?';
    const [rows] = await db.execute(query, [siteType]);
    return rows;
  }

  static async create(siteData) {
    const { name, description, latitude, longitude, region, type, historical_period, image_url, audio_url } = siteData;
    const query = 'INSERT INTO heritage_sites (name, description, latitude, longitude, region, type, historical_period, image_url, audio_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, description, latitude, longitude, region, type, historical_period, image_url, audio_url]);
    return { id: result.insertId, ...siteData };
  }

  static async update(id, siteData) {
    const { name, description, latitude, longitude, region, type, historical_period, image_url, audio_url } = siteData;
    const query = 'UPDATE heritage_sites SET name = ?, description = ?, latitude = ?, longitude = ?, region = ?, type = ?, historical_period = ?, image_url = ?, audio_url = ? WHERE id = ?';
    const [result] = await db.execute(query, [name, description, latitude, longitude, region, type, historical_period, image_url, audio_url, id]);
    if (result.affectedRows > 0) {
      return { id, ...siteData };
    }
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM heritage_sites WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = MapSite;

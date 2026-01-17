// Event Model - Handles cultural events data
const db = require('../config/database');

class Event {
  static async findAll() {
    const query = 'SELECT * FROM events ORDER BY event_date DESC';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM events WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async findByArtisan(artisanId) {
    const query = 'SELECT * FROM events WHERE organizer_id = ? ORDER BY event_date DESC';
    const [rows] = await db.execute(query, [artisanId]);
    return rows;
  }

  static async findUpcoming() {
    const query = 'SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date';
    const [rows] = await db.execute(query);
    return rows;
  }

  static async create(eventData) {
    const { title, description, event_date, location, organizer_id, max_participants, image_url, is_online } = eventData;
    const query = 'INSERT INTO events (title, description, event_date, location, organizer_id, max_participants, image_url, is_online) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [title, description, event_date, location, organizer_id, max_participants, image_url, is_online || false]);
    return { id: result.insertId, ...eventData };
  }

  static async update(id, eventData) {
    const { title, description, event_date, location, max_participants, image_url, is_online } = eventData;
    const query = 'UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, max_participants = ?, image_url = ?, is_online = ? WHERE id = ?';
    const [result] = await db.execute(query, [title, description, event_date, location, max_participants, image_url, is_online, id]);
    if (result.affectedRows > 0) {
      return { id, ...eventData };
    }
    return null;
  }

  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Event;

import { executeQuery } from '../config/database.js';

export class Event {
  static async getAll() {
    const query = 'SELECT * FROM events ORDER BY tanggal ASC';
    return await executeQuery(query);
  }

  static async create(eventData) {
    const query = `
      INSERT INTO events (judul, deskripsi, tanggal, lokasi, gambar)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      eventData.judul,
      eventData.deskripsi || null,
      eventData.tanggal,
      eventData.lokasi || null,
      eventData.gambar || null
    ];
    
    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async update(id, eventData) {
    const fields = Object.keys(eventData).filter(key => key !== 'id');
    const values = fields.map(field => eventData[field]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `UPDATE events SET ${setClause}, updated_at = NOW() WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM events WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
}
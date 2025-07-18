import { executeQuery } from '../config/database.js';

export class Gallery {
  static async getAll(kategori = null) {
    let query = 'SELECT * FROM galleries';
    let params = [];
    
    if (kategori) {
      query += ' WHERE kategori = ?';
      params.push(kategori);
    }
    
    query += ' ORDER BY tanggal DESC';
    return await executeQuery(query, params);
  }

  static async create(galleryData) {
    const query = `
      INSERT INTO galleries (judul, deskripsi, gambar, kategori, tanggal)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [
      galleryData.judul,
      galleryData.deskripsi || null,
      galleryData.gambar,
      galleryData.kategori || null,
      galleryData.tanggal
    ];
    
    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async update(id, galleryData) {
    const fields = Object.keys(galleryData).filter(key => key !== 'id');
    const values = fields.map(field => galleryData[field]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `UPDATE galleries SET ${setClause}, updated_at = NOW() WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM galleries WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
}
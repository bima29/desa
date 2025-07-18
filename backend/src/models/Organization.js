import { executeQuery } from '../config/database.js';

export class Organization {
  static async getAll() {
    const query = 'SELECT * FROM organisasi ORDER BY urutan ASC';
    return await executeQuery(query);
  }

  static async create(orgData) {
    const query = `
      INSERT INTO organisasi (nama, jabatan, foto, urutan)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      orgData.nama,
      orgData.jabatan,
      orgData.foto || null,
      orgData.urutan || 0
    ];
    
    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async update(id, orgData) {
    const fields = Object.keys(orgData).filter(key => key !== 'id');
    const values = fields.map(field => orgData[field]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `UPDATE organisasi SET ${setClause}, updated_at = NOW() WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM organisasi WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
}
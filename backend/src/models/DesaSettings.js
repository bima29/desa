import { executeQuery, executeQuerySingle } from '../config/database.js';

export class DesaSettings {
  static async getSettings() {
    const query = 'SELECT * FROM desa_settings ORDER BY id DESC LIMIT 1';
    const result = await executeQuerySingle(query);
    
    if (!result) {
      // Return default settings if none exist
      return {
        id: 0,
        nama_desa: 'Desa Digital',
        slogan: 'Menuju Desa Modern dan Sejahtera',
        alamat: 'Alamat Desa',
        logo: '',
        hero_image: '',
        primary_color: '#3B82F6',
        secondary_color: '#10B981',
        deskripsi: 'Deskripsi desa',
        created_at: new Date(),
        updated_at: new Date()
      };
    }
    
    return result;
  }

  static async updateSettings(settings) {
    const fields = Object.keys(settings).filter(key => key !== 'id');
    const values = fields.map(field => settings[field]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `UPDATE desa_settings SET ${setClause}, updated_at = NOW() WHERE id = 1`;
    await executeQuery(query, values);
    return true;
  }

  static async createSettings(settings) {
    const fields = Object.keys(settings);
    const values = fields.map(field => settings[field]);
    const placeholders = fields.map(() => '?').join(', ');
    
    const query = `INSERT INTO desa_settings (${fields.join(', ')}) VALUES (${placeholders})`;
    await executeQuery(query, values);
    return true;
  }
}
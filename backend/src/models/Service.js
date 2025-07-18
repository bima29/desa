import { executeQuery, executeQuerySingle } from '../config/database.js';

export class Service {
  static async getAll() {
    const query = 'SELECT * FROM layanan ORDER BY id ASC';
    return await executeQuery(query);
  }

  static async create(serviceData) {
    const query = `
      INSERT INTO layanan (nama, deskripsi, persyaratan, template_dokumen)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      serviceData.nama,
      serviceData.deskripsi || null,
      serviceData.persyaratan || null,
      serviceData.template_dokumen || null
    ];
    
    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async update(id, serviceData) {
    const fields = Object.keys(serviceData).filter(key => key !== 'id');
    const values = fields.map(field => serviceData[field]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `UPDATE layanan SET ${setClause}, updated_at = NOW() WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM layanan WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
}

export class ServiceSubmission {
  static async getAll() {
    const query = 'SELECT * FROM pengajuan_layanan ORDER BY created_at DESC';
    return await executeQuery(query);
  }

  static async create(submissionData) {
    const nomorPengajuan = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    
    const query = `
      INSERT INTO pengajuan_layanan (layanan_id, nomor_pengajuan, nama, nik, file_pendukung, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `;
    const params = [
      submissionData.layanan_id,
      nomorPengajuan,
      submissionData.nama,
      submissionData.nik,
      submissionData.file_pendukung || null
    ];
    
    await executeQuery(query, params);
    
    return await executeQuerySingle(
      'SELECT * FROM pengajuan_layanan WHERE nomor_pengajuan = ?',
      [nomorPengajuan]
    );
  }

  static async updateStatus(id, status, catatan = null) {
    const query = 'UPDATE pengajuan_layanan SET status = ?, catatan = ?, updated_at = NOW() WHERE id = ?';
    await executeQuery(query, [status, catatan, id]);
    return true;
  }
}
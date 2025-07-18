// models/Admin.js
import { executeQuery, executeQuerySingle } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class Admin {
  /**
   * Cari admin berdasarkan email.
   * @param {string} email - Email admin
   * @returns {Promise<Object|null>} Data admin atau null jika tidak ditemukan
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM admins WHERE email = ?';
    return await executeQuerySingle(query, [email]);
  }

  /**
   * Buat admin baru dengan password yang di-hash.
   * @param {Object} adminData - Data admin { nama, email, password }
   * @returns {Promise<number>} ID admin yang baru dibuat
   */
  static async create(adminData) {
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    const query = `
      INSERT INTO admins (nama, email, password)
      VALUES (?, ?, ?)
    `;
    const params = [
      adminData.nama,
      adminData.email,
      hashedPassword
    ];

    const result = await executeQuery(query, params);
    return result.insertId;
  }

  /**
   * Verifikasi kecocokan password yang diinput dengan password hash.
   * @param {string} plainPassword - Password asli
   * @param {string} hashedPassword - Password yang telah di-hash
   * @returns {Promise<boolean>} True jika cocok, false jika tidak
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Update kolom `last_login` berdasarkan ID admin.
   * @param {number} id - ID admin
   * @returns {Promise<void>}
   */
  static async updateLastLogin(id) {
    const query = 'UPDATE admins SET last_login = NOW() WHERE id = ?';
    await executeQuery(query, [id]);
  }
}

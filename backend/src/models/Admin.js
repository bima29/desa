import { executeQuery, executeQuerySingle } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class Admin {
  /**
   * Cari admin berdasarkan email.
   * @param {string} email - Email admin
   * @returns {Promise<Object|null>} Data admin atau null jika tidak ditemukan
   */
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM admins WHERE email = ?';
      return await executeQuerySingle(query, [email]);
    } catch (error) {
      console.error('Error in Admin.findByEmail:', error);
      return null;
    }
  }

  /**
   * Buat admin baru dengan password yang di-hash.
   * @param {Object} adminData - Data admin { nama, email, password }
   * @returns {Promise<number|null>} ID admin yang baru dibuat atau null jika gagal
   */
  static async create(adminData) {
    try {
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
    } catch (error) {
      console.error('Error in Admin.create:', error);
      return null;
    }
  }

  /**
   * Verifikasi kecocokan password yang diinput dengan password hash.
   * @param {string} plainPassword - Password asli
   * @param {string} hashedPassword - Password yang telah di-hash
   * @returns {Promise<boolean>} True jika cocok, false jika tidak atau error
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error in Admin.verifyPassword:', error);
      return false;
    }
  }

  /**
   * Update kolom `last_login` berdasarkan ID admin.
   * @param {number} id - ID admin
   * @returns {Promise<boolean>} True jika berhasil, false jika gagal
   */
  static async updateLastLogin(id) {
    try {
      const query = 'UPDATE admins SET last_login = NOW() WHERE id = ?';
      await executeQuery(query, [id]);
      return true;
    } catch (error) {
      console.error('Error in Admin.updateLastLogin:', error);
      return false;
    }
  }
}

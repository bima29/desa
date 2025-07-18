import { executeQuery, executeQuerySingle } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class Admin {
  static async findByEmail(email) {
    const query = 'SELECT * FROM admins WHERE email = ?';
    return await executeQuerySingle(query, [email]);
  }

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

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateLastLogin(id) {
    const query = 'UPDATE admins SET last_login = NOW() WHERE id = ?';
    await executeQuery(query, [id]);
  }
}
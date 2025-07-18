import { executeQuery, executeQuerySingle } from '../config/database.js';

export class News {
  static async getAll(page = 1, limit = 10, status = 'published') {
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    if (status !== 'all') {
      whereClause = 'WHERE status = ?';
      params.push(status);
    }
    
    const countQuery = `SELECT COUNT(*) as total FROM news ${whereClause}`;
    const dataQuery = `SELECT * FROM news ${whereClause} ORDER BY tanggal DESC LIMIT ? OFFSET ?`;
    
    const [countResult, newsData] = await Promise.all([
      executeQuerySingle(countQuery, params),
      executeQuery(dataQuery, [...params, limit, offset])
    ]);
    
    return {
      data: newsData,
      total: countResult?.total || 0,
      page,
      limit,
      totalPages: Math.ceil((countResult?.total || 0) / limit)
    };
  }

  static async getBySlug(slug) {
    const query = 'SELECT * FROM news WHERE slug = ? AND status = "published"';
    return await executeQuerySingle(query, [slug]);
  }

  static async create(newsData) {
    const query = `
      INSERT INTO news (judul, slug, konten, gambar, tanggal, penulis, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      newsData.judul,
      newsData.slug,
      newsData.konten,
      newsData.gambar || null,
      newsData.tanggal,
      newsData.penulis,
      newsData.status || 'draft'
    ];
    
    const result = await executeQuery(query, params);
    return result.insertId;
  }

  static async update(id, newsData) {
    const fields = Object.keys(newsData).filter(key => key !== 'id');
    const values = fields.map(field => newsData[field]);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `UPDATE news SET ${setClause}, updated_at = NOW() WHERE id = ?`;
    await executeQuery(query, [...values, id]);
    return true;
  }

  static async delete(id) {
    const query = 'DELETE FROM news WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
}
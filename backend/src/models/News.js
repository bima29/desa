import { executeQuery, executeQuerySingle } from '../config/database.js';

export class News {
  /**
   * Fetch paginated news items with optional status filter.
   * Returns an object: { data, total, page, limit, totalPages }
   */
  static async getAll(page = 1, limit = 10, status = 'published') {
    const offset = (page - 1) * limit;
    const params = [status, limit, offset];

    // Fetch paginated data
    const dataQuery = `
      SELECT id, judul, slug, konten, gambar, tanggal, penulis, status
      FROM news
      WHERE status = ?
      ORDER BY tanggal DESC
      LIMIT ? OFFSET ?
    `;
    const newsData = await executeQuery(dataQuery, params);

    // Fetch total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM news
      WHERE status = ?
    `;
    const countResult = await executeQuerySingle(countQuery, [status]);
    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: newsData,
      total,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Fetch single news by slug (only published)
   */
  static async getBySlug(slug) {
    const query = `
      SELECT id, judul, slug, konten, gambar, tanggal, penulis, status
      FROM news
      WHERE slug = ? AND status = 'published'
      LIMIT 1
    `;
    return await executeQuerySingle(query, [slug]);
  }

  /**
   * Create a new news item, returns the inserted id
   */
  static async create(newsData) {
    const query = `
      INSERT INTO news
        (judul, slug, konten, gambar, tanggal, penulis, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const params = [
      newsData.judul,
      newsData.slug,
      newsData.konten,
      newsData.gambar || null,
      newsData.tanggal || new Date(),
      newsData.penulis || 'admin',
      newsData.status || 'draft'
    ];
    const result = await executeQuery(query, params);
    return result.insertId;
  }

  /**
   * Update existing news by id
   */
  static async update(id, newsData) {
    const fields = [];
    const values = [];
    Object.entries(newsData).forEach(([key, value]) => {
      if (key !== 'id') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    const setClause = fields.join(', ');
    const query = `
      UPDATE news
      SET ${setClause}, updated_at = NOW()
      WHERE id = ?
    `;
    await executeQuery(query, [...values, id]);
    return true;
  }

  /**
   * Delete a news item by id
   */
  static async delete(id) {
    const query = 'DELETE FROM news WHERE id = ?';
    await executeQuery(query, [id]);
    return true;
  }
}

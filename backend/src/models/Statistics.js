import { db } from '../config/database.js';

class Statistics {
  static async getTotal(tableName) {
    try {
      const [result] = await db.query(
        `SELECT COUNT(id) AS total FROM ${tableName}`
      );
      return result[0]?.total || 0;
    } catch (error) {
      console.error(`Error getting total for ${tableName}:`, error);
      throw new Error(`Failed to get total for ${tableName}`);
    }
  }

  static async getAll() {
    try {
      const [news, galleries, events, submissions] = await Promise.all([
        this.getTotal('news'),
        this.getTotal('galleries'),
        this.getTotal('events'),
        this.getTotal('pengajuan_layanan')
      ]);

      return {
        news,
        gallery: galleries,
        events,
        submissions,
        documents: 0 // Default value
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw new Error('Failed to fetch statistics');
    }
  }
}

export default Statistics;
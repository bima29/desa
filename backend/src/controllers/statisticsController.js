import { executeQuerySingle } from '../config/database.js';

export const getStatistics = async (req, res) => {
  try {
    const [newsCount, galleryCount, eventsCount, submissionsCount] = await Promise.all([
      executeQuerySingle('SELECT COUNT(*) as count FROM news'),
      executeQuerySingle('SELECT COUNT(*) as count FROM galleries'),
      executeQuerySingle('SELECT COUNT(*) as count FROM events'),
      executeQuerySingle('SELECT COUNT(*) as count FROM pengajuan_layanan')
    ]);

    const statistics = {
      news: newsCount?.count || 0,
      gallery: galleryCount?.count || 0,
      events: eventsCount?.count || 0,
      submissions: submissionsCount?.count || 0,
      documents: 0
    };

    res.json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};
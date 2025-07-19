import Statistics from '../models/Statistics.js';

export const getStatistics = async (req, res) => {
  try {
    const statistics = await Statistics.getAll();

    res.status(200).json({
      success: true,
      data: statistics
    });
  } catch (error) {
    console.error('Error in statistics controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch statistics'
    });
  }
};
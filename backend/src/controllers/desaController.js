import { DesaSettings } from '../models/DesaSettings.js';

export const getDesaSettings = async (req, res) => {
  try {
    const settings = await DesaSettings.getSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching desa settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch desa settings'
    });
  }
};

export const updateDesaSettings = async (req, res) => {
  try {
    await DesaSettings.updateSettings(req.body);
    res.json({
      success: true,
      message: 'Desa settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating desa settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update desa settings'
    });
  }
};
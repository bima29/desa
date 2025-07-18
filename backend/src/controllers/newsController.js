import { News } from '../models/News.js';

export const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published' } = req.query;
    const result = await News.getAll(parseInt(page), parseInt(limit), status);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news'
    });
  }
};

export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const news = await News.getBySlug(slug);
    
    if (!news) {
      return res.status(404).json({
        success: false,
        message: 'News not found'
      });
    }
    
    res.json({
      success: true,
      data: news
    });
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news'
    });
  }
};

export const createNews = async (req, res) => {
  try {
    const newsData = {
      ...req.body,
      tanggal: new Date(),
      slug: req.body.judul.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-')
    };
    
    const id = await News.create(newsData);
    
    res.status(201).json({
      success: true,
      data: { id },
      message: 'News created successfully'
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create news'
    });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    await News.update(parseInt(id), req.body);
    
    res.json({
      success: true,
      message: 'News updated successfully'
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update news'
    });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    await News.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'News deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete news'
    });
  }
};
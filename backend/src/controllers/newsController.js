import { News } from '../models/News.js';
import fs from 'fs/promises';
import path from 'path';

// Constants for file handling
const NEWS_UPLOAD_PATH = path.join('public', 'assets', 'news');
const BASE_URL_PATH = '/backend-assets/news';

// Helper to build full URL for images
const buildImageUrl = (req, filename) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const baseUrl = `${protocol}://${host}`.replace(/([^:]\/)\/+/g, '$1');
  return `${baseUrl}${BASE_URL_PATH}/${filename}`;
};

export const getAllNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published' } = req.query;
    const result = await News.getAll(parseInt(page), parseInt(limit), status);

    // Validate and map image URLs
    const dataWithImages = await Promise.all(
      result.data.map(async item => {
        if (!item.gambar) return item;
        const imagePath = path.join(NEWS_UPLOAD_PATH, item.gambar);
        try {
          await fs.access(imagePath);
          return { ...item, gambar: buildImageUrl(req, item.gambar) };
        } catch {
          return { ...item, gambar: null, warning: 'Image file not found on server' };
        }
      })
    );

    res.json({
      success: true,
      data: dataWithImages,
      total: result.total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: result.totalPages,
      imageBasePath: buildImageUrl(req, '')  // trailing slash handled by client
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch news' });
  }
};

export const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const news = await News.getBySlug(slug);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    if (news.gambar) {
      const imagePath = path.join(NEWS_UPLOAD_PATH, news.gambar);
      try {
        await fs.access(imagePath);
        news.gambar = buildImageUrl(req, news.gambar);
      } catch {
        news.gambar = null;
        news.warning = 'Image file not found on server';
      }
    }

    res.json({ success: true, data: news });
  } catch (error) {
    console.error('Error fetching news by slug:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch news' });
  }
};

export const createNews = async (req, res) => {
  try {
    // Expect file middleware (e.g., multer) to provide req.file
    const newsData = {
      ...req.body,
      tanggal: new Date(),
      slug: req.body.judul
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .trim()
        .replace(/\s+/g, '-'),
      gambar: req.file ? req.file.filename : null
    };

    const id = await News.create(newsData);
    const created = await News.getById(id);

    if (created.gambar) {
      created.gambar = buildImageUrl(req, created.gambar);
    }

    res.status(201).json({ success: true, data: created, message: 'News created successfully' });
  } catch (error) {
    console.error('Error creating news:', error);
    // Cleanup upload on failure
    if (req.file) {
      await fs.unlink(path.join(NEWS_UPLOAD_PATH, req.file.filename)).catch(console.error);
    }
    res.status(500).json({ success: false, message: 'Failed to create news' });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await News.getById(parseInt(id));
    if (!existing) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }

    // Prepare update data
    const updateData = { ...req.body };
    if (req.file) {
      updateData.gambar = req.file.filename;
      // remove old file
      await fs.unlink(path.join(NEWS_UPLOAD_PATH, existing.gambar)).catch(console.warn);
    }

    await News.update(parseInt(id), updateData);
    const updated = await News.getById(parseInt(id));

    if (updated.gambar) {
      updated.gambar = buildImageUrl(req, updated.gambar);
    }

    res.json({ success: true, data: updated, message: 'News updated successfully' });
  } catch (error) {
    console.error('Error updating news:', error);
    if (req.file) {
      await fs.unlink(path.join(NEWS_UPLOAD_PATH, req.file.filename)).catch(console.error);
    }
    res.status(500).json({ success: false, message: 'Failed to update news' });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await News.getById(parseInt(id));
    if (!news) {
      return res.status(404).json({ success: false, message: 'News item not found' });
    }

    await News.delete(parseInt(id));
    // delete file
    if (news.gambar) {
      await fs.unlink(path.join(NEWS_UPLOAD_PATH, news.gambar)).catch(console.warn);
    }

    res.json({ success: true, message: 'News deleted successfully', deletedId: parseInt(id) });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ success: false, message: 'Failed to delete news' });
  }
};

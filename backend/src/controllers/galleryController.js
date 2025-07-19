import { Gallery } from '../models/Gallery.js';
import fs from 'fs/promises';
import path from 'path';

// Constants for file handling - aligned with server.js configuration
const GALLERY_UPLOAD_PATH = path.join('public', 'assets', 'gallery');
const BASE_URL_PATH = '/backend-assets/gallery';

export const getAllGalleries = async (req, res) => {
  try {
    const { kategori } = req.query;
    
    // Get galleries from model
    let galleries = await Gallery.getAll(kategori);
    
    // Handle reverse proxy headers for base URL
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`.replace(/([^:]\/)\/+/g, '$1');
    
    // Add full image URLs and validate image existence
    const validatedGalleries = await Promise.all(
      galleries.map(async gallery => {
        const imagePath = path.join(GALLERY_UPLOAD_PATH, gallery.gambar);
        
        try {
          await fs.access(imagePath);
          return {
            ...gallery,
            gambar: `${baseUrl}${BASE_URL_PATH}/${gallery.gambar}`
          };
        } catch (error) {
          console.warn(`Image not found: ${imagePath}`);
          return {
            ...gallery,
            gambar: null,
            warning: 'Image file not found on server'
          };
        }
      })
    );
    
    res.json({ 
      success: true, 
      data: validatedGalleries,
      count: validatedGalleries.length,
      imageBasePath: `${baseUrl}${BASE_URL_PATH}/`
    });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch galleries',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.getById(parseInt(id));
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    // Handle reverse proxy headers
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    // Verify image exists
    const imagePath = path.join(GALLERY_UPLOAD_PATH, gallery.gambar);
    try {
      await fs.access(imagePath);
      gallery.gambar = `${baseUrl}${BASE_URL_PATH}/${gallery.gambar}`;
    } catch (error) {
      console.warn(`Image not found: ${imagePath}`);
      gallery.gambar = null;
      gallery.warning = 'Image file not found on server';
    }
    
    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const createGallery = async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.judul || !req.body.kategori || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Judul, kategori, and image file are required'
      });
    }
    
    // Ensure upload directory exists
    await fs.mkdir(GALLERY_UPLOAD_PATH, { recursive: true });
    
    const galleryData = {
      judul: req.body.judul,
      deskripsi: req.body.deskripsi || null,
      kategori: req.body.kategori,
      gambar: req.file.filename,
      tanggal: new Date().toISOString().split('T')[0] // Store date in YYYY-MM-DD format
    };
    
    const id = await Gallery.create(galleryData);
    
    // Handle reverse proxy headers for URL construction
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    res.status(201).json({
      success: true,
      data: { 
        id,
        ...galleryData,
        gambar: `${baseUrl}${BASE_URL_PATH}/${req.file.filename}`
      },
      message: 'Gallery item created successfully'
    });
  } catch (error) {
    console.error('Error creating gallery:', error);
    
    // Clean up uploaded file if creation failed
    if (req.file) {
      try {
        await fs.unlink(path.join(GALLERY_UPLOAD_PATH, req.file.filename));
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const existingGallery = await Gallery.getById(parseInt(id));
    
    if (!existingGallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    const updateData = {
      judul: req.body.judul || existingGallery.judul,
      deskripsi: req.body.deskripsi || existingGallery.deskripsi,
      kategori: req.body.kategori || existingGallery.kategori
    };
    
    // Handle image update if new file was uploaded
    if (req.file) {
      updateData.gambar = req.file.filename;
      
      // Delete old image file
      try {
        await fs.unlink(path.join(GALLERY_UPLOAD_PATH, existingGallery.gambar));
      } catch (error) {
        console.warn('Could not delete old image file:', error);
      }
    }
    
    await Gallery.update(parseInt(id), updateData);
    
    // Handle reverse proxy headers for URL construction
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: {
        ...updateData,
        id: parseInt(id),
        ...(req.file && {
          gambar: `${baseUrl}${BASE_URL_PATH}/${req.file.filename}`
        })
      }
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    
    // Clean up new uploaded file if update failed
    if (req.file) {
      try {
        await fs.unlink(path.join(GALLERY_UPLOAD_PATH, req.file.filename));
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.getById(parseInt(id));
    
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    // Delete the database record
    await Gallery.delete(parseInt(id));
    
    // Delete the associated image file
    try {
      await fs.unlink(path.join(GALLERY_UPLOAD_PATH, gallery.gambar));
    } catch (error) {
      console.warn('Could not delete image file:', error);
      // We still consider this a success since the DB record was deleted
    }
    
    res.json({
      success: true,
      message: 'Gallery item deleted successfully',
      deletedId: parseInt(id)
    });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
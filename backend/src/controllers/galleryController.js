import { Gallery } from '../models/Gallery.js';

export const getAllGalleries = async (req, res) => {
  try {
    const { kategori } = req.query;
    const galleries = await Gallery.getAll(kategori);
    
    res.json({
      success: true,
      data: galleries
    });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch galleries'
    });
  }
};

export const createGallery = async (req, res) => {
  try {
    const galleryData = {
      ...req.body,
      tanggal: new Date()
    };
    
    const id = await Gallery.create(galleryData);
    
    res.status(201).json({
      success: true,
      data: { id },
      message: 'Gallery item created successfully'
    });
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item'
    });
  }
};

export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.update(parseInt(id), req.body);
    
    res.json({
      success: true,
      message: 'Gallery item updated successfully'
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item'
    });
  }
};

export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    await Gallery.delete(parseInt(id));
    
    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item'
    });
  }
};
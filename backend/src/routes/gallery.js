import express from 'express';
import { 
  getAllGalleries, 
  createGallery, 
  updateGallery, 
  deleteGallery 
} from '../controllers/galleryController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, gallerySchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllGalleries);

// Protected routes
router.post('/', authenticateToken, validateRequest(gallerySchema), createGallery);
router.put('/:id', authenticateToken, validateRequest(gallerySchema), updateGallery);
router.delete('/:id', authenticateToken, deleteGallery);

export default router;
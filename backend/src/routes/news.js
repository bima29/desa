import express from 'express';
import { 
  getAllNews, 
  getNewsBySlug, 
  createNews, 
  updateNews, 
  deleteNews 
} from '../controllers/newsController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, newsSchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/:slug', getNewsBySlug);

// Protected routes
router.post('/', authenticateToken, validateRequest(newsSchema), createNews);
router.put('/:id', authenticateToken, validateRequest(newsSchema), updateNews);
router.delete('/:id', authenticateToken, deleteNews);

export default router;
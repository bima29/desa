import express from 'express';
import { 
  getAllEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../controllers/eventController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, eventSchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllEvents);

// Protected routes
router.post('/', authenticateToken, validateRequest(eventSchema), createEvent);
router.put('/:id', authenticateToken, validateRequest(eventSchema), updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

export default router;
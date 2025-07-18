import express from 'express';
import { 
  getAllServices, 
  createService, 
  updateService, 
  deleteService,
  getAllSubmissions,
  createSubmission,
  updateSubmissionStatus
} from '../controllers/serviceController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, serviceSchema, serviceSubmissionSchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.post('/submissions', validateRequest(serviceSubmissionSchema), createSubmission);

// Protected routes
router.post('/', authenticateToken, validateRequest(serviceSchema), createService);
router.put('/:id', authenticateToken, validateRequest(serviceSchema), updateService);
router.delete('/:id', authenticateToken, deleteService);

// Submission management (protected)
router.get('/submissions', authenticateToken, getAllSubmissions);
router.put('/submissions/:id/status', authenticateToken, updateSubmissionStatus);

export default router;
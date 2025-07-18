import express from 'express';
import { 
  getAllOrganization, 
  createOrganization, 
  updateOrganization, 
  deleteOrganization 
} from '../controllers/organizationController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, organizationSchema } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getAllOrganization);

// Protected routes
router.post('/', authenticateToken, validateRequest(organizationSchema), createOrganization);
router.put('/:id', authenticateToken, validateRequest(organizationSchema), updateOrganization);
router.delete('/:id', authenticateToken, deleteOrganization);

export default router;
import express from 'express';
import { getDesaSettings, updateDesaSettings } from '../controllers/desaController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/settings', getDesaSettings);

// Protected routes
router.put('/settings', authenticateToken, updateDesaSettings);

export default router;
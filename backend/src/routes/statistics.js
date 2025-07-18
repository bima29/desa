import express from 'express';
import { getStatistics } from '../controllers/statisticsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getStatistics);

export default router;
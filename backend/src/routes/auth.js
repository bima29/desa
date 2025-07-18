import express from 'express';
import { login, register, verifyToken } from '../controllers/authController.js';
import { validateRequest, loginSchema } from '../middleware/validation.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), login);
router.post('/register', register);
router.get('/verify', authenticateToken, verifyToken);

export default router;
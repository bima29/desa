import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

// Validasi awal: pastikan JWT_SECRET didefinisikan
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

// Middleware untuk autentikasi wajib
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('🔐 Authorization header:', authHeader);

    const token = req.headers.authorization?.split(' ')[1];
    console.log('🔍 Extracted token:', token);

    if (!token) {
      console.warn('⚠️ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded token:', decoded);

    const admin = await Admin.findByEmail(decoded.email);
    if (!admin) {
      console.warn('🚫 Admin not found for decoded token');
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    req.admin = admin; // Inject admin info ke request
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error.message);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Middleware untuk autentikasi opsional (misal: frontend publik)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const admin = await Admin.findByEmail(decoded.email);
      if (admin) {
        req.admin = admin; // Inject admin jika valid
      }
    }

    next(); // Tetap lanjut walaupun tidak ada token
  } catch (error) {
    console.warn('⚠️ Optional auth failed but continuing:', error.message);
    next(); // Tetap lanjut walaupun token tidak valid
  }
};

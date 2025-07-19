// === LOAD ENV FIRST ===
import './config/env.js'; 

// === IMPORT MODULES ===
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { initializeDatabase } from './config/database.js';

// === IMPORT ROUTES ===
import desaRoutes from './routes/desa.js';
import newsRoutes from './routes/news.js';
import galleryRoutes from './routes/gallery.js';
import eventsRoutes from './routes/events.js';
import organizationRoutes from './routes/organization.js';
import servicesRoutes from './routes/services.js';
import authRoutes from './routes/auth.js';
import statisticsRoutes from './routes/statistics.js';

// === INIT EXPRESS APP ===
const app = express();
const PORT = process.env.PORT || 5000;

// === SECURITY HEADERS (helmet) ===
app.use(helmet());

// === RATE LIMITER ===
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100,
    message: {
      success: false,
      message: 'Too many requests from this IP, please try again later.',
    },
  })
);

// === CORS CONFIGURATION ===
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// === BODY PARSER (JSON & FORM) ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// === HEALTH CHECK ROUTE ===
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// === API ROUTES ===
app.use('/api/desa', desaRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/statistics', statisticsRoutes);

// === 404 ROUTE HANDLER ===
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// === GLOBAL ERROR HANDLER ===
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
});

// === START SERVER & CONNECT DB ===
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// === LOAD ENV FIRST ===
import './config/env.js';

// === IMPORT MODULES ===
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './config/database.js';

// === DIRNAME CONFIGURATION (ES Modules fix) ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use(
  helmet({
    // override default yang 'same-origin'
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// === RATE LIMITER ===
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// === CORS CONFIGURATION ===
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

app.use(
  '/backend-assets',
  express.static(
    path.join(__dirname, '..', 'public', 'assets'),  // jadi langsung ke folder assets
    {
      dotfiles: 'ignore',
      etag: true,
      maxAge: '7d',
      setHeaders: (res, filePath) => {
        res.set('X-Content-Type-Options', 'nosniff');
        res.set('X-Frame-Options', 'DENY');

        if (filePath.endsWith('.html')) {
          res.set('Cache-Control', 'no-store');
        } else if (/\.(jpg|jpeg|png|gif|webp|svg|mp4|mov|avi)$/i.test(filePath)) {
          res.set('Cache-Control', 'public, max-age=2592000, immutable');
        } else if (/\.(js|css)$/i.test(filePath)) {
          res.set('Cache-Control', 'public, max-age=86400');
        } else if (filePath.includes('gallery')) {
          res.set('Cache-Control', 'public, max-age=2592000');
        }
      }
    }
  )
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
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime()
  });
});

// === API ROUTES ===
// Public routes
app.use('/api/desa', desaRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/galleries', galleryRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/services', servicesRoutes);

// Statistics route (public)
app.use('/api/statistics', statisticsRoutes);

// Authentication routes
app.use('/api/auth', authRoutes);

// === 404 ROUTE HANDLER ===
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    requestedUrl: req.originalUrl,
    availableEndpoints: [
      '/api/desa',
      '/api/news',
      '/api/galleries',
      '/api/events',
      '/api/organization',
      '/api/services',
      '/api/statistics',
      '/api/auth'
    ]
  });
});

// === GLOBAL ERROR HANDLER ===
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  const response = {
    success: false,
    message: error.message || 'Internal server error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
    response.fullError = error;
  }

  res.status(error.status || 500).json(response);
});

// === START SERVER & CONNECT DB ===
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`
      🚀 Server running on port ${PORT}
      📊 Health check: http://localhost:${PORT}/health
      🔗 API base URL: http://localhost:${PORT}/api
      🌍 Environment: ${process.env.NODE_ENV || 'development'}
      📁 Static files: http://localhost:${PORT}/backend-assets
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
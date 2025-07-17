
const express = require('express');
const cors = require('cors');
const path = require('path');

// Route imports
const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internships');
const applicationRoutes = require('./routes/applications');
const userRoutes = require('./routes/users');

const app = express();

// ===============================================
// SECURITY MIDDLEWARE
// ===============================================

// CORS - Allow cross-origin requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===============================================
// TEST ROUTES
// ===============================================

// Base route
app.get('/', (req, res) => {
  res.json({
    message: '🎓 Nexaid API - Internship Platform',
    version: '1.0.0',
    status: 'Development in progress'
  });
});

// API test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ API working correctly!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ===============================================
// API ROUTES
// ===============================================

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);

// ===============================================
// ERROR HANDLERS
// ===============================================

// Middleware for 404 routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
});

// Test models and controllers
try {
  const User = require('./models/User');
  const Internship = require('./models/Internship');
  const Application = require('./models/Application');
  console.log('✅ Models loaded successfully!');
  
  const authController = require('./controllers/authController');
  const internshipController = require('./controllers/internshipController');
  const applicationController = require('./controllers/applicationController');
  console.log('✅ Controllers loaded successfully!');
} catch (error) {
  console.error('❌ Error loading models/controllers:', error.message);
}

module.exports = app;
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://ally21-salon.vercel.app',
    'https://ally21-salon-h7ckl9z6i-harsh2504s-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Welcome to the Salon Management App!');
  });

// Test route for error handling
app.get('/test-error', (req, res, next) => {
  const error = new Error('This is a test error!');
  error.status = 400; // Custom status code
  next(error);
});

//locahost:3000/api/users/profile
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/leave-requests', leaveRoutes); // Alias for leave routes
app.use('/api/services', serviceRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', dashboardRoutes); // For /api/bookings route
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler);

// Database connection
connectDB();

module.exports = app;

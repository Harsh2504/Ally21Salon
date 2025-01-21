const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const leaveRoutes = require('./routes/leaveRoutes');

const app = express();

// Middleware
app.use(cors());
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


// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/leaves', leaveRoutes);

// Error handling middleware
const { errorHandler } = require('./middlewares/errorHandler');
app.use(errorHandler);

// Database connection
connectDB();

module.exports = app;

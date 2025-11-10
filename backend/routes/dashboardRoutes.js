const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validateQuery } = require('../middlewares/zodValidation');
const { dashboard } = require('../validations');
const {
  getDashboardStats,
  getRevenue,
  getPopularServices,
  getRecentBookings
} = require('../controllers/dashboardController');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Manager only)
router.get('/stats', protect, authorize('manager'), validateQuery(dashboard.dashboardStatsSchema.shape.query), getDashboardStats);

// @route   GET /api/dashboard/revenue
// @desc    Get revenue data for charts
// @access  Private (Manager only)
router.get('/revenue', protect, authorize('manager'), validateQuery(dashboard.revenueSchema.shape.query), getRevenue);

// @route   GET /api/bookings
// @desc    Get recent bookings (mock)
// @access  Private (Manager only)
router.get('/bookings', protect, authorize('manager'), validateQuery(dashboard.recentBookingsSchema.shape.query), getRecentBookings);

module.exports = router;
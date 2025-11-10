const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate, validateQuery, validateParams, validateBody } = require('../middlewares/zodValidation');
const { notification } = require('../validations');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  markMultipleAsRead,
  deleteNotification,
  archiveNotification,
  createNotification,
  sendAnnouncement,
  getNotificationStats
} = require('../controllers/notificationController');

// @route   GET /api/notifications
// @desc    Get notifications for current user
// @access  Private
router.get('/', protect, validateQuery(notification.getNotificationsSchema.shape.query), getNotifications);

// @route   GET /api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', protect, getUnreadCount);

// @route   GET /api/notifications/stats
// @desc    Get notification statistics (managers only)
// @access  Private (Manager only)
router.get('/stats', protect, authorize('manager'), validateQuery(notification.notificationStatsSchema.shape.query), getNotificationStats);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protect, validateParams(notification.notificationIdSchema.shape.params), markAsRead);

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', protect, markAllAsRead);

// @route   PUT /api/notifications/mark-multiple-read
// @desc    Mark multiple notifications as read
// @access  Private
router.put('/mark-multiple-read', protect, validateBody(notification.markMultipleAsReadSchema.shape.body), markMultipleAsRead);

// @route   PUT /api/notifications/:id/archive
// @desc    Archive notification
// @access  Private
router.put('/:id/archive', protect, validateParams(notification.notificationIdSchema.shape.params), archiveNotification);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', protect, validateParams(notification.notificationIdSchema.shape.params), deleteNotification);

// @route   POST /api/notifications
// @desc    Create notification (managers only)
// @access  Private (Manager only)
router.post('/', protect, authorize('manager'), validateBody(notification.createNotificationSchema.shape.body), createNotification);

// @route   POST /api/notifications/announcement
// @desc    Send announcement to all users or by role (managers only)
// @access  Private (Manager only)
router.post('/announcement', protect, authorize('manager'), validateBody(notification.sendAnnouncementSchema.shape.body), sendAnnouncement);

module.exports = router;
const { z } = require('zod');

// Common ObjectId schema
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// Get notifications query schema
const getNotificationsSchema = z.object({
  query: z.object({
    page: z.union([
      z.string().regex(/^\d+$/, 'Page must be a number').transform(Number),
      z.number().int().min(1)
    ]).optional().default(1),
    limit: z.union([
      z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number),
      z.number().int().min(1).max(100)
    ]).optional().default(20),
    type: z.enum([
      'announcement', 
      'reminder', 
      'alert', 
      'booking', 
      'shift', 
      'leave', 
      'system'
    ]).optional(),
    category: z.enum([
      'announcement',
      'booking',
      'shift',
      'leave',
      'system',
      'reminder',
      'alert'
    ]).optional(),
    isRead: z.enum(['true', 'false']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
  })
});

// Mark notification as read param schema
const notificationIdSchema = z.object({
  params: z.object({
    id: objectIdSchema
  })
});

// Mark multiple notifications as read schema
const markMultipleAsReadSchema = z.object({
  body: z.object({
    notificationIds: z.array(objectIdSchema).min(1, 'At least one notification ID is required')
  })
});

// Create notification schema
const createNotificationSchema = z.object({
  body: z.object({
    recipient: objectIdSchema.optional(),
    recipients: z.array(objectIdSchema).optional(),
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message cannot exceed 1000 characters'),
    type: z.enum([
      'announcement', 
      'reminder', 
      'alert', 
      'booking', 
      'shift', 
      'leave', 
      'system'
    ]),
    category: z.enum([
      'announcement',
      'booking',
      'shift',
      'leave',
      'system',
      'reminder',
      'alert'
    ]),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    actionUrl: z.string().url('Invalid action URL').optional(),
    actionText: z.string().max(50, 'Action text cannot exceed 50 characters').optional(),
    data: z.object({}).passthrough().optional().default({}),
    scheduledFor: z.string().refine((date) => {
      return !isNaN(Date.parse(date));
    }, 'Invalid date format').optional(),
    expiresAt: z.string().refine((date) => {
      return !isNaN(Date.parse(date));
    }, 'Invalid date format').optional()
  }).refine((data) => {
    // Must have either recipient or recipients
    return data.recipient || (data.recipients && data.recipients.length > 0);
  }, {
    message: 'Either recipient or recipients must be provided',
    path: ['recipient']
  }).refine((data) => {
    // If scheduledFor is provided, it should be in the future
    if (data.scheduledFor) {
      return new Date(data.scheduledFor) > new Date();
    }
    return true;
  }, {
    message: 'Scheduled date must be in the future',
    path: ['scheduledFor']
  }).refine((data) => {
    // If expiresAt is provided, it should be in the future
    if (data.expiresAt) {
      return new Date(data.expiresAt) > new Date();
    }
    return true;
  }, {
    message: 'Expiration date must be in the future',
    path: ['expiresAt']
  })
});

// Send announcement schema
const sendAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    message: z.string().min(1, 'Message is required').max(1000, 'Message cannot exceed 1000 characters'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    targetRole: z.enum(['employee', 'manager']).optional(),
    expiresAt: z.string().refine((date) => {
      return !isNaN(Date.parse(date));
    }, 'Invalid date format').optional()
  })
});

// Notification stats query schema
const notificationStatsSchema = z.object({
  query: z.object({
    period: z.enum(['week', 'month']).optional().default('week')
  })
});

module.exports = {
  getNotificationsSchema,
  notificationIdSchema,
  markMultipleAsReadSchema,
  createNotificationSchema,
  sendAnnouncementSchema,
  notificationStatsSchema
};
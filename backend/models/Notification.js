const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  message: {
    type: String,
    required: true,
    maxLength: 500
  },
  type: {
    type: String,
    required: true,
    enum: [
      'system',
      'shift_reminder',
      'shift_assignment',
      'shift_change',
      'leave_request',
      'leave_approved',
      'leave_rejected',
      'booking_confirmed',
      'booking_cancelled',
      'announcement',
      'performance',
      'warning'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['scheduling', 'leave', 'booking', 'system', 'performance', 'announcement'],
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  actionUrl: {
    type: String
  },
  actionText: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: {
    type: Date
  },
  scheduledFor: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for formatted time
notificationSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return this.createdAt.toLocaleDateString();
});

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  await notification.save();
  
  // TODO: Implement real-time notification (Socket.io)
  // io.to(data.recipient.toString()).emit('notification', notification);
  
  return notification;
};

// Static method to mark as read
notificationSchema.statics.markAsRead = async function(notificationId, userId) {
  return await this.findOneAndUpdate(
    { _id: notificationId, recipient: userId, isRead: false },
    { 
      isRead: true, 
      readAt: new Date() 
    },
    { new: true }
  );
};

// Static method to mark multiple as read
notificationSchema.statics.markMultipleAsRead = async function(notificationIds, userId) {
  return await this.updateMany(
    { 
      _id: { $in: notificationIds }, 
      recipient: userId, 
      isRead: false 
    },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    recipient: userId,
    isRead: false,
    isArchived: false
  });
};

// Method to check if notification is expired
notificationSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

// Method to archive notification
notificationSchema.methods.archive = async function() {
  this.isArchived = true;
  this.archivedAt = new Date();
  return await this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);
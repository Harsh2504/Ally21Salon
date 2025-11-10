const Notification = require('../models/Notification');

// Get notifications for current user
const getNotifications = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      isRead,
      priority
    } = req.query;

    const userId = req.user._id;

    // Build query
    const query = {
      recipient: userId,
      isArchived: false
    };

    if (type) query.type = type;
    if (category) query.category = category;
    if (isRead !== undefined) query.isRead = isRead === 'true';
    if (priority) query.priority = priority;

    const skip = (page - 1) * limit;

    const notifications = await Notification.find(query)
      .populate('sender', 'firstName lastName role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(userId);

    res.json({
      notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Get unread notifications count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await Notification.getUnreadCount(userId);
    
    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.markAsRead(id, userId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found or already read' });
    }

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { recipient: userId, isRead: false, isArchived: false },
      { 
        isRead: true, 
        readAt: new Date() 
      }
    );

    res.json({
      message: `Marked ${result.modifiedCount} notifications as read`
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

// Mark multiple notifications as read
const markMultipleAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const userId = req.user._id;

    const result = await Notification.markMultipleAsRead(notificationIds, userId);

    res.json({
      message: `Marked ${result.modifiedCount} notifications as read`
    });
  } catch (error) {
    console.error('Error marking multiple notifications as read:', error);
    res.status(500).json({ error: 'Failed to mark notifications as read' });
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};

// Archive notification
const archiveNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOne({
      _id: id,
      recipient: userId
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.archive();

    res.json({
      message: 'Notification archived successfully'
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    res.status(500).json({ error: 'Failed to archive notification' });
  }
};

// Create notification (for managers/system)
const createNotification = async (req, res) => {
  try {
    const {
      recipient,
      recipients,
      title,
      message,
      type,
      category,
      priority = 'medium',
      actionUrl,
      actionText,
      data = {},
      scheduledFor,
      expiresAt
    } = req.body;

    const senderId = req.user._id;

    // Handle single or multiple recipients
    const recipientList = recipients || [recipient];
    const notifications = [];

    for (const recipientId of recipientList) {
      const notificationData = {
        recipient: recipientId,
        sender: senderId,
        title,
        message,
        type,
        category,
        priority,
        actionUrl,
        actionText,
        data,
        scheduledFor,
        expiresAt
      };

      const notification = await Notification.createNotification(notificationData);
      notifications.push(notification);
    }

    res.status(201).json({
      message: `Created ${notifications.length} notification(s)`,
      notifications
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Failed to create notification' });
  }
};

// Send system announcement (managers only)
const sendAnnouncement = async (req, res) => {
  try {
    const {
      title,
      message,
      priority = 'medium',
      targetRole,
      expiresAt
    } = req.body;

    const senderId = req.user._id;

    // Get all users or users by role
    const User = require('../models/User');
    const query = targetRole ? { role: targetRole, isActive: true } : { isActive: true };
    const recipients = await User.find(query).select('_id');

    const notifications = [];

    for (const recipient of recipients) {
      if (recipient._id.toString() !== senderId.toString()) { // Don't send to sender
        const notificationData = {
          recipient: recipient._id,
          sender: senderId,
          title,
          message,
          type: 'announcement',
          category: 'announcement',
          priority,
          expiresAt
        };

        const notification = await Notification.createNotification(notificationData);
        notifications.push(notification);
      }
    }

    res.status(201).json({
      message: `Sent announcement to ${notifications.length} users`,
      notifications: notifications.length
    });
  } catch (error) {
    console.error('Error sending announcement:', error);
    res.status(500).json({ error: 'Failed to send announcement' });
  }
};

// Get notification statistics (for managers)
const getNotificationStats = async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const totalNotifications = await Notification.countDocuments({
      createdAt: { $gte: startDate }
    });

    const notificationsByType = await Notification.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const notificationsByPriority = await Notification.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const readRate = await Notification.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { 
        $group: { 
          _id: null, 
          total: { $sum: 1 },
          read: { $sum: { $cond: ['$isRead', 1, 0] } }
        } 
      }
    ]);

    const readPercentage = readRate.length > 0 ? 
      Math.round((readRate[0].read / readRate[0].total) * 100) : 0;

    res.json({
      totalNotifications,
      notificationsByType,
      notificationsByPriority,
      readRate: readPercentage
    });
  } catch (error) {
    console.error('Error getting notification stats:', error);
    res.status(500).json({ error: 'Failed to get notification statistics' });
  }
};

module.exports = {
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
};
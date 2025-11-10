const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['general', 'notifications', 'scheduling', 'payments', 'security', 'integrations']
  },
  key: {
    type: String,
    required: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  type: {
    type: String,
    required: true,
    enum: ['boolean', 'string', 'number', 'array', 'object']
  },
  options: [{
    label: String,
    value: mongoose.Schema.Types.Mixed
  }],
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    required: Boolean
  },
  isUserSpecific: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
settingsSchema.index({ category: 1, key: 1, userId: 1 }, { unique: true });

// Static method to get default settings
settingsSchema.statics.getDefaultSettings = function() {
  return [
    // General Settings
    {
      category: 'general',
      key: 'business_name',
      value: 'Elegant Beauty Salon',
      label: 'Business Name',
      description: 'The name of your salon business',
      type: 'string',
      validation: { required: true }
    },
    {
      category: 'general',
      key: 'business_address',
      value: '123 Beauty Street, City, State 12345',
      label: 'Business Address',
      description: 'Your salon address',
      type: 'string',
      validation: { required: true }
    },
    {
      category: 'general',
      key: 'business_phone',
      value: '(555) 123-4567',
      label: 'Business Phone',
      description: 'Main contact phone number',
      type: 'string',
      validation: { required: true, pattern: '^\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}$' }
    },
    {
      category: 'general',
      key: 'business_email',
      value: 'info@elegantbeauty.com',
      label: 'Business Email',
      description: 'Main contact email address',
      type: 'string',
      validation: { required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' }
    },
    {
      category: 'general',
      key: 'timezone',
      value: 'America/New_York',
      label: 'Timezone',
      description: 'Business timezone for scheduling',
      type: 'string',
      options: [
        { label: 'Eastern Time', value: 'America/New_York' },
        { label: 'Central Time', value: 'America/Chicago' },
        { label: 'Mountain Time', value: 'America/Denver' },
        { label: 'Pacific Time', value: 'America/Los_Angeles' }
      ]
    },
    
    // Scheduling Settings
    {
      category: 'scheduling',
      key: 'booking_advance_days',
      value: 30,
      label: 'Booking Advance Limit',
      description: 'Maximum days in advance customers can book',
      type: 'number',
      validation: { min: 1, max: 365 }
    },
    {
      category: 'scheduling',
      key: 'cancellation_hours',
      value: 24,
      label: 'Cancellation Notice Hours',
      description: 'Hours notice required for cancellations',
      type: 'number',
      validation: { min: 1, max: 168 }
    },
    {
      category: 'scheduling',
      key: 'working_hours',
      value: {
        monday: { open: '09:00', close: '18:00', enabled: true },
        tuesday: { open: '09:00', close: '18:00', enabled: true },
        wednesday: { open: '09:00', close: '18:00', enabled: true },
        thursday: { open: '09:00', close: '19:00', enabled: true },
        friday: { open: '09:00', close: '19:00', enabled: true },
        saturday: { open: '08:00', close: '17:00', enabled: true },
        sunday: { open: '10:00', close: '16:00', enabled: false }
      },
      label: 'Working Hours',
      description: 'Business operating hours by day',
      type: 'object'
    },
    
    // Notification Settings
    {
      category: 'notifications',
      key: 'email_notifications',
      value: true,
      label: 'Email Notifications',
      description: 'Enable email notifications',
      type: 'boolean',
      isUserSpecific: true
    },
    {
      category: 'notifications',
      key: 'booking_confirmations',
      value: true,
      label: 'Booking Confirmations',
      description: 'Send booking confirmation emails',
      type: 'boolean'
    },
    {
      category: 'notifications',
      key: 'reminder_hours',
      value: 24,
      label: 'Appointment Reminder Hours',
      description: 'Hours before appointment to send reminder',
      type: 'number',
      validation: { min: 1, max: 168 }
    },
    
    // Payment Settings
    {
      category: 'payments',
      key: 'payment_methods',
      value: ['cash', 'card', 'digital'],
      label: 'Accepted Payment Methods',
      description: 'Payment methods accepted by the salon',
      type: 'array',
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Credit/Debit Card', value: 'card' },
        { label: 'Digital Wallet', value: 'digital' }
      ]
    },
    {
      category: 'payments',
      key: 'tax_rate',
      value: 8.25,
      label: 'Tax Rate (%)',
      description: 'Sales tax percentage',
      type: 'number',
      validation: { min: 0, max: 50 }
    },
    
    // Security Settings
    {
      category: 'security',
      key: 'session_timeout',
      value: 30,
      label: 'Session Timeout (minutes)',
      description: 'Auto-logout time for security',
      type: 'number',
      validation: { min: 5, max: 480 },
      isUserSpecific: true
    },
    {
      category: 'security',
      key: 'password_expiry_days',
      value: 90,
      label: 'Password Expiry (days)',
      description: 'Days before password expires',
      type: 'number',
      validation: { min: 30, max: 365 }
    }
  ];
};

module.exports = mongoose.model('Settings', settingsSchema);
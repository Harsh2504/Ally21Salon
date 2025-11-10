const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Employee ID is required'],
  },
  date: {
    type: Date,
    required: [true, 'Shift date is required'],
  },
  startTime: {
    type: String, // Format: "09:00"
    required: [true, 'Start time is required'],
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid time format. Use HH:MM format (24-hour)',
    },
  },
  endTime: {
    type: String, // Format: "17:00"
    required: [true, 'End time is required'],
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Invalid time format. Use HH:MM format (24-hour)',
    },
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled', 'No Show'],
    default: 'Scheduled',
  },
  shiftType: {
    type: String,
    enum: ['Regular', 'Overtime', 'Holiday', 'Training'],
    default: 'Regular',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  services: [{
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    serviceName: String,
  }],
  breakTime: {
    start: String, // Format: "12:00"
    end: String,   // Format: "13:00"
    duration: {
      type: Number, // Duration in minutes
      default: 60,
    },
  },
  clockIn: {
    time: Date,
    location: {
      type: String,
      default: 'Salon',
    },
  },
  clockOut: {
    time: Date,
    location: {
      type: String,
      default: 'Salon',
    },
  },
}, {
  timestamps: true,
});

// Create indexes for efficient querying
shiftSchema.index({ employeeId: 1, date: 1 });
shiftSchema.index({ date: 1, status: 1 });
shiftSchema.index({ employeeId: 1, status: 1 });

// Virtual for shift duration in hours
shiftSchema.virtual('duration').get(function() {
  const start = this.startTime.split(':');
  const end = this.endTime.split(':');
  
  const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
  const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
  
  let duration = endMinutes - startMinutes;
  if (duration < 0) duration += 24 * 60; // Handle overnight shifts
  
  // Subtract break time if provided
  if (this.breakTime && this.breakTime.duration) {
    duration -= this.breakTime.duration;
  }
  
  return parseFloat((duration / 60).toFixed(2)); // Return hours as decimal
});

// Virtual for formatted shift time
shiftSchema.virtual('shiftTime').get(function() {
  return `${this.startTime} - ${this.endTime}`;
});

// Virtual for working hours (excluding break)
shiftSchema.virtual('workingHours').get(function() {
  return this.duration;
});

// Pre-save validation to ensure end time is after start time
shiftSchema.pre('save', function(next) {
  const start = this.startTime.split(':');
  const end = this.endTime.split(':');
  
  const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
  const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
  
  // Allow overnight shifts, but validate reasonable duration (max 16 hours)
  let duration = endMinutes - startMinutes;
  if (duration < 0) duration += 24 * 60;
  
  if (duration > 16 * 60) { // More than 16 hours
    next(new Error('Shift duration cannot exceed 16 hours'));
  } else if (duration < 30) { // Less than 30 minutes
    next(new Error('Shift duration must be at least 30 minutes'));
  } else {
    next();
  }
});

// Static method to find shifts by date range
shiftSchema.statics.findByDateRange = function(startDate, endDate, employeeId = null) {
  const query = {
    date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };
  
  if (employeeId) {
    query.employeeId = employeeId;
  }
  
  return this.find(query)
    .populate('employeeId', 'name email role')
    .populate('assignedBy', 'name email')
    .populate('services.serviceId', 'name duration price')
    .sort({ date: 1, startTime: 1 });
};

// Static method to check for shift conflicts
shiftSchema.statics.checkConflicts = function(employeeId, date, startTime, endTime, excludeShiftId = null) {
  const query = {
    employeeId,
    date: new Date(date),
    status: { $in: ['Scheduled', 'Completed'] },
  };
  
  if (excludeShiftId) {
    query._id = { $ne: excludeShiftId };
  }
  
  return this.find(query).then(shifts => {
    const newStart = startTime.split(':').map(Number);
    const newEnd = endTime.split(':').map(Number);
    const newStartMinutes = newStart[0] * 60 + newStart[1];
    const newEndMinutes = newEnd[0] * 60 + newEnd[1];
    
    return shifts.some(shift => {
      const existingStart = shift.startTime.split(':').map(Number);
      const existingEnd = shift.endTime.split(':').map(Number);
      const existingStartMinutes = existingStart[0] * 60 + existingStart[1];
      const existingEndMinutes = existingEnd[0] * 60 + existingEnd[1];
      
      // Check for overlap
      return (newStartMinutes < existingEndMinutes && newEndMinutes > existingStartMinutes);
    });
  });
};

// Ensure virtuals are included when converting to JSON
shiftSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Shift', shiftSchema);
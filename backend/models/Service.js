const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Service duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
  },
  price: {
    type: Number,
    required: [true, 'Service price is required'],
    min: [0, 'Price must be a positive number'],
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['Haircut', 'Coloring', 'Styling', 'Treatment', 'Nails', 'Facial', 'Massage', 'Other'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String, // URL to service image
    default: '',
  },
  requirements: [{
    type: String, // Special requirements or notes
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
}, {
  timestamps: true,
});

// Create indexes for efficient querying
serviceSchema.index({ category: 1, isActive: 1 });
serviceSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.toFixed(2)}`;
});

// Virtual for formatted duration
serviceSchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
});

// Ensure virtuals are included when converting to JSON
serviceSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Service', serviceSchema);
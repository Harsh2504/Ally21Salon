const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Get all services
// @route   GET /api/services
// @access  Public (or Private based on your need)
const getServices = async (req, res) => {
  try {
    const { category, isActive, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get services with pagination
    const services = await Service.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Service.countDocuments(filter);
    
    res.json({
      services,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Server error while fetching services' });
  }
};

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    console.error('Get service by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid service ID' });
    }
    res.status(500).json({ error: 'Server error while fetching service' });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Manager only)
const createService = async (req, res) => {
  try {
    const { name, description, duration, price, category, image, requirements } = req.body;
    
    // Check if service name already exists
    const existingService = await Service.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingService) {
      return res.status(400).json({ error: 'Service with this name already exists' });
    }
    
    // Create new service
    const service = new Service({
      name,
      description,
      duration,
      price,
      category,
      image,
      requirements: requirements || [],
      createdBy: req.user._id,
    });
    
    await service.save();
    
    // Populate the created service
    await service.populate('createdBy', 'name email');
    
    res.status(201).json({
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Server error while creating service' });
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Manager only)
const updateService = async (req, res) => {
  try {
    const { name, description, duration, price, category, image, requirements, isActive } = req.body;
    
    // Check if service exists
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    // Check if another service has the same name (excluding current service)
    if (name && name !== service.name) {
      const existingService = await Service.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingService) {
        return res.status(400).json({ error: 'Service with this name already exists' });
      }
    }
    
    // Update service
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(duration && { duration }),
        ...(price !== undefined && { price }),
        ...(category && { category }),
        ...(image !== undefined && { image }),
        ...(requirements !== undefined && { requirements }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    res.json({
      message: 'Service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    console.error('Update service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid service ID' });
    }
    res.status(500).json({ error: 'Server error while updating service' });
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Manager only)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    await Service.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid service ID' });
    }
    res.status(500).json({ error: 'Server error while deleting service' });
  }
};

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
const getServiceCategories = async (req, res) => {
  try {
    const categories = ['Haircut', 'Coloring', 'Styling', 'Treatment', 'Nails', 'Facial', 'Massage', 'Other'];
    
    // Get category counts
    const categoryCounts = await Service.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    
    const categoriesWithCounts = categories.map(category => {
      const found = categoryCounts.find(c => c._id === category);
      return {
        name: category,
        count: found ? found.count : 0,
      };
    });
    
    res.json(categoriesWithCounts);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Server error while fetching categories' });
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
};
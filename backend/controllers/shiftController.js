const Shift = require('../models/Shift');
const User = require('../models/User');

// @desc    Get all shifts with filtering
// @route   GET /api/shifts
// @access  Private
const getShifts = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      employeeId, 
      status,
      page = 1, 
      limit = 50 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Date range filter
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else {
      // Default to current month if no date range provided
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      filter.date = {
        $gte: startOfMonth,
        $lte: endOfMonth,
      };
    }
    
    if (employeeId) {
      filter.employeeId = employeeId;
    } else if (req.user.role === 'Employee') {
      // Employees can only see their own shifts
      filter.employeeId = req.user._id;
    }
    
    if (status) {
      filter.status = status;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get shifts with pagination
    const shifts = await Shift.find(filter)
      .populate('employeeId', 'name email role')
      .populate('assignedBy', 'name email')
      .populate('services.serviceId', 'name duration price')
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Shift.countDocuments(filter);
    
    res.json({
      shifts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get shifts error:', error);
    res.status(500).json({ error: 'Server error while fetching shifts' });
  }
};

// @desc    Get shift by ID
// @route   GET /api/shifts/:id
// @access  Private
const getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id)
      .populate('employeeId', 'name email role phone')
      .populate('assignedBy', 'name email')
      .populate('services.serviceId', 'name duration price');
    
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }
    
    // Employees can only view their own shifts
    if (req.user.role === 'Employee' && shift.employeeId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(shift);
  } catch (error) {
    console.error('Get shift by ID error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid shift ID' });
    }
    res.status(500).json({ error: 'Server error while fetching shift' });
  }
};

// @desc    Create new shift
// @route   POST /api/shifts
// @access  Private (Manager only)
const createShift = async (req, res) => {
  try {
    const { 
      employeeId, 
      date, 
      startTime, 
      endTime, 
      shiftType,
      notes,
      services,
      breakTime
    } = req.body;
    
    // Verify employee exists
    const employee = await User.findById(employeeId);
    if (!employee || employee.role !== 'Employee') {
      return res.status(400).json({ error: 'Invalid employee ID' });
    }
    
    // Check for shift conflicts
    const hasConflict = await Shift.checkConflicts(employeeId, date, startTime, endTime);
    if (hasConflict) {
      return res.status(400).json({ 
        error: 'Shift conflicts with existing shift for this employee' 
      });
    }
    
    // Create new shift
    const shift = new Shift({
      employeeId,
      date: new Date(date),
      startTime,
      endTime,
      shiftType: shiftType || 'Regular',
      notes,
      services: services || [],
      breakTime,
      assignedBy: req.user._id,
    });
    
    await shift.save();
    
    // Populate the created shift
    await shift.populate([
      { path: 'employeeId', select: 'name email role' },
      { path: 'assignedBy', select: 'name email' },
      { path: 'services.serviceId', select: 'name duration price' }
    ]);
    
    res.status(201).json({
      message: 'Shift created successfully',
      shift,
    });
  } catch (error) {
    console.error('Create shift error:', error);
    res.status(500).json({ error: 'Server error while creating shift' });
  }
};

// @desc    Update shift
// @route   PUT /api/shifts/:id
// @access  Private (Manager only)
const updateShift = async (req, res) => {
  try {
    const { 
      employeeId, 
      date, 
      startTime, 
      endTime, 
      status,
      shiftType,
      notes,
      services,
      breakTime
    } = req.body;
    
    // Check if shift exists
    const shift = await Shift.findById(req.params.id);
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }
    
    // If updating employee, date, or time, check for conflicts
    if (employeeId || date || startTime || endTime) {
      const checkEmployeeId = employeeId || shift.employeeId;
      const checkDate = date || shift.date;
      const checkStartTime = startTime || shift.startTime;
      const checkEndTime = endTime || shift.endTime;
      
      const hasConflict = await Shift.checkConflicts(
        checkEmployeeId, 
        checkDate, 
        checkStartTime, 
        checkEndTime,
        req.params.id
      );
      
      if (hasConflict) {
        return res.status(400).json({ 
          error: 'Updated shift conflicts with existing shift' 
        });
      }
    }
    
    // Update shift
    const updatedShift = await Shift.findByIdAndUpdate(
      req.params.id,
      {
        ...(employeeId && { employeeId }),
        ...(date && { date: new Date(date) }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(status && { status }),
        ...(shiftType && { shiftType }),
        ...(notes !== undefined && { notes }),
        ...(services !== undefined && { services }),
        ...(breakTime !== undefined && { breakTime }),
      },
      { new: true, runValidators: true }
    ).populate([
      { path: 'employeeId', select: 'name email role' },
      { path: 'assignedBy', select: 'name email' },
      { path: 'services.serviceId', select: 'name duration price' }
    ]);
    
    res.json({
      message: 'Shift updated successfully',
      shift: updatedShift,
    });
  } catch (error) {
    console.error('Update shift error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid shift ID' });
    }
    res.status(500).json({ error: 'Server error while updating shift' });
  }
};

// @desc    Delete shift
// @route   DELETE /api/shifts/:id
// @access  Private (Manager only)
const deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }
    
    // Don't allow deletion of completed shifts
    if (shift.status === 'Completed') {
      return res.status(400).json({ 
        error: 'Cannot delete completed shifts' 
      });
    }
    
    await Shift.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Delete shift error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid shift ID' });
    }
    res.status(500).json({ error: 'Server error while deleting shift' });
  }
};

// @desc    Clock in/out for shift
// @route   PUT /api/shifts/:id/clock
// @access  Private (Employee only, for their own shifts)
const clockInOut = async (req, res) => {
  try {
    const { action, location = 'Salon' } = req.body; // action: 'in' or 'out'
    
    const shift = await Shift.findById(req.params.id);
    
    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' });
    }
    
    // Only the assigned employee can clock in/out
    if (shift.employeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const now = new Date();
    
    if (action === 'in') {
      if (shift.clockIn.time) {
        return res.status(400).json({ error: 'Already clocked in for this shift' });
      }
      
      shift.clockIn = { time: now, location };
      shift.status = 'Scheduled'; // Update status if needed
    } else if (action === 'out') {
      if (!shift.clockIn.time) {
        return res.status(400).json({ error: 'Must clock in before clocking out' });
      }
      
      if (shift.clockOut.time) {
        return res.status(400).json({ error: 'Already clocked out for this shift' });
      }
      
      shift.clockOut = { time: now, location };
      shift.status = 'Completed';
    } else {
      return res.status(400).json({ error: 'Invalid action. Use "in" or "out"' });
    }
    
    await shift.save();
    
    res.json({
      message: `Successfully clocked ${action}`,
      shift,
    });
  } catch (error) {
    console.error('Clock in/out error:', error);
    res.status(500).json({ error: 'Server error while clocking in/out' });
  }
};

// @desc    Get shift statistics
// @route   GET /api/shifts/stats
// @access  Private
const getShiftStats = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;
    
    // Build filter for date range
    const filter = {};
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    
    if (employeeId) {
      filter.employeeId = employeeId;
    } else if (req.user.role === 'Employee') {
      filter.employeeId = req.user._id;
    }
    
    // Get various statistics
    const [
      totalShifts,
      completedShifts,
      scheduledShifts,
      cancelledShifts,
      shiftsByType,
      totalHours
    ] = await Promise.all([
      Shift.countDocuments(filter),
      Shift.countDocuments({ ...filter, status: 'Completed' }),
      Shift.countDocuments({ ...filter, status: 'Scheduled' }),
      Shift.countDocuments({ ...filter, status: 'Cancelled' }),
      Shift.aggregate([
        { $match: filter },
        { $group: { _id: '$shiftType', count: { $sum: 1 } } }
      ]),
      Shift.find({ ...filter, status: 'Completed' })
    ]);
    
    // Calculate total working hours
    let totalWorkingHours = 0;
    totalHours.forEach(shift => {
      totalWorkingHours += shift.duration || 0;
    });
    
    const stats = {
      totalShifts,
      completedShifts,
      scheduledShifts,
      cancelledShifts,
      totalWorkingHours: parseFloat(totalWorkingHours.toFixed(2)),
      shiftsByType: shiftsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      completionRate: totalShifts > 0 ? 
        parseFloat(((completedShifts / totalShifts) * 100).toFixed(1)) : 0,
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get shift stats error:', error);
    res.status(500).json({ error: 'Server error while fetching shift statistics' });
  }
};

module.exports = {
  getShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  clockInOut,
  getShiftStats,
};
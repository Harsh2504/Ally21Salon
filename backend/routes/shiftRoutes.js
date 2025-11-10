const express = require('express');
const router = express.Router();
const {
  getShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
  clockInOut,
  getShiftStats,
} = require('../controllers/shiftController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate, validateQuery, validateParams } = require('../middlewares/zodValidation');
const { shift } = require('../validations');

// Protected routes - accessible by authenticated users
router.get('/stats', protect, validateQuery(shift.shiftStatsSchema.shape.query), getShiftStats);
router.get('/', protect, validateQuery(shift.getShiftsSchema.shape.query), getShifts);
router.get('/:id', protect, validateParams(shift.shiftIdSchema.shape.params), getShiftById);

// Manager-only routes
router.post('/', protect, authorize('manager'), validate(shift.createShiftSchema), createShift);
router.put('/:id', protect, authorize('manager'), validate(shift.updateShiftSchema), updateShift);
router.delete('/:id', protect, authorize('manager'), validateParams(shift.shiftIdSchema.shape.params), deleteShift);

// Employee routes - for clocking in/out
router.put('/:id/clock', protect, validate(shift.clockInOutSchema), clockInOut);

module.exports = router;
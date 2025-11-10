const express = require('express');
const { protect, authorize, authMiddleware } = require('../middlewares/authMiddleware');
const { validate, validateBody, validateParams, validateQuery } = require('../middlewares/zodValidation');
const { leave } = require('../validations');
const leaveController = require('../controllers/leaveController');
const router = express.Router();

// Employee Routes
router.post('/leaves', protect, authorize('employee'), validateBody(leave.createLeaveRequestSchema.shape.body), leaveController.createLeaveRequest); // Create leave
router.get('/leaves', protect, authorize('employee'), validateQuery(leave.getMyLeaveRequestsSchema.shape.query), leaveController.getEmployeeLeaves); // Get all employee leaves
router.get('/leaves/:id', protect, authorize('employee'), validateParams(leave.leaveRequestIdSchema.shape.params), leaveController.getSingleLeaveRequest); // Get single leave request
router.put('/leaves/:id', protect, authorize('employee'), validateParams(leave.leaveRequestIdSchema.shape.params), leaveController.updateLeaveRequest); // Update leave request
router.delete('/leaves/:id', protect, authorize('employee'), validateParams(leave.leaveRequestIdSchema.shape.params), leaveController.deleteLeaveRequest); // Delete leave request

// Manager Routes
router.get('/viewleaves/manager', protect, authorize('manager'), validateQuery(leave.getLeaveRequestsSchema.shape.query), leaveController.getAllLeaveRequests); // Get all leave requests
router.put('/viewleaves/manager/:id', protect, authorize('manager'), validate(leave.updateLeaveRequestSchema), leaveController.acceptOrRejectLeaveRequest); // Accept/Reject leave request

// Dashboard route for leave requests (alias for easier frontend access)
router.get('/', protect, authorize('manager'), validateQuery(leave.getLeaveRequestsSchema.shape.query), leaveController.getAllLeaveRequests); // Get leave requests for dashboard

module.exports = router;

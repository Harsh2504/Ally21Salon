const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const leaveController = require('../controllers/leaveController');
const router = express.Router();

// Employee Routes
router.post('/leaves', authMiddleware(['Employee']), leaveController.createLeaveRequest); // Create leave
router.get('/leaves', authMiddleware(['Employee']), leaveController.getEmployeeLeaves); // Get all employee leaves
router.get('/leaves/:id', authMiddleware(['Employee']), leaveController.getSingleLeaveRequest); // Get single leave request
router.put('/leaves/:id', authMiddleware(['Employee']), leaveController.updateLeaveRequest); // Update leave request
router.delete('/leaves/:id', authMiddleware(['Employee']), leaveController.deleteLeaveRequest); // Delete leave request

// Manager Routes
router.get('/viewleaves/manager', authMiddleware(['Manager']), leaveController.getAllLeaveRequests); // Get all leave requests
router.put('/viewleaves/manager/:id', authMiddleware(['Manager']), leaveController.acceptOrRejectLeaveRequest); // Accept/Reject leave request

module.exports = router;

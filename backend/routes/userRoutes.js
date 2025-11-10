const express = require('express');
const { protect, authorize, authMiddleware } = require('../middlewares/authMiddleware');
const { validateBody, validateParams, validateQuery } = require('../middlewares/zodValidation');
const { auth } = require('../validations');
const userController = require('../controllers/userController');  // Import the user controller
const authController = require('../controllers/authController');  // Import the user controller
const router = express.Router();

// Protected route to get user profile
router.get('/profile', protect, userController.getUserProfile);

// Protected route to update user profile
router.put('/profile', protect, validateBody(auth.updateProfileSchema.shape.body), userController.updateUserProfile);

// Protected route to change password
router.put('/password', protect, validateBody(auth.changePasswordSchema.shape.body), userController.changePassword);

// Route to get all employees (accessible only by Manager)
router.get('/employees', protect, authorize('manager'), validateQuery(auth.getUsersSchema.shape.query), userController.getAllEmployees);

// Route to get an employee by ID (accessible only by Manager)
router.get('/employees/:id', protect, authorize('manager'), validateParams(auth.userIdSchema.shape.params), userController.getEmployeeById);

// Route to add a new employee (accessible only by Manager)
router.post('/employees', protect, authorize('manager'), validateBody(auth.registerSchema.shape.body), authController.registerUser);

// Route to update an employee by ID (accessible only by Manager)
router.put('/employees/:id', protect, authorize('manager'), validateParams(auth.userIdSchema.shape.params), userController.updateEmployee);

// Route to delete an employee by ID (accessible only by Manager)
router.delete('/employees/:id', protect, authorize('manager'), validateParams(auth.userIdSchema.shape.params), userController.deleteEmployee);

module.exports = router;

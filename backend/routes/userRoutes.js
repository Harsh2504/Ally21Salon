const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');  // Import the user controller
const authController = require('../controllers/authController');  // Import the user controller
const router = express.Router();

// Protected route to get user profile
router.get('/profile', authMiddleware(), userController.getUserProfile);

// Protected route to update user profile
router.put('/profile', authMiddleware(), userController.updateUserProfile);

// Protected route to change password
router.put('/password', authMiddleware(), userController.changePassword);

// Route to get all employees (accessible only by Manager)
router.get('/employees', authMiddleware(['Manager']), userController.getAllEmployees);

// Route to get an employee by ID (accessible only by Manager)
router.get('/employees/:id', authMiddleware(['Manager']), userController.getEmployeeById);

// Route to add a new employee (accessible only by Manager)
router.post('/employees', authMiddleware(['Manager']), authController.registerUser);

// Route to update an employee by ID (accessible only by Manager)
router.put('/employees/:id', authMiddleware(['Manager']), userController.updateEmployee);

// Route to delete an employee by ID (accessible only by Manager)
router.delete('/employees/:id', authMiddleware(['Manager']), userController.deleteEmployee);
module.exports = router;

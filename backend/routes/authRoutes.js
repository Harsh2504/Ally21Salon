const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { validateBody } = require('../middlewares/zodValidation');
const { auth } = require('../validations');
const router = express.Router();

// Route for user registration
router.post('/register', validateBody(auth.registerSchema.shape.body), registerUser);

// Route for user login
router.post('/login', validateBody(auth.loginSchema.shape.body), loginUser);

module.exports = router;

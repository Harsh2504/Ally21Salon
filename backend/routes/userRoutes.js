const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Example of a protected route
router.get('/profile', authMiddleware, (req, res) => {
    // Access the user info attached to req.user
    res.json({ message: 'Profile data', user: req.user });
});

module.exports = router;

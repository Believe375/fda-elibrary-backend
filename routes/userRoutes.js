const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

// Register user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get books uploaded by this user (requires login)
router.get('/my-books', authMiddleware.verifyToken, bookController.getUserBooks);

// Get dashboard stats (admin only)
router.get('/stats', authMiddleware.verifyAdmin, bookController.getStats);

module.exports = router;
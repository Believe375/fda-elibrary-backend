const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Admin-only route
router.get('/all-users', verifyToken, verifyAdmin, authController.getAllUsers);

console.log({
  register: typeof authController.register,
  login: typeof authController.login,
  getAllUsers: typeof authController.getAllUsers,
  verifyToken: typeof verifyToken,
  verifyAdmin: typeof verifyAdmin
});

module.exports = router;
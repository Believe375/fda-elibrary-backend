const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'default_jwt_secret'; // Use environment variable for production

/**
 * Generate a JWT token for a user
 * @param {Object} user - The user object to embed in the token
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET, {
    expiresIn: '7d', // Token validity
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - The JWT token
 * @returns {Object|null} Decoded token or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
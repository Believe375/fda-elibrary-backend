const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') cb(null, 'uploads/images');
    else if (file.fieldname === 'file') cb(null, 'uploads/files');
    else cb(null, 'uploads/others');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// PUBLIC ROUTES
router.get('/', bookController.getBooks);
router.get('/categories', bookController.getCategories);

// PROTECTED ROUTES
router.get('/user', verifyToken, bookController.getUserBooks);
router.post('/upload', verifyToken, verifyAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), bookController.uploadBook);
router.delete('/:id', verifyToken, verifyAdmin, bookController.deleteBook);

module.exports = router;
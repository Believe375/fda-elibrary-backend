const express = require('express');
const router = express.Router();
const { createCategory, getAllCategories } = require('../controllers/categoryController');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', getAllCategories);
router.post('/', verifyAdmin, createCategory);

module.exports = router;
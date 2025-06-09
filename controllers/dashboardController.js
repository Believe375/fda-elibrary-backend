const User = require('../models/User');
const Book = require('../models/Book');
const Category = require('../models/Category');

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalCategories = await Category.countDocuments();
    const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      totalUsers,
      totalBooks,
      totalCategories,
      recentBooks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load dashboard stats', error });
  }
};
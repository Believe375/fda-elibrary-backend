const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// Upload a new book
exports.uploadBook = async (req, res) => {
  try {
    const { title, author, category, description } = req.body;

    const image = req.files?.image?.[0];
    const file = req.files?.file?.[0];

    const newBook = new Book({
      title,
      author,
      category,
      description,
      imageUrl: image ? `/uploads/${image.filename}` : '',
      fileUrl: file ? `/uploads/${file.filename}` : '',
      uploadedBy: req.user.id
    });

    await newBook.save();

    res.status(201).json({ message: 'Book uploaded successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading book', error });
  }
};

// Get all books with optional filters
exports.getBooks = async (req, res) => {
  try {
    const { title, category, page = 1, limit = 12 } = req.query;

    const query = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    if (category) query.category = category;

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ total, books });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};

// Delete a book (admin only)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book)
      return res.status(404).json({ message: 'Book not found' });

    if (book.imageUrl) {
      const imagePath = path.join(__dirname, '..', book.imageUrl);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    if (book.fileUrl) {
      const filePath = path.join(__dirname, '..', book.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await book.deleteOne();
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
};

// Get books uploaded by a specific user
exports.getUserBooks = async (req, res) => {
  try {
    const books = await Book.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user books', error });
  }
};

// Get category list
exports.getCategories = async (req, res) => {
  try {
    const categories = await Book.distinct('category');
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

// Get dashboard stats
exports.getStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalUsers = await require('../models/User').countDocuments();
    res.status(200).json({ totalBooks, totalUsers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error });
  }
};
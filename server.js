const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Serve uploaded PDF files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve all static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// Mount API routes
app.use('/api', routes);

// Serve admin dashboard at /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'admin', 'index.html'));
});

// Fallback: serve main index.html for any unknown frontend route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start server after connecting to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server live on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection error:', err);
    process.exit(1);
  });
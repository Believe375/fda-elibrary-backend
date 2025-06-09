const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const routes = require('./routes'); // Combined routes index

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));

// Serve uploaded files (e.g., book files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')));

// API routes
app.use('/api', routes);

// SPA fallback (support client-side routing on Netlify or Render)
app.get('*', (req, res) => {
  const requestedPath = path.join(__dirname, 'frontend', req.path);
  if (fs.existsSync(requestedPath) && requestedPath.endsWith('.html')) {
    res.sendFile(requestedPath);
  } else {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
  }
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(' MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection error:', err.message);
    process.exit(1);
  });
const fs = require('fs');
const path = require('path');

/**
 * Delete a file from the uploads directory.
 * @param {string} filePath - Relative path to the file (e.g., 'uploads/book.pdf').
 */
const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, '..', filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${filePath}`, err.message);
    } else {
      console.log(`Deleted file: ${filePath}`);
    }
  });
};

module.exports = {
  deleteFile,
};
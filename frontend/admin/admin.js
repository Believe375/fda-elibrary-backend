document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const booksList = document.getElementById('booksList');
  const uploadMessage = document.getElementById('uploadMessage');

  const token = localStorage.getItem('token'); // Must be set at login

  async function loadBooks() {
    try {
      const res = await fetch('/api/books');
      const data = await res.json();
      renderBooks(data.books || data);
    } catch {
      booksList.innerHTML = '<p>Error loading books.</p>';
    }
  }

  function renderBooks(books) {
    booksList.innerHTML = '';
    books.forEach(book => {
      const div = document.createElement('div');
      div.className = 'book-item';
      div.innerHTML = `
        <span><strong>${book.title}</strong> by ${book.author} [${book.category}]</span>
        <a href="${book.fileUrl}" target="_blank">Download</a>
        <button data-id="${book._id}">Delete</button>
      `;
      div.querySelector('button').addEventListener('click', () => deleteBook(book._id));
      booksList.appendChild(div);
    });
  }

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);

    try {
      const res = await fetch('/api/books/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const result = await res.json();
      uploadMessage.textContent = result.message || 'Upload successful!';
      uploadForm.reset();
      loadBooks();
    } catch (err) {
      uploadMessage.textContent = 'Upload failed.';
    }
  });

  async function deleteBook(bookId) {
    if (!confirm('Delete this book?')) return;
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const result = await res.json();
      alert(result.message || 'Deleted.');
      loadBooks();
    } catch (err) {
      alert('Failed to delete.');
    }
  }

  loadBooks();
});
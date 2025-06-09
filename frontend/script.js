const API_BASE = "/api";
let currentUser = null;
let isAdmin = false;

// Elements
const archiveList = document.getElementById("archiveList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const yearFilter = document.getElementById("yearFilter");
const uploadSection = document.getElementById("uploadSection");
const uploadForm = document.getElementById("uploadForm");
const fileInput = document.getElementById("fileInput");
const adminPanel = document.getElementById("adminPanel");

// Helper to get current user via Netlify Identity
function checkUserRole() {
  const user = netlifyIdentity.currentUser();
  if (user) {
    currentUser = user;
    const roles = user.app_metadata?.roles || [];
    isAdmin = roles.includes("admin");

    if (isAdmin) {
      uploadSection.style.display = "block";
      adminPanel.style.display = "block";
    }
  }
}

// Fetch and render archives
async function fetchArchives() {
  try {
    const res = await fetch(`${API_BASE}/books`);
    const data = await res.json();
    renderArchives(data);
    populateFilters(data);
  } catch (err) {
    archiveList.innerHTML = `<p class="error">Failed to load archives. Please try again later.</p>`;
  }
}

// Render archive cards
function renderArchives(data) {
  archiveList.innerHTML = "";
  if (data.length === 0) {
    archiveList.innerHTML = `<p>No results found.</p>`;
    return;
  }

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "archive-card";
    card.innerHTML = `
      <div class="info">
        <h3>${item.title}</h3>
        <p class="meta">Category: ${item.category} | Date: ${item.date}</p>
      </div>
      <div class="actions">
        <a href="${item.viewUrl}" class="btn view" target="_blank">View</a>
        <a href="${item.downloadUrl}" class="btn download" target="_blank">Download</a>
        ${isAdmin ? `<button class="btn delete" onclick="deleteBook('${item._id}')">Delete</button>` : ""}
      </div>
    `;
    archiveList.appendChild(card);
  });
}

// Populate category and year filters
function populateFilters(data) {
  const categories = [...new Set(data.map(item => item.category))];
  const years = [...new Set(data.map(item => item.year))];

  categoryFilter.innerHTML = `<option value="">All Categories</option>` +
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");

  yearFilter.innerHTML = `<option value="">All Years</option>` +
    years.map(year => `<option value="${year}">${year}</option>`).join("");
}

// Filtering logic
function filterArchives() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const year = yearFilter.value;

  fetch(`${API_BASE}/books`)
    .then(res => res.json())
    .then(data => {
      const filtered = data.filter(item => {
        const matchSearch = item.title.toLowerCase().includes(search);
        const matchCategory = !category || item.category === category;
        const matchYear = !year || item.year === year;
        return matchSearch && matchCategory && matchYear;
      });
      renderArchives(filtered);
    });
}

// Handle file upload (admin)
uploadForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!fileInput.files.length) {
    alert("Please select a file to upload.");
    return;
  }

  const formData = new FormData(uploadForm);
  const token = await currentUser.jwt();

  try {
    const res = await fetch(`${API_BASE}/books`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");

    alert("Upload successful!");
    uploadForm.reset();
    fetchArchives();
  } catch (err) {
    alert("Upload failed. Please try again.");
  }
});

// Delete book (admin only)
async function deleteBook(bookId) {
  const confirmed = confirm("Are you sure you want to delete this book?");
  if (!confirmed) return;

  const token = await currentUser.jwt();

  try {
    const res = await fetch(`${API_BASE}/books/${bookId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("Delete failed");
    fetchArchives();
  } catch (err) {
    alert("Delete failed.");
  }
}

// Event listeners
searchInput?.addEventListener("input", filterArchives);
categoryFilter?.addEventListener("change", filterArchives);
yearFilter?.addEventListener("change", filterArchives);

// Initialize
netlifyIdentity.on("init", checkUserRole);
netlifyIdentity.on("login", () => location.reload());
netlifyIdentity.on("logout", () => location.reload());
netlifyIdentity.init();

fetchArchives();
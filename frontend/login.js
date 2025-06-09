document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        loginMessage.textContent = data.message || 'Login failed';
        return;
      }

      // Save token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      loginMessage.textContent = 'Login successful';

      // Redirect admin to dashboard
      if (data.user.isAdmin) {
        window.location.href = '/admin.html';
      } else {
        // Redirect user to main page or user dashboard
        window.location.href = '/';
      }
    } catch (err) {
      loginMessage.textContent = 'Login error';
    }
  });
});
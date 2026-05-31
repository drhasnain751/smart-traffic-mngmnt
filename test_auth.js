// test_auth.js – automated login & signup checks
import fetch from 'node-fetch';

const API_URL = 'http://localhost:5002';

async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  console.log('Login', email, 'status:', res.status);
  console.log(data);
}

async function signup(name, email, password, role = 'OPERATOR') {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await res.json();
  console.log('Signup', email, 'status:', res.status);
  console.log(data);
}

(async () => {
  // Login with default admin (should exist from seed)
  await login('admin@smartcity.gov', 'admin123');

  // Register a new user
  const newEmail = 'newuser@example.com';
  await signup('New User', newEmail, 'newpass123');

  // Login with new user
  await login(newEmail, 'newpass123');
})();

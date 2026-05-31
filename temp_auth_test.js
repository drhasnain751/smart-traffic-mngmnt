// temp_auth_test.js
// Simple Node script to test signup and login flows for the Smart IoT Traffic Management System.

import fetch from 'node-fetch';

const API_URL = 'http://localhost:5002/api/auth';
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'Password123!',
  role: 'OPERATOR'
};

async function signup() {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  const data = await res.json();
  console.log('Signup status:', res.status);
  console.log('Signup response:', data);
  return data;
}

async function login() {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  });
  const data = await res.json();
  console.log('Login status:', res.status);
  console.log('Login response:', data);
  return data;
}

(async () => {
  try {
    console.log('--- Testing Signup ---');
    await signup();
    console.log('\n--- Testing Login ---');
    await login();
  } catch (err) {
    console.error('Error during auth test:', err);
  }
})();

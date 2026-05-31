/* auto_auth_test.js – runs signup and login automatically */
// Using global fetch (Node 18+). No external dependency needed.

const API_URL = 'http://localhost:5002/api/auth';
const testUser = {
  email: 'auto_test_user@example.com',
  password: 'AutoPass123!',
  name: 'Auto Test User',
  role: 'OPERATOR',
};

async function signup() {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser),
  });
  const data = await res.json();
  console.log('Signup response status:', res.status);
  console.log('Signup response body:', JSON.stringify(data, null, 2));
  if (!res.ok) throw new Error('Signup failed');
  return data.token;
}

async function login() {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password }),
  });
  const data = await res.json();
  console.log('Login response status:', res.status);
  console.log('Login response body:', JSON.stringify(data, null, 2));
  if (!res.ok) throw new Error('Login failed');
  return data.token;
}

(async () => {
  try {
    const signupToken = await signup();
    console.log('✅ Signup succeeded, token:', signupToken);
    const loginToken = await login();
    console.log('✅ Login succeeded, token:', loginToken);
  } catch (err) {
    console.error('❌ Error during auth automation:', err.message);
  }
})();
